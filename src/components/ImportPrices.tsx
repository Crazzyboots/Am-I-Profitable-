'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

// Maps Auctionator export names to our material IDs
// "Tier 1" = Silver, "Tier 2" = Gold
const NAME_MAP: Record<string, string> = {
  // Ores
  'refulgent copper ore tier 1': 'refulgent-copper-ore-silver',
  'refulgent copper ore tier 2': 'refulgent-copper-ore-gold',
  'umbral tin ore tier 1': 'umbral-tin-ore-silver',
  'umbral tin ore tier 2': 'umbral-tin-ore-gold',
  'brilliant silver ore tier 1': 'brilliant-silver-ore-silver',
  'brilliant silver ore tier 2': 'brilliant-silver-ore-gold',
  'dazzling thorium tier 1': 'dazzling-thorium-silver',
  'dazzling thorium tier 2': 'dazzling-thorium-gold',

  // Vendor
  'luminant flux': 'luminant-flux',

  // Alloys
  'refulgent copper ingot tier 1': 'refulgent-copper-ingot-silver',
  'refulgent copper ingot tier 2': 'refulgent-copper-ingot-gold',
  'gloaming alloy tier 1': 'gloaming-alloy-silver',
  'gloaming alloy tier 2': 'gloaming-alloy-gold',
  'sterling alloy tier 1': 'sterling-alloy-silver',
  'sterling alloy tier 2': 'sterling-alloy-gold',

  // Gems
  'sanguine garnet tier 1': 'sanguine-garnet-silver',
  'sanguine garnet tier 2': 'sanguine-garnet-gold',
  'amani lapis tier 1': 'amani-lapis-silver',
  'amani lapis tier 2': 'amani-lapis-gold',
  'harandar peridot tier 1': 'harandar-peridot-silver',
  'harandar peridot tier 2': 'harandar-peridot-gold',
  'tenebrous amethyst tier 1': 'tenebrous-amethyst-silver',
  'tenebrous amethyst tier 2': 'tenebrous-amethyst-gold',
  'flawless sanguine garnet tier 1': 'flawless-sanguine-garnet-silver',
  'flawless sanguine garnet tier 2': 'flawless-sanguine-garnet-gold',
  'flawless amani lapis tier 1': 'flawless-amani-lapis-silver',
  'flawless amani lapis tier 2': 'flawless-amani-lapis-gold',
  'flawless harandar peridot tier 1': 'flawless-harandar-peridot-silver',
  'flawless harandar peridot tier 2': 'flawless-harandar-peridot-gold',
  'flawless tenebrous amethyst tier 1': 'flawless-tenebrous-amethyst-silver',
  'flawless tenebrous amethyst tier 2': 'flawless-tenebrous-amethyst-gold',
  'eversong diamond': 'eversong-diamond',

  // Byproducts
  'duskshrouded stone': 'duskshrouded-stone',
  'crystalline glass': 'crystalline-glass',
  'glimmering gemdust': 'glimmering-gemdust',
};

function parseAuctionatorCSV(csv: string): Record<string, number> {
  const prices: Record<string, number> = {};
  const lines = csv.trim().split('\n');

  for (const line of lines) {
    // Skip header
    if (line.startsWith('"Price"') || line.startsWith('Price')) continue;

    // Parse CSV: price,"name",itemLevel,"owned",available
    const match = line.match(/^(\d+),"([^"]+)"/);
    if (!match) continue;

    const priceInCopper = parseInt(match[1], 10);
    const name = match[2].trim().toLowerCase();
    const priceInGold = priceInCopper / 10000;

    const materialId = NAME_MAP[name];
    if (materialId) {
      prices[materialId] = priceInGold;
    }
  }

  return prices;
}

export default function ImportPrices() {
  const [isOpen, setIsOpen] = useState(false);
  const [pasteData, setPasteData] = useState('');
  const [importResult, setImportResult] = useState<string | null>(null);
  const setPrice = useAppStore((s) => s.setPrice);

  function handleImport() {
    const prices = parseAuctionatorCSV(pasteData);
    const count = Object.keys(prices).length;

    if (count === 0) {
      setImportResult('No matching items found. Make sure you pasted the Auctionator export data.');
      return;
    }

    for (const [materialId, price] of Object.entries(prices)) {
      setPrice(materialId, price, true);
    }

    setImportResult(`Imported ${count} prices successfully!`);
    setTimeout(() => {
      setIsOpen(false);
      setPasteData('');
      setImportResult(null);
    }, 1500);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium px-4 py-1.5 rounded transition-colors"
      >
        Import Prices
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-lg font-bold text-amber-400 mb-2">Import Auctionator Prices</h2>
        <p className="text-xs text-gray-400 mb-4">
          Paste your Auctionator / CraftSim export CSV below. Format: price in copper, item name with Tier 1 (Silver) or Tier 2 (Gold).
        </p>
        <textarea
          value={pasteData}
          onChange={(e) => setPasteData(e.target.value)}
          placeholder={`"Price","Name","Item Level","Owned?","Available"\n1757800,"Refulgent Copper Ore Tier 2",23,"",87722\n393400,"Refulgent Copper Ore Tier 1",23,"",556990`}
          className="w-full h-48 bg-gray-800 border border-gray-700 rounded p-3 text-sm text-gray-200 font-mono focus:outline-none focus:border-amber-500 resize-none"
        />

        {importResult && (
          <p className={`mt-2 text-sm ${importResult.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
            {importResult}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => {
              setIsOpen(false);
              setPasteData('');
              setImportResult(null);
            }}
            className="text-sm text-gray-400 hover:text-gray-200 px-4 py-1.5"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!pasteData.trim()}
            className="bg-amber-700 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
