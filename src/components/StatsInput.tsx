'use client';

interface StatsInputProps {
  resourcefulness: number;
  multicraft?: number;
  onResourcefulnessChange: (value: number) => void;
  onMulticraftChange?: (value: number) => void;
  showMulticraft?: boolean;
}

export default function StatsInput({
  resourcefulness,
  multicraft,
  onResourcefulnessChange,
  onMulticraftChange,
  showMulticraft = true,
}: StatsInputProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
        Your Stats
      </h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Resourcefulness:</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={resourcefulness || ''}
              onChange={(e) => onResourcefulnessChange(parseFloat(e.target.value) || 0)}
              className="w-20 bg-gray-800 border border-gray-600 text-right text-sm rounded px-2 py-1 text-gray-200 focus:outline-none focus:border-amber-500"
              placeholder="0"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
              %
            </span>
          </div>
        </div>

        {showMulticraft && onMulticraftChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Multicraft:</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={multicraft || ''}
                onChange={(e) => onMulticraftChange(parseFloat(e.target.value) || 0)}
                className="w-20 bg-gray-800 border border-gray-600 text-right text-sm rounded px-2 py-1 text-gray-200 focus:outline-none focus:border-amber-500"
                placeholder="0"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                %
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
