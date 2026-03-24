import {
  AlloyRecipe,
  ProspectingRecipe,
  CrushingRecipe,
  PriceEntry,
  PlayerStats,
  AlloyProfitResult,
  ProspectProfitResult,
  CrushProfitResult,
  CraftRecommendation,
} from '@/data/types';
import { alloyRecipes } from '@/data/recipes';
import { getMaterial } from '@/data/materials';

const AH_CUT = 0.05;
const MULTICRAFT_AVG_BONUS = 1.5;
const RESOURCEFULNESS_SAVINGS_PER_PROC = 0.30;

function getPrice(prices: Map<string, PriceEntry>, materialId: string): number {
  return prices.get(materialId)?.price ?? 0;
}

// ============================================
// BLACKSMITHING CALCULATIONS
// ============================================

function calcBaseMaterialCost(
  recipe: AlloyRecipe,
  prices: Map<string, PriceEntry>
): number {
  return recipe.materials.reduce((sum, mat) => {
    return sum + mat.quantity * getPrice(prices, mat.materialId);
  }, 0);
}

function calcCraftTheMats(
  recipe: AlloyRecipe,
  prices: Map<string, PriceEntry>,
  stats: PlayerStats
): CraftRecommendation[] {
  const recommendations: CraftRecommendation[] = [];

  for (const mat of recipe.materials) {
    const material = getMaterial(mat.materialId);
    if (!material.isIntermediate) continue;

    // Find the recipe for this intermediate
    const subRecipe = alloyRecipes.find((r) => r.id === mat.materialId);
    if (!subRecipe) continue;

    const buyCost = getPrice(prices, mat.materialId) * mat.quantity;
    const craftCostPerUnit = calcBaseMaterialCost(subRecipe, prices) *
      (1 - (stats.resourcefulness / 100) * RESOURCEFULNESS_SAVINGS_PER_PROC);
    const craftCost = craftCostPerUnit * mat.quantity;

    recommendations.push({
      materialName: material.name,
      buyCost,
      craftCost,
      recommendation: buyCost <= craftCost ? 'Buy' : 'Craft',
    });
  }

  return recommendations;
}

export function calcAlloyProfit(
  recipe: AlloyRecipe,
  prices: Map<string, PriceEntry>,
  stats: PlayerStats,
  numCrafts: number
): AlloyProfitResult {
  const baseCost = calcBaseMaterialCost(recipe, prices);
  const resourcefulnessSavings = (stats.resourcefulness / 100) * RESOURCEFULNESS_SAVINGS_PER_PROC;
  const adjustedCostPerCraft = baseCost * (1 - resourcefulnessSavings);
  const totalCost = adjustedCostPerCraft * numCrafts;

  const multicraftBonus = recipe.canMulticraft
    ? (stats.multicraft / 100) * MULTICRAFT_AVG_BONUS
    : 0;
  const effectiveOutput = numCrafts * recipe.baseYield * (1 + multicraftBonus);

  const salePrice = getPrice(prices, recipe.id);
  const revenue = effectiveOutput * salePrice * (1 - AH_CUT);
  const profit = revenue - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
  const costPerUnit = effectiveOutput > 0 ? totalCost / effectiveOutput : 0;

  const craftTheMats = calcCraftTheMats(recipe, prices, stats);

  return {
    recipe,
    quality: recipe.quality,
    numCrafts,
    totalCost,
    effectiveOutput,
    revenue,
    profit,
    roi,
    costPerUnit,
    craftTheMats,
  };
}

// ============================================
// JEWELCRAFTING CALCULATIONS
// ============================================

