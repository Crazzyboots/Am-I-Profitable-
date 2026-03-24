import { Material } from './types';

// Materials that have quality ranks get a -silver and -gold variant
// Vendor items and byproducts don't have quality ranks
// Blizzard item IDs may need to be verified with actual in-game IDs

export const materials: Material[] = [
  // Ores - Silver
  { id: 'refulgent-copper-ore-silver', name: 'Refulgent Copper Ore', itemId: 238151, quality: 'silver' },
  { id: 'umbral-tin-ore-silver', name: 'Umbral Tin Ore', itemId: 238152, quality: 'silver' },
  { id: 'brilliant-silver-ore-silver', name: 'Brilliant Silver Ore', itemId: 238153, quality: 'silver' },
  { id: 'dazzling-thorium-silver', name: 'Dazzling Thorium', itemId: 238154, quality: 'silver' },

  // Ores - Gold
  { id: 'refulgent-copper-ore-gold', name: 'Refulgent Copper Ore', itemId: 238151, quality: 'gold' },
  { id: 'umbral-tin-ore-gold', name: 'Umbral Tin Ore', itemId: 238152, quality: 'gold' },
  { id: 'brilliant-silver-ore-gold', name: 'Brilliant Silver Ore', itemId: 238153, quality: 'gold' },
  { id: 'dazzling-thorium-gold', name: 'Dazzling Thorium', itemId: 238154, quality: 'gold' },

  // Vendor reagents (no quality)
  { id: 'luminant-flux', name: 'Luminant Flux', itemId: 238155, isVendor: true },

  // Blacksmithing intermediates - Silver
  { id: 'refulgent-copper-ingot-silver', name: 'Refulgent Copper Ingot', itemId: 238201, isIntermediate: true, quality: 'silver' },
  { id: 'gloaming-alloy-silver', name: 'Gloaming Alloy', itemId: 238203, isIntermediate: true, quality: 'silver' },
  { id: 'sterling-alloy-silver', name: 'Sterling Alloy', itemId: 238204, isIntermediate: true, quality: 'silver' },

  // Blacksmithing intermediates - Gold
  { id: 'refulgent-copper-ingot-gold', name: 'Refulgent Copper Ingot', itemId: 238201, isIntermediate: true, quality: 'gold' },
  { id: 'gloaming-alloy-gold', name: 'Gloaming Alloy', itemId: 238203, isIntermediate: true, quality: 'gold' },
  { id: 'sterling-alloy-gold', name: 'Sterling Alloy', itemId: 238204, isIntermediate: true, quality: 'gold' },

  // Gems - Common (Silver)
  { id: 'sanguine-garnet-silver', name: 'Sanguine Garnet', itemId: 238210, quality: 'silver' },
  { id: 'amani-lapis-silver', name: 'Amani Lapis', itemId: 238211, quality: 'silver' },
  { id: 'harandar-peridot-silver', name: 'Harandar Peridot', itemId: 238212, quality: 'silver' },
  { id: 'tenebrous-amethyst-silver', name: 'Tenebrous Amethyst', itemId: 238213, quality: 'silver' },

  // Gems - Common (Gold)
  { id: 'sanguine-garnet-gold', name: 'Sanguine Garnet', itemId: 238210, quality: 'gold' },
  { id: 'amani-lapis-gold', name: 'Amani Lapis', itemId: 238211, quality: 'gold' },
  { id: 'harandar-peridot-gold', name: 'Harandar Peridot', itemId: 238212, quality: 'gold' },
  { id: 'tenebrous-amethyst-gold', name: 'Tenebrous Amethyst', itemId: 238213, quality: 'gold' },

  // Gems - Flawless (Silver)
  { id: 'flawless-sanguine-garnet-silver', name: 'Flawless Sanguine Garnet', itemId: 238214, quality: 'silver' },
  { id: 'flawless-amani-lapis-silver', name: 'Flawless Amani Lapis', itemId: 238215, quality: 'silver' },
  { id: 'flawless-harandar-peridot-silver', name: 'Flawless Harandar Peridot', itemId: 238216, quality: 'silver' },
  { id: 'flawless-tenebrous-amethyst-silver', name: 'Flawless Tenebrous Amethyst', itemId: 238217, quality: 'silver' },

  // Gems - Flawless (Gold)
  { id: 'flawless-sanguine-garnet-gold', name: 'Flawless Sanguine Garnet', itemId: 238214, quality: 'gold' },
  { id: 'flawless-amani-lapis-gold', name: 'Flawless Amani Lapis', itemId: 238215, quality: 'gold' },
  { id: 'flawless-harandar-peridot-gold', name: 'Flawless Harandar Peridot', itemId: 238216, quality: 'gold' },
  { id: 'flawless-tenebrous-amethyst-gold', name: 'Flawless Tenebrous Amethyst', itemId: 238217, quality: 'gold' },

  // Epic gem (no quality variant — single tier)
  { id: 'eversong-diamond', name: 'Eversong Diamond', itemId: 238218 },

  // Byproducts (no quality)
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
