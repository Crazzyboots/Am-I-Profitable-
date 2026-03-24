import { Material } from './types';

// Blizzard item IDs sourced from Wowhead
// These may need to be verified/updated with actual in-game IDs
export const materials: Material[] = [
  // Ores
  { id: 'refulgent-copper-ore', name: 'Refulgent Copper Ore', itemId: 238151 },
  { id: 'umbral-tin-ore', name: 'Umbral Tin Ore', itemId: 238152 },
  { id: 'brilliant-silver-ore', name: 'Brilliant Silver Ore', itemId: 238153 },
  { id: 'dazzling-thorium', name: 'Dazzling Thorium', itemId: 238154 },

  // Vendor reagents
  { id: 'luminant-flux', name: 'Luminant Flux', itemId: 238155, isVendor: true },

  // Blacksmithing intermediates
  { id: 'refulgent-copper-ingot', name: 'Refulgent Copper Ingot', itemId: 238201, isIntermediate: true },
  { id: 'gloaming-alloy', name: 'Gloaming Alloy', itemId: 238203, isIntermediate: true },
  { id: 'sterling-alloy', name: 'Sterling Alloy', itemId: 238204, isIntermediate: true },

  // Gems - Common
  { id: 'sanguine-garnet', name: 'Sanguine Garnet', itemId: 238210 },
  { id: 'amani-lapis', name: 'Amani Lapis', itemId: 238211 },
  { id: 'harandar-peridot', name: 'Harandar Peridot', itemId: 238212 },
  { id: 'tenebrous-amethyst', name: 'Tenebrous Amethyst', itemId: 238213 },

  // Gems - Flawless (rare)
  { id: 'flawless-sanguine-garnet', name: 'Flawless Sanguine Garnet', itemId: 238214 },
  { id: 'flawless-amani-lapis', name: 'Flawless Amani Lapis', itemId: 238215 },
  { id: 'flawless-harandar-peridot', name: 'Flawless Harandar Peridot', itemId: 238216 },
  { id: 'flawless-tenebrous-amethyst', name: 'Flawless Tenebrous Amethyst', itemId: 238217 },

  // Epic gem
  { id: 'eversong-diamond', name: 'Eversong Diamond', itemId: 238218 },

  // Byproducts
  { id: 'duskshrouded-stone', name: 'Duskshrouded Stone', itemId: 238220 },
  { id: 'crystalline-glass', name: 'Crystalline Glass', itemId: 238221 },
  { id: 'glimmering-gemdust', name: 'Glimmering Gemdust', itemId: 238222 },
];

export const materialMap = new Map(materials.map((m) => [m.id, m]));

export function getMaterial(id: string): Material {
  const mat = materialMap.get(id);
  if (!mat) throw new Error(`Unknown material: ${id}`);
  return mat;
}
