import { AlloyRecipe, ProspectingRecipe, CrushingRecipe, Quality } from './types';

// ============================================
// BLACKSMITHING ALLOY RECIPES
// ============================================

// Each alloy has a Silver and Gold variant.
// Silver: uses silver mats → produces silver alloy
// Gold: uses gold mats → produces gold alloy

function makeAlloyRecipe(
  baseId: string,
  name: string,
  itemId: number,
  materials: { baseId: string; quantity: number; hasQuality: boolean }[],
  quality: Quality
): AlloyRecipe {
  return {
    id: `${baseId}-${quality}`,
    name,
    itemId,
    baseYield: 1,
    canMulticraft: true,
    quality,
    materials: materials.map((m) => ({
      materialId: m.hasQuality ? `${m.baseId}-${quality}` : m.baseId,
      quantity: m.quantity,
    })),
  };
}

const alloyDefs = [
  {
    baseId: 'refulgent-copper-ingot',
    name: 'Refulgent Copper Ingot',
    itemId: 238201,
    materials: [
      { baseId: 'luminant-flux', quantity: 2, hasQuality: false },
      { baseId: 'refulgent-copper-ore', quantity: 5, hasQuality: true },
    ],
  },
  {
    baseId: 'gloaming-alloy',
    name: 'Gloaming Alloy',
    itemId: 238203,
    materials: [
      { baseId: 'luminant-flux', quantity: 4, hasQuality: false },
      { baseId: 'umbral-tin-ore', quantity: 6, hasQuality: true },
      { baseId: 'refulgent-copper-ingot', quantity: 3, hasQuality: true },
    ],
  },
  {
    baseId: 'sterling-alloy',
    name: 'Sterling Alloy',
    itemId: 238204,
    materials: [
      { baseId: 'luminant-flux', quantity: 4, hasQuality: false },
      { baseId: 'brilliant-silver-ore', quantity: 6, hasQuality: true },
      { baseId: 'refulgent-copper-ingot', quantity: 3, hasQuality: true },
    ],
  },
];

export const alloyRecipes: AlloyRecipe[] = alloyDefs.flatMap((def) => [
  makeAlloyRecipe(def.baseId, def.name, def.itemId, def.materials, 'silver'),
  makeAlloyRecipe(def.baseId, def.name, def.itemId, def.materials, 'gold'),
]);

// ============================================
// JEWELCRAFTING PROSPECTING RECIPES
// ============================================

// Prospecting uses ore (we'll default to silver quality ore for cost)
// Output gems can be silver or gold quality — for simplicity we track
// average gem prices (user enters what they sell for)

const guaranteedByproducts = [
  { materialId: 'duskshrouded-stone', dropRate: 1.0 },
  { materialId: 'crystalline-glass', dropRate: 1.0 },
];

// Prospecting recipes per ore quality
function makeProspectRecipe(
  baseId: string,
  oreName: string,
  oreBaseId: string,
  results: { baseId: string; dropRate: number; hasQuality: boolean }[],
  quality: Quality
): ProspectingRecipe {
  return {
    id: `${baseId}-${quality}`,
    oreName: `${oreName} (${quality === 'silver' ? 'Silver' : 'Gold'})`,
    oreMaterialId: `${oreBaseId}-${quality}`,
    orePerProspect: 5,
    quality,
    guaranteedResults: guaranteedByproducts,
    results: results.map((r) => ({
      materialId: r.hasQuality ? `${r.baseId}-silver` : r.baseId,
      dropRate: r.dropRate,
    })),
  };
}

const prospectDefs = [
  {
    baseId: 'prospect-refulgent-copper',
    oreName: 'Refulgent Copper Ore',
    oreBaseId: 'refulgent-copper-ore',
    results: [
      { baseId: 'sanguine-garnet', dropRate: 0.08, hasQuality: true },
      { baseId: 'amani-lapis', dropRate: 0.08, hasQuality: true },
      { baseId: 'harandar-peridot', dropRate: 0.08, hasQuality: true },
      { baseId: 'tenebrous-amethyst', dropRate: 0.08, hasQuality: true },
      { baseId: 'eversong-diamond', dropRate: 0.025, hasQuality: false },
    ],
  },
  {
    baseId: 'prospect-umbral-tin',
    oreName: 'Umbral Tin Ore',
    oreBaseId: 'umbral-tin-ore',
    results: [
      { baseId: 'harandar-peridot', dropRate: 0.12, hasQuality: true },
      { baseId: 'tenebrous-amethyst', dropRate: 0.12, hasQuality: true },
      { baseId: 'flawless-harandar-peridot', dropRate: 0.12, hasQuality: true },
      { baseId: 'flawless-tenebrous-amethyst', dropRate: 0.12, hasQuality: true },
      { baseId: 'eversong-diamond', dropRate: 0.045, hasQuality: false },
    ],
  },
  {
    baseId: 'prospect-brilliant-silver',
    oreName: 'Brilliant Silver Ore',
    oreBaseId: 'brilliant-silver-ore',
    results: [
      { baseId: 'sanguine-garnet', dropRate: 0.12, hasQuality: true },
      { baseId: 'amani-lapis', dropRate: 0.12, hasQuality: true },
      { baseId: 'flawless-sanguine-garnet', dropRate: 0.12, hasQuality: true },
      { baseId: 'flawless-amani-lapis', dropRate: 0.12, hasQuality: true },
      { baseId: 'eversong-diamond', dropRate: 0.045, hasQuality: false },
    ],
  },
  {
    baseId: 'prospect-dazzling-thorium',
    oreName: 'Dazzling Thorium',
    oreBaseId: 'dazzling-thorium',
    results: [
      { baseId: 'flawless-sanguine-garnet', dropRate: 0.15, hasQuality: true },
      { baseId: 'flawless-amani-lapis', dropRate: 0.15, hasQuality: true },
      { baseId: 'flawless-harandar-peridot', dropRate: 0.15, hasQuality: true },
      { baseId: 'flawless-tenebrous-amethyst', dropRate: 0.15, hasQuality: true },
      { baseId: 'eversong-diamond', dropRate: 0.22, hasQuality: false },
    ],
  },
];

export const prospectingRecipes: ProspectingRecipe[] = prospectDefs.flatMap((def) => [
  makeProspectRecipe(def.baseId, def.oreName, def.oreBaseId, def.results, 'silver'),
  makeProspectRecipe(def.baseId, def.oreName, def.oreBaseId, def.results, 'gold'),
]);

// ============================================
// JEWELCRAFTING CRUSHING RECIPES
// ============================================

const gemBases = [
  'sanguine-garnet',
  'amani-lapis',
  'harandar-peridot',
  'tenebrous-amethyst',
  'flawless-sanguine-garnet',
  'flawless-amani-lapis',
  'flawless-harandar-peridot',
  'flawless-tenebrous-amethyst',
];

export const crushingRecipes: CrushingRecipe[] = gemBases.map((gemBase) => ({
  id: `crush-${gemBase}`,
  gemName: gemBase
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' '),
  gemMaterialId: `${gemBase}-silver`, // crush cheapest quality
  outputMaterialId: 'glimmering-gemdust',
  avgYield: 0.67,
}));
