import { AlloyRecipe, ProspectingRecipe, CrushingRecipe } from './types';

// ============================================
// BLACKSMITHING ALLOY RECIPES
// ============================================

export const alloyRecipes: AlloyRecipe[] = [
  {
    id: 'refulgent-copper-ingot',
    name: 'Refulgent Copper Ingot',
    itemId: 238201,
    baseYield: 1,
    canMulticraft: true,
    materials: [
      { materialId: 'refulgent-copper-ore', quantity: 5 },
    ],
  },
  {
    id: 'gloaming-alloy',
    name: 'Gloaming Alloy',
    itemId: 238203,
    baseYield: 1,
    canMulticraft: true,
    materials: [
      { materialId: 'luminant-flux', quantity: 4 },
      { materialId: 'umbral-tin-ore', quantity: 6 },
      { materialId: 'refulgent-copper-ingot', quantity: 3 },
    ],
  },
  {
    id: 'sterling-alloy',
    name: 'Sterling Alloy',
    itemId: 238204,
    baseYield: 1,
    canMulticraft: true,
    materials: [
      { materialId: 'luminant-flux', quantity: 4 },
      { materialId: 'brilliant-silver-ore', quantity: 6 },
      { materialId: 'refulgent-copper-ingot', quantity: 3 },
    ],
  },
];

// ============================================
// JEWELCRAFTING PROSPECTING RECIPES
// ============================================

// Guaranteed byproducts for all prospects (approximate quantities per prospect)
const guaranteedByproducts = [
  { materialId: 'duskshrouded-stone', dropRate: 1.0 },
  { materialId: 'crystalline-glass', dropRate: 1.0 },
];

export const prospectingRecipes: ProspectingRecipe[] = [
  {
    id: 'prospect-refulgent-copper',
    oreName: 'Refulgent Copper Ore',
    oreMaterialId: 'refulgent-copper-ore',
    orePerProspect: 5,
    guaranteedResults: guaranteedByproducts,
    results: [
      { materialId: 'sanguine-garnet', dropRate: 0.08 },
      { materialId: 'amani-lapis', dropRate: 0.08 },
      { materialId: 'harandar-peridot', dropRate: 0.08 },
      { materialId: 'tenebrous-amethyst', dropRate: 0.08 },
      { materialId: 'eversong-diamond', dropRate: 0.025 },
    ],
  },
  {
    id: 'prospect-umbral-tin',
    oreName: 'Umbral Tin Ore',
    oreMaterialId: 'umbral-tin-ore',
    orePerProspect: 5,
    guaranteedResults: guaranteedByproducts,
    results: [
      { materialId: 'harandar-peridot', dropRate: 0.12 },
      { materialId: 'tenebrous-amethyst', dropRate: 0.12 },
      { materialId: 'flawless-harandar-peridot', dropRate: 0.12 },
      { materialId: 'flawless-tenebrous-amethyst', dropRate: 0.12 },
      { materialId: 'eversong-diamond', dropRate: 0.045 },
    ],
  },
  {
    id: 'prospect-brilliant-silver',
    oreName: 'Brilliant Silver Ore',
    oreMaterialId: 'brilliant-silver-ore',
    orePerProspect: 5,
    guaranteedResults: guaranteedByproducts,
    results: [
      { materialId: 'sanguine-garnet', dropRate: 0.12 },
      { materialId: 'amani-lapis', dropRate: 0.12 },
      { materialId: 'flawless-sanguine-garnet', dropRate: 0.12 },
      { materialId: 'flawless-amani-lapis', dropRate: 0.12 },
      { materialId: 'eversong-diamond', dropRate: 0.045 },
    ],
  },
  {
    id: 'prospect-dazzling-thorium',
    oreName: 'Dazzling Thorium',
    oreMaterialId: 'dazzling-thorium',
    orePerProspect: 5,
    guaranteedResults: guaranteedByproducts,
    results: [
      { materialId: 'flawless-sanguine-garnet', dropRate: 0.15 },
      { materialId: 'flawless-amani-lapis', dropRate: 0.15 },
      { materialId: 'flawless-harandar-peridot', dropRate: 0.15 },
      { materialId: 'flawless-tenebrous-amethyst', dropRate: 0.15 },
      { materialId: 'eversong-diamond', dropRate: 0.22 },
    ],
  },
];

// ============================================
// JEWELCRAFTING CRUSHING RECIPES
// ============================================

const commonGems = [
  'sanguine-garnet',
  'amani-lapis',
  'harandar-peridot',
  'tenebrous-amethyst',
];

const flawlessGems = [
  'flawless-sanguine-garnet',
  'flawless-amani-lapis',
  'flawless-harandar-peridot',
  'flawless-tenebrous-amethyst',
];

export const crushingRecipes: CrushingRecipe[] = [
  ...commonGems.map((gemId) => ({
    id: `crush-${gemId}`,
    gemName: gemId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    gemMaterialId: gemId,
    outputMaterialId: 'glimmering-gemdust',
    avgYield: 0.67,
  })),
  ...flawlessGems.map((gemId) => ({
    id: `crush-${gemId}`,
    gemName: gemId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    gemMaterialId: gemId,
    outputMaterialId: 'glimmering-gemdust',
    avgYield: 0.67,
  })),
];
