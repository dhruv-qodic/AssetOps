import React, { useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Laptop,
  Smartphone,
  Monitor,
  Keyboard,
  Headphones,
  HardDrive,
  Tablet,
  Radio,
  Box,
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  Wallet,
  DollarSign,
  Check,
  Trash2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ASSET_CATEGORIES, ASSET_STATUSES, ASSET_STATUS_CONFIG } from '@/constans/asset.constants';
import { EMPLOYEE_DEPARTMENTS } from '@/constans/employee.constants';
import type { AssetCategory, AssetStatus } from '@/types/asset';
import { cn } from '@/lib/utils';
import { useAssetFilterPresetStore } from '@/store/useAssetFilterPresetStore';

// Helper icon mapping for category facet
const getCategoryIcon = (cat: AssetCategory) => {
  switch (cat) {
    case 'Laptop':
      return <Laptop className="size-3.5 text-slate-500 dark:text-slate-400" />;
    case 'Mobile':
      return <Smartphone className="size-3.5 text-blue-500 dark:text-blue-400" />;
    case 'Monitor':
      return <Monitor className="size-3.5 text-indigo-500 dark:text-indigo-400" />;
    case 'Tablet':
      return <Tablet className="size-3.5 text-purple-500 dark:text-purple-400" />;
    case 'Desktop':
      return <HardDrive className="size-3.5 text-slate-500 dark:text-slate-400" />;
    case 'Networking':
      return <Radio className="size-3.5 text-cyan-500 dark:text-cyan-400" />;
    case 'Audio':
      return <Headphones className="size-3.5 text-emerald-500 dark:text-emerald-400" />;
    case 'Accessories':
      return <Keyboard className="size-3.5 text-amber-500 dark:text-amber-400" />;
    default:
      return <Box className="size-3.5 text-slate-400" />;
  }
};

// Helper icon mapping for department facet
const getDepartmentIcon = (dept: string) => {
  switch (dept) {
    case 'IT':
      return <Laptop className="size-3.5 text-indigo-500" />;
    case 'HR':
      return <Users className="size-3.5 text-emerald-500" />;
    case 'Sales':
      return <TrendingUp className="size-3.5 text-blue-500" />;
    case 'Marketing':
      return <Briefcase className="size-3.5 text-purple-500" />;
    case 'Finance':
      return <Wallet className="size-3.5 text-amber-500" />;
    default:
      return <Building2 className="size-3.5 text-slate-400" />;
  }
};

interface CostPreset {
  label: string;
  min: number | null;
  max: number | null;
}

const COST_RANGE_PRESETS: CostPreset[] = [
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 - $1,000', min: 500, max: 1000 },
  { label: '$1,000 - $2,500', min: 1000, max: 2500 },
  { label: '$2,500+', min: 2500, max: null },
];

import { useAssetFilterStore } from '@/store/useAssetFilterStore';
import { useAssetStore } from '@/store/useAssetStore';
import AssetFilterPresetModel from './AssetFilterPresetModel';

