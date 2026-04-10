import { AlloyRecipe, ProspectingRecipe, CrushingRecipe, Quality } from './types';

// ============================================
// BLACKSMITHING ALLOY RECIPES
// ============================================

// Each alloy has a Silver and Gold variant.
// Silver: uses silver mats → produces silver alloy
// Gold: uses gold mats → produces gold alloy

type AlloyDef = {
  baseId: string;
  name: string;
  itemId: number;
  silverMaterials: { materialId: string; quantity: number }[];
  goldMaterials: { materialId: string; quantity: number }[];
};

const alloyDefs: AlloyDef[] = [
  {
    baseId: 'refulgent-copper-ingot',
    name: 'Refulgent Copper Ingot',
    itemId: 238201,
    silverMaterials: [
      { materialId: 'luminant-flux', quantity: 2 },
      { materialId: 'refulgent-copper-ore-silver', quantity: 5 },
    ],
    // Gold rank only needs 2 Gold ore + 3 Silver ore (not 5 Gold)
    goldMaterials: [
      { materialId: 'luminant-flux', quantity: 2 },
      { materialId: 'refulgent-copper-ore-silver', quantity: 3 },
      { materialId: 'refulgent-copper-ore-gold', quantity: 2 },
    ],
  },
  {
    baseId: 'gloaming-alloy',
    name: 'Gloaming Alloy',
    itemId: 238203,
    silverMaterials: [
      { materialId: 'luminant-flux', quantity: 4 },
      { materialId: 'umbral-tin-ore-silver', quantity: 6 },
      { materialId: 'refulgent-copper-ingot-silver', quantity: 3 },
    ],
    // Gold rank: 3 Silver + 3 Gold tin, still 3 Gold ingot
    goldMaterials: [
      { materialId: 'luminant-flux', quantity: 4 },
      { materialId: 'umbral-tin-ore-silver', quantity: 3 },
      { materialId: 'umbral-tin-ore-gold', quantity: 3 },
      { materialId: 'refulgent-copper-ingot-gold', quantity: 3 },
    ],
  },
  {
    baseId: 'sterling-alloy',
    name: 'Sterling Alloy',
    itemId: 238204,
    silverMaterials: [
      { materialId: 'luminant-flux', quantity: 4 },
      { materialId: 'brilliant-silver-ore-silver', quantity: 6 },
      { materialId: 'refulgent-copper-ingot-silver', quantity: 3 },
    ],
    // Gold rank: 3 Silver + 3 Gold brilliant silver, still 3 Gold ingot
    goldMaterials: [
      { materialId: 'luminant-flux', quantity: 4 },
      { materialId: 'brilliant-silver-ore-silver', quantity: 3 },
      { materialId: 'brilliant-silver-ore-gold', quantity: 3 },
      { materialId: 'refulgent-copper-ingot-gold', quantity: 3 },
    ],
  },
];

export const alloyRecipes: AlloyRecipe[] = alloyDefs.flatMap((def) => [
  {
    id: `${def.baseId}-silver`,
    name: def.name,
    itemId: def.itemId,
    baseYield: 1,
    canMulticraft: true,
    quality: 'silver' as Quality,
    materials: def.silverMaterials,
  },
  {
    id: `${def.baseId}-gold`,
    name: def.name,
    itemId: def.itemId,
    baseYield: 1,
    canMulticraft: true,
    quality: 'gold' as Quality,
    materials: def.goldMaterials,
  },
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
