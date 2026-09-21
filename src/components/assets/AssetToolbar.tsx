import React, { useState } from 'react';
import { Zap, Table2, Columns3 } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { cn } from '@/lib/utils';
import ColumnVisibilityModal from './ColumnVisibilityModal';

interface AssetToolbarProps {
  totalCount?: number;
}

export const AssetToolbar: React.FC<AssetToolbarProps> = ({ totalCount }) => {
  const viewMode = useAssetStore((s) => s.viewMode);
  const setViewMode = useAssetStore((s) => s.setViewMode);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-xs">
      {/* Left: Results Info / Status */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Asset Records
        </span>
        {typeof totalCount === 'number' && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {totalCount} {totalCount === 1 ? 'asset' : 'assets'}
          </span>
        )}
      </div>

      {/* Right: Actions (View Mode Switcher + Column Visibility) */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
        {/* Visualizer and Paginator Toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('virtualized')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none',
              viewMode === 'virtualized'
                ? 'bg-blue-600 dark:bg-slate-900 text-white dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
            )}
            title="Virtualized Grid View"
          >
            <Zap className="size-3.5" />
            <span>Visualizer</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none',
              viewMode === 'table'
                ? 'bg-blue-700 dark:bg-slate-900 text-white dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
            )}
            title="Paginated Table View"
          >
            <Table2 className="size-3.5" />
            <span>Paginator</span>
          </button>
        </div>

        {/* Column Visibility Trigger Button */}
        <button
          type="button"
          onClick={() => setIsColumnModalOpen(true)}
          className="h-8.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-medium rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] select-none"
          title="Configure Column Visibility"
        >
          <Columns3 className="size-3.5 text-slate-500 dark:text-slate-400" />
          <span>Columns</span>
        </button>
      </div>

      {/* Column Visibility Dialog */}
      <ColumnVisibilityModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
      />
    </div>
  );
};

export default AssetToolbar;
