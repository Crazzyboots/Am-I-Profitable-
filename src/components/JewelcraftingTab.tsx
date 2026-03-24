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
  { label: 'Refulgent Copper Ore', silverId: 'refulgent-copper-ore-silver', goldId: 'refulgent-copper-ore-gold' },
  { label: 'Umbral Tin Ore', silverId: 'umbral-tin-ore-silver', goldId: 'umbral-tin-ore-gold' },
  { label: 'Brilliant Silver Ore', silverId: 'brilliant-silver-ore-silver', goldId: 'brilliant-silver-ore-gold' },
  { label: 'Dazzling Thorium', silverId: 'dazzling-thorium-silver', goldId: 'dazzling-thorium-gold' },
];

const JC_GEMS = [
  { label: 'Sanguine Garnet', id: 'sanguine-garnet-silver' },
  { label: 'Amani Lapis', id: 'amani-lapis-silver' },
  { label: 'Harandar Peridot', id: 'harandar-peridot-silver' },
  { label: 'Tenebrous Amethyst', id: 'tenebrous-amethyst-silver' },
  { label: 'Flawless Sanguine Garnet', id: 'flawless-sanguine-garnet-silver' },
  { label: 'Flawless Amani Lapis', id: 'flawless-amani-lapis-silver' },
  { label: 'Flawless Harandar Peridot', id: 'flawless-harandar-peridot-silver' },
  { label: 'Flawless Tenebrous Amethyst', id: 'flawless-tenebrous-amethyst-silver' },
  { label: 'Eversong Diamond', id: 'eversong-diamond' },
];

const JC_BYPRODUCTS = [
  { label: 'Duskshrouded Stone', id: 'duskshrouded-stone' },
  { label: 'Crystalline Glass', id: 'crystalline-glass' },
  { label: 'Glimmering Gemdust', id: 'glimmering-gemdust' },
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
          {/* Ores with Silver/Gold */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wider">
              Ore Prices
            </h3>
            <div className="flex items-center justify-end gap-1 mb-1">
              <span className="w-28 text-center text-xs text-gray-500">Silver</span>
              <span className="w-28 text-center text-xs text-amber-500">Gold</span>
            </div>
            {JC_ORES.map((ore) => (
              <div key={ore.label} className="flex items-center justify-between gap-1 py-1">
                <span className="text-sm text-gray-300 truncate flex-1">{ore.label}</span>
                <PriceInput materialId={ore.silverId} label="" compact />
                <PriceInput materialId={ore.goldId} label="" compact isGold />
              </div>
            ))}
          </div>

          {/* Gems */}
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

          {/* Byproducts */}
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
                  <th className="text-center py-2 px-1">Rank</th>
                  <th className="text-right py-2 px-2">Cost</th>
                  <th className="text-right py-2 px-2">Exp. Value</th>
                  <th className="text-right py-2 px-2">Profit</th>
                  <th className="text-right py-2 px-2">ROI</th>
                  <th className="text-center py-2 pl-3">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {prospectResults.map((result) => {
                  const isGold = result.ore.includes('Gold');
                  return (
                    <tr
                      key={result.ore}
                      className={`border-b border-gray-700/50 hover:bg-gray-700/30 ${
                        isGold ? 'bg-amber-950/20' : ''
                      }`}
                    >
                      <td className="py-2 pr-3 text-gray-200 font-medium">
                        {result.ore.replace(/ \((Silver|Gold)\)/, '')}
                      </td>
                      <td className="text-center py-2 px-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            isGold
                              ? 'bg-amber-800/50 text-amber-300'
                              : 'bg-gray-700/50 text-gray-400'
                          }`}
                        >
                          {isGold ? 'Gold' : 'Silver'}
                        </span>
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
                  );
                })}
              </tbody>
            </table>

            {/* Gem breakdown */}
            <details className="mt-4">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                Show gem drop breakdown per prospect
              </summary>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                {prospectResults
                  .filter((r) => r.ore.includes('Silver'))
                  .map((result) => (
                    <div
                      key={result.ore}
                      className="bg-gray-900/50 rounded p-3"
                    >
                      <h4 className="text-xs font-semibold text-gray-300 mb-2">
                        {result.ore.replace(/ \(Silver\)/, '')}
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
