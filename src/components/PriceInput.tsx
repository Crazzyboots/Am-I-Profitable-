'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

interface PriceInputProps {
  materialId: string;
  label: string;
  compact?: boolean;
  isGold?: boolean;
}

// Parse WoW gold format: accepts "1234", "1234.56", "1234g 56s 78c", etc.
function parseGoldInput(input: string): number {
  // Try standard number first
  const num = parseFloat(input);
  if (!isNaN(num)) return num;
  return 0;
}

// Format gold amount to g/s/c display
function formatTooltip(amount: number): string {
  if (!amount) return '';
  const gold = Math.floor(amount);
  const silver = Math.floor((amount - gold) * 100);
  const copper = Math.round(((amount - gold) * 100 - silver) * 100);
  const parts: string[] = [];
  if (gold > 0) parts.push(`${gold.toLocaleString()}g`);
  if (silver > 0) parts.push(`${silver}s`);
  if (copper > 0) parts.push(`${copper}c`);
  return parts.join(' ') || '0g';
}

export default function PriceInput({ materialId, label, compact, isGold }: PriceInputProps) {
  const price = useAppStore((s) => s.prices[materialId]);
  const setPrice = useAppStore((s) => s.setPrice);
  const [focused, setFocused] = useState(false);

  const displayValue = price?.price || '';
  const tooltip = price?.price ? formatTooltip(price.price) : '';

  const inputClasses = `bg-gray-800 border text-right text-sm rounded pl-2 pr-7 py-1 focus:outline-none focus:border-amber-500 ${
    price?.isManualOverride
      ? 'border-amber-600 text-amber-200'
      : isGold
      ? 'border-amber-800/50 text-gray-200'
      : 'border-gray-700 text-gray-200'
  }`;

  if (compact) {
    return (
      <div className="relative" title={tooltip}>
        <input
          type="number"
          step="0.0001"
          min="0"
          value={displayValue}
          onChange={(e) => setPrice(materialId, parseGoldInput(e.target.value), true)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-28 ${inputClasses}`}
          placeholder="0.00"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none">
          gold
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-sm text-gray-300 truncate">{label}</span>
      <div className="relative" title={tooltip}>
        <input
          type="number"
          step="0.0001"
          min="0"
          value={displayValue}
          onChange={(e) => setPrice(materialId, parseGoldInput(e.target.value), true)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-32 ${inputClasses}`}
          placeholder="0.00"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none">
          gold
        </span>
      </div>
    </div>
  );
}
