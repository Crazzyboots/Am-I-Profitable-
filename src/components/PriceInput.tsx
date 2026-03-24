'use client';

import { useAppStore } from '@/lib/store';

interface PriceInputProps {
  materialId: string;
  label: string;
  compact?: boolean;
  isGold?: boolean;
}

export default function PriceInput({ materialId, label, compact, isGold }: PriceInputProps) {
  const price = useAppStore((s) => s.prices[materialId]);
  const setPrice = useAppStore((s) => s.setPrice);

  if (compact) {
    return (
      <div className="relative">
        <input
          type="number"
          step="0.01"
          min="0"
          value={price?.price || ''}
          onChange={(e) => setPrice(materialId, parseFloat(e.target.value) || 0, true)}
          className={`w-28 bg-gray-800 border text-right text-sm rounded px-2 py-1 focus:outline-none focus:border-amber-500 ${
            price?.isManualOverride
              ? 'border-amber-600 text-amber-200'
              : isGold
              ? 'border-amber-800/50 text-gray-200'
              : 'border-gray-700 text-gray-200'
          }`}
          placeholder="0.00"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
          g
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-sm text-gray-300 truncate">{label}</span>
      <div className="relative">
        <input
          type="number"
          step="0.01"
          min="0"
          value={price?.price || ''}
          onChange={(e) => setPrice(materialId, parseFloat(e.target.value) || 0, true)}
          className={`w-28 bg-gray-800 border text-right text-sm rounded px-2 py-1 focus:outline-none focus:border-amber-500 ${
            price?.isManualOverride
              ? 'border-amber-600 text-amber-200'
              : 'border-gray-700 text-gray-200'
          }`}
          placeholder="0.00"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
          g
        </span>
      </div>
    </div>
  );
}
