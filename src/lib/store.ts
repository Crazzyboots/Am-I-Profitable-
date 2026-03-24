'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PriceEntry, PlayerStats } from '@/data/types';
import { materials } from '@/data/materials';

type Region = 'us' | 'eu';

interface AppState {
  // Region
  region: Region;
  setRegion: (region: Region) => void;

  // Prices
  prices: Record<string, PriceEntry>;
  setPrice: (materialId: string, price: number, isManual?: boolean) => void;
  setBulkPrices: (entries: Record<string, number>) => void;

  // Player stats
  bsStats: PlayerStats;
  jcStats: PlayerStats;
  setBsStats: (stats: Partial<PlayerStats>) => void;
  setJcStats: (stats: Partial<PlayerStats>) => void;

  // Craft counts
  bsCraftCount: number;
  jcProspectCount: number;
  setBsCraftCount: (count: number) => void;
  setJcProspectCount: (count: number) => void;

  // API state
  lastUpdated: string | null;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setLastUpdated: (date: string) => void;

  // Price map helper
  getPriceMap: () => Map<string, PriceEntry>;
}

const defaultPrices: Record<string, PriceEntry> = {};
materials.forEach((m) => {
  defaultPrices[m.id] = {
    materialId: m.id,
    price: 0,
    isManualOverride: false,
  };
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      region: 'us',
      setRegion: (region) => set({ region }),

      prices: defaultPrices,
      setPrice: (materialId, price, isManual = true) =>
        set((state) => ({
          prices: {
            ...state.prices,
            [materialId]: {
              materialId,
              price,
              isManualOverride: isManual,
              lastUpdated: new Date().toISOString(),
            },
          },
        })),
      setBulkPrices: (entries) =>
        set((state) => {
          const updated = { ...state.prices };
          for (const [id, price] of Object.entries(entries)) {
            // Don't overwrite manual overrides
            if (updated[id]?.isManualOverride) continue;
            updated[id] = {
              materialId: id,
              price,
              isManualOverride: false,
              lastUpdated: new Date().toISOString(),
            };
          }
          return { prices: updated, lastUpdated: new Date().toISOString() };
        }),

      bsStats: { resourcefulness: 0, multicraft: 0 },
      jcStats: { resourcefulness: 0, multicraft: 0 },
      setBsStats: (stats) =>
        set((state) => ({ bsStats: { ...state.bsStats, ...stats } })),
      setJcStats: (stats) =>
        set((state) => ({ jcStats: { ...state.jcStats, ...stats } })),

      bsCraftCount: 500,
      jcProspectCount: 200,
      setBsCraftCount: (count) => set({ bsCraftCount: count }),
      setJcProspectCount: (count) => set({ jcProspectCount: count }),

      lastUpdated: null,
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      setLastUpdated: (date) => set({ lastUpdated: date }),

      getPriceMap: () => {
        const state = get();
        return new Map(
          Object.entries(state.prices).map(([id, entry]) => [id, entry])
        );
      },
    }),
    {
      name: 'wow-profession-calc',
      partialize: (state) => ({
        region: state.region,
        prices: state.prices,
        bsStats: state.bsStats,
        jcStats: state.jcStats,
        bsCraftCount: state.bsCraftCount,
        jcProspectCount: state.jcProspectCount,
      }),
    }
  )
);
