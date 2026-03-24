'use client';

import { useAppStore } from '@/lib/store';
import ImportPrices from './ImportPrices';

export default function Header() {
  const { region, setRegion, lastUpdated, isLoading, setLoading, setBulkPrices } =
    useAppStore();

  async function handleRefreshPrices() {
    setLoading(true);
    try {
      const resp = await fetch(`/api/prices?region=${region}`);
      const data = await resp.json();

      if (data.prices && Object.keys(data.prices).length > 0) {
        setBulkPrices(data.prices);
      } else if (data.error) {
        alert(`API Error: ${data.error}`);
      }
    } catch {
      alert('Failed to fetch prices. Make sure Blizzard API is configured.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="bg-gray-900 border-b border-amber-900/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-amber-400 tracking-tight">
            Am I Profitable?
          </h1>
          <span className="text-xs text-gray-500 mt-1">WoW Midnight</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Region Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Region:</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as 'us' | 'eu')}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded px-2 py-1 focus:border-amber-500 focus:outline-none"
            >
              <option value="us">US</option>
              <option value="eu">EU</option>
            </select>
          </div>

          {/* Import Prices */}
          <ImportPrices />

          {/* Refresh Prices */}
          <button
            onClick={handleRefreshPrices}
            disabled={isLoading}
            className="bg-amber-700 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors"
          >
            {isLoading ? 'Fetching...' : 'Refresh Prices'}
          </button>

          {/* Last Updated */}
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