export const AssetFilterPanel: React.FC = () => {
  // Zustand Filter Store State & Selectors
  const searchKeyword = useAssetFilterStore((s) => s.searchKeyword);
  const savePreset = useAssetFilterPresetStore((s) => s.savePreset);
  const presets = useAssetFilterPresetStore((s) => s.presets);
  const deletePreset = useAssetFilterPresetStore((s) => s.deletePreset);
  const selectedCategories = useAssetFilterStore((s) => s.selectedCategories);
  const selectedStatuses = useAssetFilterStore((s) => s.selectedStatuses);
  const selectedDepartments = useAssetFilterStore((s) => s.selectedDepartments);
  const costRange = useAssetFilterStore((s) => s.costRange);

  const setSearchKeyword = useAssetFilterStore((s) => s.setSearchKeyword);
  const toggleCategory = useAssetFilterStore((s) => s.toggleCategory);
  const toggleStatus = useAssetFilterStore((s) => s.toggleStatus);
  const toggleDepartment = useAssetFilterStore((s) => s.toggleDepartment);
  const setMinCost = useAssetFilterStore((s) => s.setMinCost);
  const setMaxCost = useAssetFilterStore((s) => s.setMaxCost);
  const setCostRange = useAssetFilterStore((s) => s.setCostRange);
  const resetFilters = useAssetFilterStore((s) => s.resetFilters);
  const resetAssetStoreFilters = useAssetStore((s) => s.resetFilters);
  const setPage = useAssetStore((s) => s.setPage);
  const setSelectedCategories = useAssetFilterStore((s) => s.setSelectedCategories);
  const setSelectedStatuses = useAssetFilterStore((s) => s.setSelectedStatuses);
  const setSelectedDepartments = useAssetFilterStore((s) => s.setSelectedDepartments);

  // Section collapse states for compact view (Local UI state)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSavePresetOpen, setIsSavePresetOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Save Preset Modal Logic
  const handleSavePreset = () => {
    const trimmedName = presetName.trim();

    if (!trimmedName) {
      return;
    }

    savePreset(trimmedName, {
      searchKeyword,
      selectedCategories,
      selectedStatuses,
      selectedDepartments,
      costRange,
    });

    setPresetName('');
    setIsSavePresetOpen(false);
  };

  // Apply Preset Logic
  const handleApplyPreset = (presetId: string) => {
    const preset = presets.find((item) => item.id === presetId);

    if (!preset) {
      return;
    }

    const { filters } = preset;

    setSearchKeyword(filters.searchKeyword);
    setSelectedCategories(filters.selectedCategories);
    setSelectedStatuses(filters.selectedStatuses);
    setSelectedDepartments(filters.selectedDepartments);
    setCostRange(filters.costRange);

    setPage(1);
  };

  const handleDeletePreset = (presetId: string) => {
    deletePreset(presetId);
  };

  const handleCategoryToggle = (category: AssetCategory) => {
    toggleCategory(category);
    setPage(1);
  };

  const handleStatusToggle = (status: AssetStatus) => {
    toggleStatus(status);
    setPage(1);
  };

  const handleDepartmentToggle = (dept: string) => {
    toggleDepartment(dept);
    setPage(1);
  };

  const handlePresetClick = (preset: CostPreset) => {
    const minVal = preset.min;
    const maxVal = preset.max;

    const isCurrentlyActive = costRange.min === minVal && costRange.max === maxVal;

    if (isCurrentlyActive) {
      setCostRange({ min: null, max: null });
    } else {
      setCostRange({ min: minVal, max: maxVal });
    }
    setPage(1);
  };

  const isPresetActive = (preset: CostPreset) => {
    return costRange.min === preset.min && costRange.max === preset.max;
  };

  const handleClearAll = () => {
    resetFilters();
    resetAssetStoreFilters();
  };

  const minCostDisplay = costRange.min !== null ? costRange.min.toString() : '';
  const maxCostDisplay = costRange.max !== null ? costRange.max.toString() : '';

  const totalActiveFiltersCount =
    (searchKeyword.trim() ? 1 : 0) +
    selectedCategories.length +
    selectedStatuses.length +
    selectedDepartments.length +
    (costRange.min !== null || costRange.max !== null ? 1 : 0);

  return (
    <div className="w-full shrink-0 lg:w-72 xl:w-80">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-3">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-2xs font-medium text-slate-800 dark:text-slate-200 text-sm cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-[#4C40F7]" />
            <span>Filter Assets</span>
            {totalActiveFiltersCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#4C40F7]/10 text-[#4C40F7] dark:bg-[#4C40F7]/20">
                {totalActiveFiltersCount}
              </span>
            )}
          </div>
          {isMobileOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      </div>

      {/* Main Multi-Facet Filter Panel Container */}
      <aside
        className={cn(
          'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5',
          'transition-all duration-200',
          !isMobileOpen && 'hidden lg:block',
        )}
        aria-label="Assets Filter Panel"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#4C40F7]/10 text-[#4C40F7] dark:bg-[#4C40F7]/20">
              <SlidersHorizontal className="size-3.5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Filters
            </h2>
            {totalActiveFiltersCount > 0 && (
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[#4C40F7] text-white">
                {totalActiveFiltersCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {totalActiveFiltersCount > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setPresetName('');
                    setIsSavePresetOpen(true);
                  }}
                  className="text-xs font-medium text-[#4C40F7] hover:text-[#3D31E5] dark:text-indigo-400 cursor-pointer transition-colors"
                >
                  Save Preset
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-medium text-[#4C40F7] hover:text-[#3D31E5] dark:text-indigo-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 1. Search Keyword Facet */}
        <div className="space-y-2">
          <label
            htmlFor="filter-search-keyword"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
          >
            <span>Search Keyword</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search className="size-3.5" />
            </div>
            <Input
              id="filter-search-keyword"
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setPage(1);
              }}
              placeholder="Search keyword..."
              className="h-9 pl-9 pr-8 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-lg focus-visible:ring-2 focus-visible:ring-[#4C40F7]/20 focus-visible:border-[#4C40F7]"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => {
                  setSearchKeyword('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Saved Presets */}
        <div className="space-y-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Saved Presets
              </span>

              {presets.length > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {presets.length}
                </span>
              )}
            </div>
          </div>

          {presets.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-700 px-3 py-4 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                No saved presets yet.
              </p>

              <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                Configure filters and save them for quick access.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors"
                >
                  {/* Apply preset */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(preset.id)}
                    className="flex-1 min-w-0 flex items-center justify-between gap-2 px-3 py-2 text-left cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                        {preset.name}
                      </p>

                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {new Date(preset.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <SlidersHorizontal className="size-3.5 shrink-0 text-slate-400" />
                  </button>

                  {/* Delete preset */}
                  <button
                    type="button"
                    aria-label={`Delete ${preset.name} preset`}
                    title="Delete preset"
                    onClick={() => handleDeletePreset(preset.id)}
                    className="shrink-0 mr-2 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Category Facet */}
        <div className="space-y-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none group"
          >
            <span className="group-hover:text-[#4C40F7] transition-colors">Category</span>
            <div className="flex items-center gap-1.5">
              {selectedCategories.length > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {selectedCategories.length}
                </span>
              )}
              {collapsedSections['category'] ? (
                <ChevronDown className="size-3.5 text-slate-400 group-hover:text-slate-600" />
              ) : (
                <ChevronUp className="size-3.5 text-slate-400 group-hover:text-slate-600" />
              )}
            </div>
          </button>

          {!collapsedSections['category'] && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {ASSET_CATEGORIES.map((category) => {
                const isChecked = selectedCategories.includes(category);
                return (
                  <label
                    key={category}
                    className={cn(
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors',
                      isChecked
                        ? 'bg-indigo-50/70 text-[#4C40F7] font-medium dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                          isChecked
                            ? 'bg-[#4C40F7] border-[#4C40F7] text-white'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600',
                        )}
                      >
                        {isChecked && <Check className="size-2.5 stroke-[3]" />}
                      </div>
                      <input
                        type="checkbox"
                        aria-label={category}
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => handleCategoryToggle(category)}
                      />
                      <span className="truncate">{category}</span>
                    </div>
                    <div className="shrink-0 ml-2">{getCategoryIcon(category)}</div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Status Facet */}
        <div className="space-y-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => toggleSection('status')}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none group"
          >
            <span className="group-hover:text-[#4C40F7] transition-colors">Status</span>
            <div className="flex items-center gap-1.5">
              {selectedStatuses.length > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {selectedStatuses.length}
                </span>
              )}
              {collapsedSections['status'] ? (
                <ChevronDown className="size-3.5 text-slate-400 group-hover:text-slate-600" />
              ) : (
                <ChevronUp className="size-3.5 text-slate-400 group-hover:text-slate-600" />
              )}
            </div>
          </button>

          {!collapsedSections['status'] && (
            <div className="space-y-1.5">
              {ASSET_STATUSES.map((status: AssetStatus) => {
                const isChecked = selectedStatuses.includes(status);
                const config = ASSET_STATUS_CONFIG[status];
                return (
                  <label
                    key={status}
                    className={cn(
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors',
                      isChecked
                        ? 'bg-indigo-50/70 text-[#4C40F7] font-medium dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                          isChecked
                            ? 'bg-[#4C40F7] border-[#4C40F7] text-white'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600',
                        )}
                      >
                        {isChecked && <Check className="size-2.5 stroke-[3]" />}
                      </div>
                      <input
                        type="checkbox"
                        aria-label={status}
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => handleStatusToggle(status)}
                      />
                      <span className="truncate">{status}</span>
                    </div>
                    {/* Status Dot */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className={cn('size-2 rounded-full', config.dot)} />
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Department Facet */}
        <div className="space-y-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => toggleSection('department')}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none group"
          >
            <span className="group-hover:text-[#4C40F7] transition-colors">Department</span>
            <div className="flex items-center gap-1.5">
              {selectedDepartments.length > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {selectedDepartments.length}
                </span>
              )}
              {collapsedSections['department'] ? (
                <ChevronDown className="size-3.5 text-slate-400 group-hover:text-slate-600" />
              ) : (
                <ChevronUp className="size-3.5 text-slate-400 group-hover:text-slate-600" />
              )}
            </div>
          </button>

          {!collapsedSections['department'] && (
            <div className="space-y-1.5">
              {EMPLOYEE_DEPARTMENTS.map((dept) => {
                const isChecked = selectedDepartments.includes(dept);
                return (
                  <label
                    key={dept}
                    className={cn(
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors',
                      isChecked
                        ? 'bg-indigo-50/70 text-[#4C40F7] font-medium dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                          isChecked
                            ? 'bg-[#4C40F7] border-[#4C40F7] text-white'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600',
                        )}
                      >
                        {isChecked && <Check className="size-2.5 stroke-[3]" />}
                      </div>
                      <input
                        type="checkbox"
                        aria-label={dept}
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => handleDepartmentToggle(dept)}
                      />
                      <span className="truncate">{dept}</span>
                    </div>
                    <div className="shrink-0 ml-2">{getDepartmentIcon(dept)}</div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Cost Range Facet */}
        <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => toggleSection('cost')}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none group"
          >
            <span className="group-hover:text-[#4C40F7] transition-colors">Cost Range</span>
            <div className="flex items-center gap-1.5">
              {(costRange.min !== null || costRange.max !== null) && (
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Active
                </span>
              )}
              {collapsedSections['cost'] ? (
                <ChevronDown className="size-3.5 text-slate-400 group-hover:text-slate-600" />
              ) : (
                <ChevronUp className="size-3.5 text-slate-400 group-hover:text-slate-600" />
              )}
            </div>
          </button>

          {!collapsedSections['cost'] && (
            <div className="space-y-3">
              {/* Min - Max Input Boxes */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Min ($)
                  </span>
                  <div className="relative">
                    <DollarSign className="size-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="number"
                      min="0"
                      value={minCostDisplay}
                      onChange={(e) => {
                        setMinCost(e.target.value);
                        setPage(1);
                      }}
                      placeholder="0"
                      className="h-8 pl-6 pr-2 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 rounded-md focus-visible:ring-1 focus-visible:ring-[#4C40F7]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Max ($)
                  </span>
                  <div className="relative">
                    <DollarSign className="size-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="number"
                      min="0"
                      value={maxCostDisplay}
                      onChange={(e) => {
                        setMaxCost(e.target.value);
                        setPage(1);
                      }}
                      placeholder="5000"
                      className="h-8 pl-6 pr-2 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 rounded-md focus-visible:ring-1 focus-visible:ring-[#4C40F7]"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Preset Range Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  Quick Select
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {COST_RANGE_PRESETS.map((preset) => {
                    const isSelected = isPresetActive(preset);
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handlePresetClick(preset)}
                        className={cn(
                          'px-2 py-1 text-[11px] rounded-md font-medium border text-center transition-all cursor-pointer truncate',
                          isSelected
                            ? 'bg-[#4C40F7] border-[#4C40F7] text-white shadow-2xs'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200',
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/** Save Preset Dialog */}
      {/* <Dialog open={isSavePresetOpen} onOpenChange={setIsSavePresetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Filter Preset</DialogTitle>

            <DialogDescription>
              Give this filter combination a name so you can reuse it later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label
              htmlFor="preset-name"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Preset Name
            </label>

            <Input
              id="preset-name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="e.g. Available IT Laptops"
              maxLength={100}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && presetName.trim()) {
                  handleSavePreset();
                }
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPresetName('');
                setIsSavePresetOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button type="button" onClick={handleSavePreset} disabled={!presetName.trim()}>
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <AssetFilterPresetModel
        isSavePresetOpen={isSavePresetOpen}
        setPresetName={setPresetName}
        setIsSavePresetOpen={setIsSavePresetOpen}
        presetName={presetName}
        handleSavePreset={handleSavePreset}
      />
    </div>
  );
};

export default AssetFilterPanel;
