# WoW Midnight Profession Profit Calculator — Design Document

**Date:** 2026-03-23
**Status:** Approved

## Overview

A web-based profit calculator for World of Warcraft: Midnight professions, focused on **Blacksmithing** (alloy crafting) and **Jewelcrafting** (prospecting/crushing). Inspired by a TWW-era Google Sheets calculator, rebuilt as a modern Next.js app with Blizzard API integration.

## Goals

- Calculate crafting profitability for alloys and prospecting
- Fetch AH prices via Blizzard API (~1hr snapshots) with manual override capability
- Factor in Resourcefulness, Multicraft, and AH cut
- Provide actionable recommendations ("Craft the Mats?", "Prospect or Sell?")
- Generate Auctionator shopping strings for in-game use
- Host on Vercel, accessible from any device

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (dark WoW-themed) |
| State | Zustand |
| Persistence | localStorage (stats, manual prices, region) |
| API Proxy | Next.js API routes (Blizzard AH API) |
| Hosting | Vercel |

No database, no auth, no accounts.

---

## Data Model

### Recipes (hardcoded)

**Blacksmithing Alloys:**

| Alloy | Materials |
|-------|-----------|
| Refulgent Copper Ingot | 5x Refulgent Copper Ore |
| Gloaming Alloy | 4x Luminant Flux, 6x Umbral Tin Ore, 3x Refulgent Copper Ingot |
| Sterling Alloy | 4x Luminant Flux, 6x Brilliant Silver Ore, 3x Refulgent Copper Ingot |

**Jewelcrafting Prospecting (5 ore per prospect):**

| Ore | Gems (drop rates) |
|-----|-------------------|
| Refulgent Copper | Sanguine Garnet (~8%), Amani Lapis (~8%), Harandar Peridot (~8%), Tenebrous Amethyst (~8%), Eversong Diamond (~2.5%) |
| Umbral Tin | Harandar Peridot (~12%), Tenebrous Amethyst (~12%), Flawless Harandar Peridot (~12%), Flawless Tenebrous Amethyst (~12%), Eversong Diamond (~4.5%) |
| Brilliant Silver | Sanguine Garnet (~12%), Amani Lapis (~12%), Flawless Sanguine Garnet (~12%), Flawless Amani Lapis (~12%), Eversong Diamond (~4.5%) |
| Dazzling Thorium | All 4 Flawless gems (~15% each), Eversong Diamond (~22%) |

All prospects also yield: Duskshrouded Stone, Crystalline Glass (guaranteed byproducts).

**Crushing:** Gems -> Glimmering Gemdust (~0.67 yield per crush)

### Prices (dynamic)

- Fetched from Blizzard AH Commodities API (region-wide, US or EU)
- Manually overridable per item
- Stored in React state, persisted to localStorage

### Player Stats (user input)

- Resourcefulness % (Blacksmithing + Jewelcrafting)
- Multicraft % (Blacksmithing only — prospecting cannot multicraft)
- Persisted to localStorage

### Quality System

Midnight uses 2 quality ranks: **Silver** and **Gold** (no more Bronze).

---

## Calculation Engine

### Alloy Crafting (Blacksmithing)

```
base_material_cost = SUM(qty * price) for each reagent
resourcefulness_savings = resourcefulness% * 0.30
adjusted_cost = base_material_cost * (1 - resourcefulness_savings)
total_cost = adjusted_cost * num_crafts

// Multicraft: 1.5x average bonus per proc (community-tested)
effective_output = num_crafts * (1 + multicraft% * 1.5)

revenue = effective_output * sale_price * (1 - 0.05)  // 5% AH cut
profit = revenue - total_cost
roi = profit / total_cost * 100
cost_per_unit = total_cost / effective_output
```

### "Craft the Mats?" Logic

```
// For each intermediate (e.g., Refulgent Copper Ingot):
buy_cost = AH_price * quantity_needed
craft_cost = raw_material_cost * (1 - resourcefulness_savings)
recommendation = buy_cost < craft_cost ? "Buy" : "Craft"
```

### Prospecting (Jewelcrafting)

