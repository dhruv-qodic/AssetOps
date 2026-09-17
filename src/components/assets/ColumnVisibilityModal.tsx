import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Columns3,
  Search,
  X,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AVAILABLE_ASSET_COLUMNS, type ColumnDefinition } from '@/constans/asset.constants';
import { useColumnVisibilityStore } from '@/store/useColumnVisibilityStore';

const CATEGORIES: Array<'All' | ColumnDefinition['category']> = [
  'All',
  'Core',
  'Financial & Dates',
  'Assignment',
  'Technical',
  'System',
];

interface ColumnVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColumnVisibilityModal: React.FC<ColumnVisibilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { visibleColumnIds, toggleColumn, removeColumn, resetToDefault, selectAll, clearAll } =
    useColumnVisibilityStore();

  const selectedColumnIds = visibleColumnIds;
  const handleToggleColumn = toggleColumn;
  const handleRemoveColumn = removeColumn;
  const handleResetToDefault = resetToDefault;
  const handleSelectAll = selectAll;
  const handleClearAll = clearAll;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ColumnDefinition['category']>(
    'All',
  );

  // Filtered available columns list based on search and category tab
  const filteredColumns = useMemo(() => {
    return AVAILABLE_ASSET_COLUMNS.filter((col) => {
      const matchesCategory = selectedCategory === 'All' || col.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        col.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (col.description && col.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl"
        onClose={onClose}
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <DialogHeader className="mb-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#4C40F7] border border-blue-100 dark:border-blue-900/50">
                <Columns3 className="size-5 stroke-[2.2] text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Column Visibility</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {selectedColumnIds.length} of {AVAILABLE_ASSET_COLUMNS.length} active
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select and manage which data columns are displayed in the Assets table view.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. SELECTED COLUMNS AREA AT THE TOP */}
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[#4C40F7]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Selected Columns ({selectedColumnIds.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-xs text-slate-500 hover:text-[#4C40F7] dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset Default</span>
                </button>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={selectedColumnIds.length === 0}
                  className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            </div>

            {selectedColumnIds.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-1.5 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-lg bg-white/50 dark:bg-slate-900/50">
                <Info className="size-4 text-slate-400" />
                <span>No columns selected. Click columns below to add them to this list.</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedColumnIds.map((id, index) => {
                  const column = AVAILABLE_ASSET_COLUMNS.find((c) => c.id === id);
                  if (!column) return null;

                  return (
                    <div
                      key={id}
                      className="group flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs hover:border-[#4C40F7]/40 dark:hover:border-blue-500/40 transition-all text-xs text-slate-800 dark:text-slate-200 font-medium select-none animate-in fade-in zoom-in-95 duration-100"
                    >
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        {index + 1}.
                      </span>
                      <span>{column.label}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColumn(id)}
                        className="size-4.5 rounded flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-0.5 cursor-pointer"
                        title={`Remove ${column.label}`}
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. AVAILABLE COLUMNS SECTION */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Available Columns
                </span>
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-blue-700 hover:text-blue-600 dark:text-blue-400 font-semibold transition-colors cursor-pointer"
              >
                Select all ({AVAILABLE_ASSET_COLUMNS.length})
              </button>
            </div>

            {/* Search and Category Filter Toolbar */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search available columns by title, ID, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9.5 pl-9.5 pr-8 bg-slate-50/60 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs sm:text-sm rounded-lg"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none',
                      selectedCategory === cat
                        ? 'bg-blue-700 text-white shadow-2xs font-semibold'
                        : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300',
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Columns Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredColumns.map((col) => {
                const isSelected = selectedColumnIds.includes(col.id);

                return (
                  <div
                    key={col.id}
                    onClick={() => handleToggleColumn(col.id)}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-left',
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300/80 dark:border-blue-800/80 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30',
                    )}
                  >
                    {/* Custom Checkbox */}
                    <div
                      className={cn(
                        'size-4.5 mt-0.5 rounded-md flex items-center justify-center shrink-0 transition-colors border',
                        isSelected
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700',
                      )}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>

                    {/* Column Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {col.label}
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                          {col.category}
                        </span>
                      </div>
                      {col.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                          {col.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredColumns.length === 0 && (
                <div className="flex flex-col gap-2 items-center justify-center h-36 font-semibold  border border-2 rounded-xl border-dashed border-slate-200 dark:border-slate-800 col-span-full text-center text-xs text-slate-400 dark:text-slate-500">
                  <Columns3 className="size-6 text-blue-600" />
                  <span>No columns found matching "{searchQuery}".</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <SlidersHorizontal className="size-3.5 text-slate-400" />
            <span>
              {selectedColumnIds.length} column{selectedColumnIds.length === 1 ? '' : 's'} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 px-4 text-xs font-medium rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="h-9 px-5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-600/20 cursor-pointer"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnVisibilityModal;
