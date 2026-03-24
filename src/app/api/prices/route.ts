import { NextRequest, NextResponse } from 'next/server';
import { materials } from '@/data/materials';

// Blizzard API OAuth token cache
let cachedToken: { token: string; expires: number } | null = null;
// Price cache (5 min)
let priceCache: { data: Record<string, number>; expires: number; region: string } | null = null;

const ITEM_IDS = new Set(materials.map((m) => m.itemId));
const ITEM_ID_TO_MATERIAL = new Map(materials.map((m) => [m.itemId, m.id]));

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Blizzard API credentials not configured');
  }

  const resp = await fetch('https://oauth.battle.net/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!resp.ok) {
    throw new Error(`Failed to get Blizzard token: ${resp.status}`);
  }

  const data = await resp.json();
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region') || 'us';

  if (region !== 'us' && region !== 'eu') {
    return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
  }

  // Return cached prices if fresh
  if (priceCache && priceCache.region === region && Date.now() < priceCache.expires) {
    return NextResponse.json({
      prices: priceCache.data,
      cached: true,
      lastUpdated: new Date(priceCache.expires - 5 * 60 * 1000).toISOString(),
    });
  }

  try {
    const token = await getAccessToken();

    // Fetch commodities (region-wide for retail)
    const auctionResp = await fetch(
      `https://${region}.api.blizzard.com/data/wow/auctions/commodities?namespace=dynamic-${region}&locale=en_US`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!auctionResp.ok) {
      throw new Error(`Blizzard API error: ${auctionResp.status}`);
    }

    const auctionData = await auctionResp.json();
    const prices: Record<string, number> = {};

    // Find minimum price for each item we care about
    // Commodities API returns all auctions; we want the lowest price per item
    if (auctionData.auctions) {
      for (const auction of auctionData.auctions) {
        const itemId = auction.item?.id;
        if (!itemId || !ITEM_IDS.has(itemId)) continue;

        const materialId = ITEM_ID_TO_MATERIAL.get(itemId);
        if (!materialId) continue;

        // Price is in copper, convert to gold
        const priceInGold = (auction.unit_price || auction.buyout || 0) / 10000;
        if (!prices[materialId] || priceInGold < prices[materialId]) {
          prices[materialId] = priceInGold;
        }
      }
    }

    // Cache for 5 minutes
    priceCache = {
      data: prices,
      expires: Date.now() + 5 * 60 * 1000,
      region,
    };

    return NextResponse.json({
      prices,
      cached: false,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    // If it's a config error, return a helpful message
    if (message.includes('not configured')) {
      return NextResponse.json(
        {
          error: 'Blizzard API not configured. Set BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET environment variables.',
          prices: {},
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message, prices: {} }, { status: 500 });
  }
}