```
cost_per_prospect = 5 * ore_price
adjusted_cost = cost_per_prospect * (1 - resourcefulness% * 0.30)

expected_value = SUM(gem_price * drop_rate) + byproduct_values
profit_per_prospect = expected_value - adjusted_cost

// "Should I prospect or sell the ore?"
sell_value = 5 * ore_price * (1 - 0.05)  // selling ore directly
prospect_ev = expected_value
recommendation = prospect_ev > sell_value ? "Prospect" : "Sell Ore"
```

### Crushing (Jewelcrafting)

```
crush_cost = gem_price
crush_output = 0.67 * gemdust_price  // avg yield
crush_profit = crush_output - crush_cost
```

### Key Constants

- **AH Cut:** 5% (auto-applied to all revenue)
- **Multicraft avg bonus:** 1.5x base yield per proc
- **Resourcefulness savings:** up to 30% of one material per proc
- **Prospect batch size:** 5 ore

---

## UI Layout

### Global Header
- App title / logo
- Region selector (US / EU) — persisted
- "Refresh Prices" button → calls Blizzard API
- Last updated timestamp

### Tab: Blacksmithing

**Your Stats (sidebar/top)**
- Resourcefulness % input
- Multicraft % input
- Saved to localStorage

**Prices Table**
- All materials: Refulgent Copper Ore, Umbral Tin Ore, Brilliant Silver Ore, Luminant Flux, Refulgent Copper Ingot, Gloaming Alloy, Sterling Alloy
- Two quality columns (Silver / Gold)
- API-fetched with per-cell manual override (yellow highlight on manual cells)

**Profits Table**
- Rows: each alloy x each quality rank
- Columns: Recipe, Rank, # of Crafts (editable), Cost, Revenue, Profit, ROI, Cost Per Unit, "Craft the Mats?" recommendation
- Green/red coloring on profit cells

**Auctionator Shopping String**
- Auto-generated, copy-to-clipboard button

### Tab: Jewelcrafting

**Your Stats**
- Resourcefulness % input

**Prices Table**
- Ores: Refulgent Copper, Umbral Tin, Brilliant Silver, Dazzling Thorium
- Gems: Sanguine Garnet, Amani Lapis, Harandar Peridot, Tenebrous Amethyst (+ Flawless variants), Eversong Diamond
- Byproducts: Duskshrouded Stone, Crystalline Glass, Glimmering Gemdust

**Prospecting Table**
- Rows: each ore type
- Columns: Cost per prospect, Expected gem value, Profit, ROI, "Prospect or Sell?" recommendation

**Crushing Table**
- Per-gem crush profitability

**Auctionator Shopping String**
- Auto-generated, copy-to-clipboard button

### Styling
- Dark theme (WoW-inspired, deep blues/purples/golds)
- Clean data tables
- Green = profitable, Red = loss
- Responsive (works on mobile)

---

## Blizzard API Integration

### Endpoint
```
GET https://{region}.api.blizzard.com/data/wow/auctions/commodities
```
- Region: `us` or `eu`
- Auth: OAuth2 client credentials flow
- Returns all commodity listings region-wide
- Updates ~hourly

### API Route (`/api/prices`)
- Server-side Next.js route (keeps API key secure)
- Accepts `?region=us|eu`
- Fetches commodity data, filters to relevant item IDs
- Returns clean JSON: `{ itemId, itemName, minPrice, quantity }`
- Caches response for 5 minutes to avoid rate limits

### Item IDs
Will need to map Midnight item names to Blizzard item IDs (obtainable from Wowhead).

---

## Auctionator Shopping String Format

```
Blacksmithing^"Refulgent Copper Ore"^"Umbral Tin Ore"^"Brilliant Silver Ore"^"Luminant Flux"^"Refulgent Copper Ingot"^"Gloaming Alloy"^"Sterling Alloy"
```

```
Jewelcrafting^"Refulgent Copper Ore"^"Umbral Tin Ore"^"Brilliant Silver Ore"^"Dazzling Thorium"^"Sanguine Garnet"^"Amani Lapis"^"Harandar Peridot"^"Tenebrous Amethyst"^"Eversong Diamond"^"Duskshrouded Stone"^"Crystalline Glass"
```

---

## Future Expansion Ideas (not in v1)

- Additional professions (Alchemy, Inscription, etc.)
- Knowledge tree builder (interactive spec planner)
- Historical price charts
- TSM API integration as alternate price source
- Profit alerts / notifications
