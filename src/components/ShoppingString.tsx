'use client';

import { useState } from 'react';

interface ShoppingStringProps {
  label: string;
  value: string;
}

export default function ShoppingString({ label, value }: ShoppingStringProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
          {label}
        </h3>
        <button
          onClick={handleCopy}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="text-xs text-gray-400 font-mono break-all leading-relaxed">
        {value}
      </p>
    </div>
  );
}