export function calcProspectProfit(
  recipe: ProspectingRecipe,
  prices: Map<string, PriceEntry>,
  stats: PlayerStats,
  numProspects: number
): ProspectProfitResult {
  const orePrice = getPrice(prices, recipe.oreMaterialId);
  const costPerProspect = recipe.orePerProspect * orePrice;
  const resourcefulnessSavings = (stats.resourcefulness / 100) * RESOURCEFULNESS_SAVINGS_PER_PROC;
  const adjustedCost = costPerProspect * (1 - resourcefulnessSavings);

  // Calculate expected value from gem drops
  const gemBreakdown = recipe.results.map((result) => {
    const mat = getMaterial(result.materialId);
    const gemPrice = getPrice(prices, result.materialId);
    return {
      name: mat.name,
      dropRate: result.dropRate,
      value: gemPrice * result.dropRate,
    };
  });

  // Add guaranteed byproducts
  const byproductValue = recipe.guaranteedResults.reduce((sum, result) => {
    return sum + getPrice(prices, result.materialId) * result.dropRate;
  }, 0);

  const expectedGemValue = gemBreakdown.reduce((sum, g) => sum + g.value, 0);
  const expectedValue = (expectedGemValue + byproductValue) * (1 - AH_CUT); // AH cut on sales

  const profitPerProspect = expectedValue - adjustedCost;
  const roi = adjustedCost > 0 ? (profitPerProspect / adjustedCost) * 100 : 0;

  // Compare: prospect vs just selling the ore
  const sellOreValue = recipe.orePerProspect * orePrice * (1 - AH_CUT);
  const sellOrProspect = expectedValue > sellOreValue ? 'Prospect' as const : 'Sell Ore' as const;

  return {
    ore: recipe.oreName,
    costPerProspect,
    adjustedCost,
    expectedValue,
    profit: profitPerProspect,
    roi,
    sellOrProspect,
    gemBreakdown,
  };
}

export function calcCrushProfit(
  recipe: CrushingRecipe,
  prices: Map<string, PriceEntry>
): CrushProfitResult {
  const gemCost = getPrice(prices, recipe.gemMaterialId);
  const gemdustPrice = getPrice(prices, recipe.outputMaterialId);
  const outputValue = recipe.avgYield * gemdustPrice * (1 - AH_CUT);

  return {
    gemName: recipe.gemName,
    gemCost,
    outputValue,
    profit: outputValue - gemCost,
  };
}

// ============================================
// AUCTIONATOR SHOPPING STRINGS
// ============================================

export function generateBlacksmithingShoppingString(): string {
  const items = [
    'Refulgent Copper Ore',
    'Umbral Tin Ore',
    'Brilliant Silver Ore',
    'Luminant Flux',
    'Refulgent Copper Ingot',
    'Gloaming Alloy',
    'Sterling Alloy',
  ];
  return `Blacksmithing^${items.map((i) => `"${i}"`).join('^')}`;
}

export function generateJewelcraftingShoppingString(): string {
  const items = [
    'Refulgent Copper Ore',
    'Umbral Tin Ore',
    'Brilliant Silver Ore',
    'Dazzling Thorium',
    'Sanguine Garnet',
    'Amani Lapis',
    'Harandar Peridot',
    'Tenebrous Amethyst',
    'Flawless Sanguine Garnet',
    'Flawless Amani Lapis',
    'Flawless Harandar Peridot',
    'Flawless Tenebrous Amethyst',
    'Eversong Diamond',
    'Duskshrouded Stone',
    'Crystalline Glass',
    'Glimmering Gemdust',
  ];
  return `Jewelcrafting^${items.map((i) => `"${i}"`).join('^')}`;
}

// ============================================
// GOLD FORMATTING
// ============================================

export function formatGold(amount: number): string {
  const negative = amount < 0;
  const abs = Math.abs(amount);
  const gold = Math.floor(abs);
  const silver = Math.floor((abs - gold) * 100);
  const copper = Math.floor(((abs - gold) * 100 - silver) * 100);

  const parts: string[] = [];
  if (gold > 0) parts.push(`${gold.toLocaleString()}g`);
  if (silver > 0) parts.push(`${silver}s`);
  if (copper > 0) parts.push(`${copper}c`);
  if (parts.length === 0) return '0g';

  return (negative ? '-' : '') + parts.join(' ');
}
