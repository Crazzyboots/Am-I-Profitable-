'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { prospectingRecipes, crushingRecipes } from '@/data/recipes';
import {
  calcProspectProfit,
  calcCrushProfit,
  generateJewelcraftingShoppingString,
  formatGold,
} from '@/lib/calculations';
import PriceInput from './PriceInput';
import StatsInput from './StatsInput';
import ShoppingString from './ShoppingString';

const JC_ORES = [
  { id: 'refulgent-copper-ore', label: 'Refulgent Copper Ore' },
  { id: 'umbral-tin-ore', label: 'Umbral Tin Ore' },
  { id: 'brilliant-silver-ore', label: 'Brilliant Silver Ore' },
  { id: 'dazzling-thorium', label: 'Dazzling Thorium' },
];

const JC_GEMS = [
  { id: 'sanguine-garnet', label: 'Sanguine Garnet' },
  { id: 'amani-lapis', label: 'Amani Lapis' },
  { id: 'harandar-peridot', label: 'Harandar Peridot' },
  { id: 'tenebrous-amethyst', label: 'Tenebrous Amethyst' },
  { id: 'flawless-sanguine-garnet', label: 'Flawless Sanguine Garnet' },
  { id: 'flawless-amani-lapis', label: 'Flawless Amani Lapis' },
  { id: 'flawless-harandar-peridot', label: 'Flawless Harandar Peridot' },
  { id: 'flawless-tenebrous-amethyst', label: 'Flawless Tenebrous Amethyst' },
  { id: 'eversong-diamond', label: 'Eversong Diamond' },
];

const JC_BYPRODUCTS = [
  { id: 'duskshrouded-stone', label: 'Duskshrouded Stone' },
  { id: 'crystalline-glass', label: 'Crystalline Glass' },
  { id: 'glimmering-gemdust', label: 'Glimmering Gemdust' },
];

export default function JewelcraftingTab() {
  const { jcStats, setJcStats, jcProspectCount, setJcProspectCount } = useAppStore();
  const prices = useAppStore((s) => s.prices);

  const prospectResults = useMemo(() => {
    const priceMap = new Map(Object.entries(prices).map(([id, entry]) => [id, entry]));
    return prospectingRecipes.map((recipe) =>
      calcProspectProfit(recipe, priceMap, jcStats, jcProspectCount)
    );
  }, [prices, jcStats, jcProspectCount]);

  const crushResults = useMemo(() => {
    const priceMap = new Map(Object.entries(prices).map(([id, entry]) => [id, entry]));
    return crushingRecipes.map((recipe) => calcCrushProfit(recipe, priceMap));
  }, [prices]);

  const shoppingString = generateJewelcraftingShoppingString();

  return (
    <div className="space-y-6">
      {/* Stats & Prospect Count */}
      <div className="flex flex-wrap gap-4">
        <StatsInput
          resourcefulness={jcStats.resourcefulness}
          onResourcefulnessChange={(v) => setJcStats({ resourcefulness: v })}
          showMulticraft={false}
        />
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
            Batch Size
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400"># of Prospects:</label>
            <input
              type="number"
              min="1"
              value={jcProspectCount}
              onChange={(e) => setJcProspectCount(parseInt(e.target.value) || 1)}
              className="w-24 bg-gray-800 border border-gray-600 text-right text-sm rounded px-2 py-1 text-gray-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prices Panel */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wider">
              Ore Prices
            </h3>
            <div className="space-y-1">
              {JC_ORES.map((mat) => (
                <PriceInput key={mat.id} materialId={mat.id} label={mat.label} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wider">
              Gem Prices
            </h3>
            <div className="space-y-1">
              {JC_GEMS.map((mat) => (
                <PriceInput key={mat.id} materialId={mat.id} label={mat.label} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wider">
              Byproducts
            </h3>
            <div className="space-y-1">
              {JC_BYPRODUCTS.map((mat) => (
                <PriceInput key={mat.id} materialId={mat.id} label={mat.label} />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Yellow border = manual override
          </p>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prospecting Table */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 overflow-x-auto">
            <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
              Prospecting Profitability
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              {jcStats.resourcefulness}% Resourcefulness | 5 ore per prospect | per-prospect values shown
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="text-left py-2 pr-3">Ore</th>
                  <th className="text-right py-2 px-2">Cost</th>
                  <th className="text-right py-2 px-2">Adj. Cost</th>
                  <th className="text-right py-2 px-2">Exp. Value</th>
                  <th className="text-right py-2 px-2">Profit</th>
                  <th className="text-right py-2 px-2">ROI</th>
                  <th className="text-center py-2 pl-3">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {prospectResults.map((result) => (
                  <tr
                    key={result.ore}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30"
                  >
                    <td className="py-2 pr-3 text-gray-200 font-medium">
                      {result.ore}
                    </td>
                    <td className="text-right py-2 px-2 text-gray-300">
                      {formatGold(result.costPerProspect)}
                    </td>
                    <td className="text-right py-2 px-2 text-gray-300">
                      {formatGold(result.adjustedCost)}
                    </td>
                    <td className="text-right py-2 px-2 text-gray-300">
                      {formatGold(result.expectedValue)}
                    </td>
                    <td
                      className={`text-right py-2 px-2 font-medium ${
                        result.profit >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {formatGold(result.profit)}
                    </td>
                    <td
                      className={`text-right py-2 px-2 ${
                        result.roi >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {result.roi.toFixed(2)}%
                    </td>
                    <td className="text-center py-2 pl-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          result.sellOrProspect === 'Prospect'
                            ? 'bg-green-900/50 text-green-300'
                            : 'bg-red-900/50 text-red-300'
                        }`}
                      >
                        {result.sellOrProspect}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Gem breakdown expandable */}
            <details className="mt-4">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                Show gem drop breakdown per prospect
              </summary>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                {prospectResults.map((result) => (
                  <div
                    key={result.ore}
                    className="bg-gray-900/50 rounded p-3"
                  >
                    <h4 className="text-xs font-semibold text-gray-300 mb-2">
                      {result.ore}
                    </h4>
                    {result.gemBreakdown.map((gem) => (
                      <div
                        key={gem.name}
                        className="flex justify-between text-xs py-0.5"
                      >
                        <span className="text-gray-400">{gem.name}</span>
                        <span className="text-gray-300">
                          {(gem.dropRate * 100).toFixed(1)}% = {formatGold(gem.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </details>
          </div>

          {/* Crushing Table */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 overflow-x-auto">
            <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
              Crushing Profitability
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Gem → Glimmering Gemdust (avg 0.67 yield per crush)
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="text-left py-2 pr-3">Gem</th>
                  <th className="text-right py-2 px-2">Gem Cost</th>
                  <th className="text-right py-2 px-2">Gemdust Value</th>
                  <th className="text-right py-2 px-2">Profit</th>
                </tr>
              </thead>
              <tbody>
                {crushResults.map((result) => (
                  <tr
                    key={result.gemName}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30"
                  >
                    <td className="py-2 pr-3 text-gray-200">{result.gemName}</td>
                    <td className="text-right py-2 px-2 text-gray-300">
                      {formatGold(result.gemCost)}
                    </td>
                    <td className="text-right py-2 px-2 text-gray-300">
                      {formatGold(result.outputValue)}
                    </td>
                    <td
                      className={`text-right py-2 px-2 font-medium ${
                        result.profit >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {formatGold(result.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shopping String */}
      <ShoppingString
        label="Auctionator Shopping String"
        value={shoppingString}
      />
    </div>
  );
}
