export type Quality = 'silver' | 'gold';

export interface Material {
  id: string;
  name: string;
  itemId: number; // Blizzard API item ID
  isIntermediate?: boolean; // Can be crafted (e.g., Refulgent Copper Ingot)
  isVendor?: boolean; // Purchased from vendor (e.g., Luminant Flux)
}

export interface RecipeMaterial {
  materialId: string;
  quantity: number;
}

export interface AlloyRecipe {
  id: string;
  name: string;
  itemId: number;
  materials: RecipeMaterial[];
  baseYield: number;
  canMulticraft: boolean;
}

export interface ProspectingResult {
  materialId: string;
  dropRate: number; // 0.0 to 1.0
}

export interface ProspectingRecipe {
  id: string;
  oreName: string;
  oreMaterialId: string;
  orePerProspect: number;
  results: ProspectingResult[];
  guaranteedResults: ProspectingResult[]; // Duskshrouded Stone, Crystalline Glass
}

export interface CrushingRecipe {
  id: string;
  gemName: string;
  gemMaterialId: string;
  outputMaterialId: string; // Glimmering Gemdust
  avgYield: number;
}

export interface PriceEntry {
  materialId: string;
  price: number; // in gold
  quality?: Quality;
  isManualOverride: boolean;
  lastUpdated?: string;
}

export interface PlayerStats {
  resourcefulness: number; // percentage, e.g., 21
  multicraft: number; // percentage, e.g., 23
}

export interface AlloyProfitResult {
  recipe: AlloyRecipe;
  quality: Quality;
  numCrafts: number;
  totalCost: number;
  effectiveOutput: number;
  revenue: number;
  profit: number;
  roi: number;
  costPerUnit: number;
  craftTheMats: CraftRecommendation[];
}

export interface CraftRecommendation {
  materialName: string;
  buyCost: number;
  craftCost: number;
  recommendation: 'Buy' | 'Craft';
}

export interface ProspectProfitResult {
  ore: string;
  costPerProspect: number;
  adjustedCost: number;
  expectedValue: number;
  profit: number;
  roi: number;
  sellOrProspect: 'Prospect' | 'Sell Ore';
  gemBreakdown: { name: string; dropRate: number; value: number }[];
}

export interface CrushProfitResult {
  gemName: string;
  gemCost: number;
  outputValue: number;
  profit: number;
}
