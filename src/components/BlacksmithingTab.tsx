'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { alloyRecipes } from '@/data/recipes';
import { calcAlloyProfit, generateBlacksmithingShoppingString, formatGold } from '@/lib/calculations';
import PriceInput from './PriceInput';
import StatsInput from './StatsInput';
import ShoppingString from './ShoppingString';

// Price inputs grouped by category
const BS_ORES = [
  { label: 'Refulgent Copper Ore', silverId: 'refulgent-copper-ore-silver', goldId: 'refulgent-copper-ore-gold' },
  { label: 'Umbral Tin Ore', silverId: 'umbral-tin-ore-silver', goldId: 'umbral-tin-ore-gold' },
  { label: 'Brilliant Silver Ore', silverId: 'brilliant-silver-ore-silver', goldId: 'brilliant-silver-ore-gold' },
];

const BS_ALLOYS = [
  { label: 'Refulgent Copper Ingot', silverId: 'refulgent-copper-ingot-silver', goldId: 'refulgent-copper-ingot-gold' },
  { label: 'Gloaming Alloy', silverId: 'gloaming-alloy-silver', goldId: 'gloaming-alloy-gold' },
  { label: 'Sterling Alloy', silverId: 'sterling-alloy-silver', goldId: 'sterling-alloy-gold' },
];

export default function BlacksmithingTab() {
  const { bsStats, setBsStats, bsCraftCount, setBsCraftCount } = useAppStore();
  const prices = useAppStore((s) => s.prices);

  const results = useMemo(() => {
    const priceMap = new Map(Object.entries(prices).map(([id, entry]) => [id, entry]));
    return alloyRecipes.map((recipe) =>
      calcAlloyProfit(recipe, priceMap, bsStats, bsCraftCount)
    );
  }, [prices, bsStats, bsCraftCount]);

  const shoppingString = generateBlacksmithingShoppingString();

  return (
    <div className="space-y-6">
      {/* Stats & Craft Count */}
      <div className="flex flex-wrap gap-4">
        <StatsInput
          resourcefulness={bsStats.resourcefulness}
          multicraft={bsStats.multicraft}
          onResourcefulnessChange={(v) => setBsStats({ resourcefulness: v })}
          onMulticraftChange={(v) => setBsStats({ multicraft: v })}
          showMulticraft={true}
        />
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
            Batch Size
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400"># of Crafts:</label>
            <input
              type="number"
              min="1"
              value={bsCraftCount}
              onChange={(e) => setBsCraftCount(parseInt(e.target.value) || 1)}
              className="w-24 bg-gray-800 border border-gray-600 text-right text-sm rounded px-2 py-1 text-gray-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prices Panel */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
            Prices
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Yellow border = manual override. API won&apos;t overwrite manual prices.
          </p>

          {/* Ores with Silver/Gold columns */}
          <div className="mb-4">
            <div className="flex items-center justify-end gap-1 mb-1">
              <span className="w-28 text-center text-xs text-gray-500">Silver</span>
              <span className="w-28 text-center text-xs text-amber-500">Gold</span>
            </div>
            {BS_ORES.map((ore) => (
              <div key={ore.label} className="flex items-center justify-between gap-1 py-1">
                <span className="text-sm text-gray-300 truncate flex-1">{ore.label}</span>
                <PriceInput materialId={ore.silverId} label="" compact />
                <PriceInput materialId={ore.goldId} label="" compact isGold />
              </div>
            ))}
          </div>

          {/* Vendor */}
          <div className="mb-4">
            <PriceInput materialId="luminant-flux" label="Luminant Flux (vendor)" />
          </div>

          {/* Alloy sale prices */}
          <h4 className="text-xs font-semibold text-gray-400 mb-1 uppercase">Alloy Sale Prices</h4>
          <div className="flex items-center justify-end gap-1 mb-1">
            <span className="w-28 text-center text-xs text-gray-500">Silver</span>
            <span className="w-28 text-center text-xs text-amber-500">Gold</span>
          </div>
          {BS_ALLOYS.map((alloy) => (
            <div key={alloy.label} className="flex items-center justify-between gap-1 py-1">
              <span className="text-sm text-gray-300 truncate flex-1">{alloy.label}</span>
              <PriceInput materialId={alloy.silverId} label="" compact />
              <PriceInput materialId={alloy.goldId} label="" compact isGold />
            </div>
          ))}
        </div>

        {/* Profits Table */}
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-4 overflow-x-auto">
          <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
            Profits
          </h3>
          <p className="text-xs text-gray-500 mb-1">
            {bsStats.resourcefulness}% Resourcefulness &amp; {bsStats.multicraft}% Multicraft
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Silver rows use Silver mat prices → Silver output. Gold rows use Gold mat prices → Gold output.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="text-left py-2 pr-3">Recipe</th>
                <th className="text-center py-2 px-1">Rank</th>
                <th className="text-right py-2 px-2"># Crafts</th>
                <th className="text-right py-2 px-2">Cost</th>
                <th className="text-right py-2 px-2">Output</th>
                <th className="text-right py-2 px-2">Profit</th>
                <th className="text-right py-2 px-2">ROI</th>
                <th className="text-right py-2 px-2">Cost/Unit</th>
                <th className="text-left py-2 pl-3">Craft Mats?</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  key={result.recipe.id}
                  className={`border-b border-gray-700/50 hover:bg-gray-700/30 ${
                    result.quality === 'gold' ? 'bg-amber-950/20' : ''
                  }`}
                >
                  <td className="py-2 pr-3 text-gray-200 font-medium">
                    {result.recipe.name}
                  </td>
                  <td className="text-center py-2 px-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        result.quality === 'gold'
                          ? 'bg-amber-800/50 text-amber-300'
                          : 'bg-gray-700/50 text-gray-400'
                      }`}
                    >
                      {result.quality === 'gold' ? 'Gold' : 'Silver'}
                    </span>
                  </td>
                  <td className="text-right py-2 px-2 text-gray-300">
                    {result.numCrafts}
                  </td>
                  <td className="text-right py-2 px-2 text-gray-300">
                    {formatGold(result.totalCost)}
                  </td>
                  <td className="text-right py-2 px-2 text-gray-300">
                    {Math.round(result.effectiveOutput)}
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
                  <td className="text-right py-2 px-2 text-gray-300">
                    {formatGold(result.costPerUnit)}
                  </td>
                  <td className="py-2 pl-3 text-xs">
                    {result.craftTheMats.length > 0
                      ? result.craftTheMats.map((rec) => (
                          <span
                            key={rec.materialName}
                            className={`inline-block mr-1 px-1.5 py-0.5 rounded ${
                              rec.recommendation === 'Craft'
                                ? 'bg-green-900/50 text-green-300'
                                : 'bg-blue-900/50 text-blue-300'
                            }`}
                          >
                            {rec.recommendation} {rec.materialName.split(' ').pop()}
                          </span>
                        ))
                      : <span className="text-gray-500">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
