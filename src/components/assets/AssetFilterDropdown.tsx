import React, { useState, useRef, useEffect } from 'react';
import {
  Filter,
  Tag,
  Activity,
  Building2,
  DollarSign,
  Bookmark,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  X,
  Laptop,
  Smartphone,
  Monitor,
  Keyboard,
  Headphones,
  HardDrive,
  Tablet,
  Radio,
  Box,
  Users,
  Briefcase,
  TrendingUp,
  Wallet,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ASSET_CATEGORIES,
  ASSET_STATUSES,
  ASSET_STATUS_CONFIG,
  ASSET_LOCATIONS,
} from '@/constant/asset.constants';
import { EMPLOYEE_DEPARTMENTS } from '@/constant/employee.constants';
import type { AssetCategory, AssetStatus } from '@/types/asset';
import { cn } from '@/lib/utils';
import { useAssetFilterStore } from '@/store/useAssetFilterStore';
import { useAssetFilterPresetStore } from '@/store/useAssetFilterPresetStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useActiveAllocationFilterStore } from '@/store/useActiveAllocationFilterStore';
import AssetFilterPresetModal from './AssetFilterPresetModel';
import { toast } from 'sonner';

export type AssetFilterDropdownMode = 'assets' | 'allocations';

type FilterTab = 'category' | 'status' | 'department' | 'location' | 'cost' | 'presets';

export interface AssetFilterDropdownProps {
  mode?: AssetFilterDropdownMode;
  onFilterChange?: () => void;
}

const getCategoryIcon = (cat: AssetCategory) => {
  switch (cat) {
    case 'Laptop':
      return <Laptop className="size-4 text-slate-500 dark:text-slate-400" />;
    case 'Mobile':
      return <Smartphone className="size-4 text-blue-500 dark:text-blue-400" />;
    case 'Monitor':
      return <Monitor className="size-4 text-indigo-500 dark:text-indigo-400" />;
    case 'Tablet':
      return <Tablet className="size-4 text-purple-500 dark:text-purple-400" />;
    case 'Desktop':
      return <HardDrive className="size-4 text-slate-500 dark:text-slate-400" />;
    case 'Networking':
      return <Radio className="size-4 text-cyan-500 dark:text-cyan-400" />;
    case 'Audio':
      return <Headphones className="size-4 text-emerald-500 dark:text-emerald-400" />;
    case 'Accessories':
      return <Keyboard className="size-4 text-amber-500 dark:text-amber-400" />;
    default:
      return <Box className="size-4 text-slate-400" />;
  }
};

const getDepartmentIcon = (dept: string) => {
  switch (dept) {
    case 'IT':
      return <Laptop className="size-4 text-indigo-500" />;
    case 'HR':
      return <Users className="size-4 text-emerald-500" />;
    case 'Sales':
      return <TrendingUp className="size-4 text-blue-500" />;
    case 'Marketing':
      return <Briefcase className="size-4 text-purple-500" />;
    case 'Finance':
      return <Wallet className="size-4 text-amber-500" />;
    default:
      return <Building2 className="size-4 text-slate-400" />;
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

export const AssetFilterDropdown: React.FC<AssetFilterDropdownProps> = ({
  mode = 'assets',
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('category');
  const [isSavePresetOpen, setIsSavePresetOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Asset Filter Store (used in Assets mode)
  const assetSearchKeyword = useAssetFilterStore((s) => s.searchKeyword);
  const assetSelectedCategories = useAssetFilterStore((s) => s.selectedCategories);
  const assetSelectedStatuses = useAssetFilterStore((s) => s.selectedStatuses);
  const assetSelectedDepartments = useAssetFilterStore((s) => s.selectedDepartments);
  const assetCostRange = useAssetFilterStore((s) => s.costRange);

  const setAssetSearchKeyword = useAssetFilterStore((s) => s.setSearchKeyword);
  const setAssetSelectedCategories = useAssetFilterStore((s) => s.setSelectedCategories);
  const setAssetSelectedStatuses = useAssetFilterStore((s) => s.setSelectedStatuses);
  const setAssetSelectedDepartments = useAssetFilterStore((s) => s.setSelectedDepartments);
  const toggleAssetCategory = useAssetFilterStore((s) => s.toggleCategory);
  const toggleAssetStatus = useAssetFilterStore((s) => s.toggleStatus);
  const toggleAssetDepartment = useAssetFilterStore((s) => s.toggleDepartment);
  const setAssetMinCost = useAssetFilterStore((s) => s.setMinCost);
  const setAssetMaxCost = useAssetFilterStore((s) => s.setMaxCost);
  const setAssetCostRange = useAssetFilterStore((s) => s.setCostRange);
  const resetAssetFilters = useAssetFilterStore((s) => s.resetFilters);

  const resetAssetStoreFilters = useAssetStore((s) => s.resetFilters);
  const setAssetStorePage = useAssetStore((s) => s.setPage);

  const presets = useAssetFilterPresetStore((s) => s.presets);
  const savePreset = useAssetFilterPresetStore((s) => s.savePreset);
  const deletePreset = useAssetFilterPresetStore((s) => s.deletePreset);

  // Active Allocation Filter Store (used in Allocations mode)
  const allocSelectedCategories = useActiveAllocationFilterStore((s) => s.selectedCategories);
  const allocSelectedDepartments = useActiveAllocationFilterStore((s) => s.selectedDepartments);
  const allocSelectedLocations = useActiveAllocationFilterStore((s) => s.selectedLocations);
  const allocCostRange = useActiveAllocationFilterStore((s) => s.costRange);

  const setAllocSelectedCategories = useActiveAllocationFilterStore((s) => s.setSelectedCategories);
  const setAllocSelectedDepartments = useActiveAllocationFilterStore(
    (s) => s.setSelectedDepartments,
  );
  const setAllocSelectedLocations = useActiveAllocationFilterStore((s) => s.setSelectedLocations);
  const toggleAllocCategory = useActiveAllocationFilterStore((s) => s.toggleCategory);
  const toggleAllocDepartment = useActiveAllocationFilterStore((s) => s.toggleDepartment);
  const toggleAllocLocation = useActiveAllocationFilterStore((s) => s.toggleLocation);
  const setAllocMinCost = useActiveAllocationFilterStore((s) => s.setMinCost);
  const setAllocMaxCost = useActiveAllocationFilterStore((s) => s.setMaxCost);
  const setAllocCostRange = useActiveAllocationFilterStore((s) => s.setCostRange);
  const resetAllocFilters = useActiveAllocationFilterStore((s) => s.resetFilters);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isAllocations = mode === 'allocations';

  // Active values depending on mode
  const selectedCategories = isAllocations ? allocSelectedCategories : assetSelectedCategories;
  const selectedStatuses = isAllocations ? [] : assetSelectedStatuses;
  const selectedDepartments = isAllocations ? allocSelectedDepartments : assetSelectedDepartments;
  const selectedLocations = isAllocations ? allocSelectedLocations : [];
  const costRange = isAllocations ? allocCostRange : assetCostRange;

  // Counts of active filters
  const totalActiveFiltersCount = isAllocations
    ? selectedCategories.length +
      selectedDepartments.length +
      selectedLocations.length +
      (costRange.min !== null || costRange.max !== null ? 1 : 0)
    : (assetSearchKeyword.trim() ? 1 : 0) +
      selectedCategories.length +
      selectedStatuses.length +
      selectedDepartments.length +
      (costRange.min !== null || costRange.max !== null ? 1 : 0);

  const handleResetAll = () => {
    if (isAllocations) {
      resetAllocFilters();
      onFilterChange?.();
    } else {
      resetAssetFilters();
      resetAssetStoreFilters();
      setAssetStorePage(1);
    }
    toast.success('Filters reset');
  };

  const handleCategoryToggle = (category: AssetCategory) => {
    if (isAllocations) {
      toggleAllocCategory(category);
      onFilterChange?.();
    } else {
      toggleAssetCategory(category);
      setAssetStorePage(1);
    }
  };

  const handleStatusToggle = (status: AssetStatus) => {
    if (!isAllocations) {
      toggleAssetStatus(status);
      setAssetStorePage(1);
    }
  };

  const handleDepartmentToggle = (dept: string) => {
    if (isAllocations) {
      toggleAllocDepartment(dept);
      onFilterChange?.();
    } else {
      toggleAssetDepartment(dept);
      setAssetStorePage(1);
    }
  };

  const handleLocationToggle = (location: string) => {
    if (isAllocations) {
      toggleAllocLocation(location);
      onFilterChange?.();
    }
  };

  const handleSelectAllCategories = () => {
    if (isAllocations) {
      setAllocSelectedCategories([...ASSET_CATEGORIES]);
      onFilterChange?.();
    } else {
      setAssetSelectedCategories([...ASSET_CATEGORIES]);
      setAssetStorePage(1);
    }
  };

  const handleClearCategories = () => {
    if (isAllocations) {
      setAllocSelectedCategories([]);
      onFilterChange?.();
    } else {
      setAssetSelectedCategories([]);
      setAssetStorePage(1);
    }
  };

  const handleSelectAllDepartments = () => {
    if (isAllocations) {
      setAllocSelectedDepartments([...EMPLOYEE_DEPARTMENTS]);
      onFilterChange?.();
    } else {
      setAssetSelectedDepartments([...EMPLOYEE_DEPARTMENTS]);
      setAssetStorePage(1);
    }
  };

  const handleClearDepartments = () => {
    if (isAllocations) {
      setAllocSelectedDepartments([]);
      onFilterChange?.();
    } else {
      setAssetSelectedDepartments([]);
      setAssetStorePage(1);
    }
  };

  const handleSelectAllLocations = () => {
    if (isAllocations) {
      setAllocSelectedLocations([...ASSET_LOCATIONS]);
      onFilterChange?.();
    }
  };

  const handleClearLocations = () => {
    if (isAllocations) {
      setAllocSelectedLocations([]);
      onFilterChange?.();
    }
  };

  const handlePresetClick = (preset: CostPreset) => {
    const minVal = preset.min;
    const maxVal = preset.max;
    const isCurrentlyActive = costRange.min === minVal && costRange.max === maxVal;

    if (isAllocations) {
      if (isCurrentlyActive) {
        setAllocCostRange({ min: null, max: null });
      } else {
        setAllocCostRange({ min: minVal, max: maxVal });
      }
      onFilterChange?.();
    } else {
      if (isCurrentlyActive) {
        setAssetCostRange({ min: null, max: null });
      } else {
        setAssetCostRange({ min: minVal, max: maxVal });
      }
      setAssetStorePage(1);
    }
  };

  const isPresetActive = (preset: CostPreset) => {
    return costRange.min === preset.min && costRange.max === preset.max;
  };

  const handleSavePreset = () => {
    const trimmedName = presetName.trim();
    if (!trimmedName) return;

    savePreset(trimmedName, {
      searchKeyword: assetSearchKeyword,
      selectedCategories: assetSelectedCategories,
      selectedStatuses: assetSelectedStatuses,
      selectedDepartments: assetSelectedDepartments,
      costRange: assetCostRange,
    });

    toast.success(`Filter preset "${trimmedName}" saved`);
    setPresetName('');
    setIsSavePresetOpen(false);
  };

  const handleApplySavedPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;

    const { filters } = preset;
    setAssetSearchKeyword(filters.searchKeyword);
    setAssetSelectedCategories(filters.selectedCategories);
    setAssetSelectedStatuses(filters.selectedStatuses);
    setAssetSelectedDepartments(filters.selectedDepartments);
    setAssetCostRange(filters.costRange);
    setAssetStorePage(1);

    toast.success(`Applied preset "${preset.name}"`);
  };

  const handleDeleteSavedPreset = (presetId: string, name: string) => {
    deletePreset(presetId);
    toast.success(`Deleted preset "${name}"`);
  };

  const minCostDisplay = costRange.min !== null ? costRange.min.toString() : '';
  const maxCostDisplay = costRange.max !== null ? costRange.max.toString() : '';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-8.5 px-3 border text-xs font-medium rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] select-none',
          isOpen || totalActiveFiltersCount > 0
            ? 'bg-blue-50/80 dark:bg-blue-950/60 border-[#155DFC] text-[#155DFC] dark:text-blue-400 font-semibold'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
        )}
        title={isAllocations ? 'Filter Active Allocations' : 'Open Asset Filters'}
        aria-label={isAllocations ? 'Filter active allocations' : 'Open Asset Filters'}
      >
        <Filter className="size-3.5" />
        <span>Filter</span>
        {totalActiveFiltersCount > 0 && (
          <span className="size-4.5 rounded-full bg-[#155DFC] text-white text-[10px] font-bold flex items-center justify-center">
            {totalActiveFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Popup Window */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[340px] xs:w-[420px] sm:w-[480px] md:w-[520px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
          {/* Popup Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Filters
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                {totalActiveFiltersCount} Selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isAllocations && totalActiveFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPresetName('');
                    setIsSavePresetOpen(true);
                  }}
                  className="text-xs font-semibold text-[#155DFC] hover:text-[#0D4ECC] dark:text-blue-400 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Save Preset</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Popup Body: 2-Column Tabs & Facet Options */}
          <div className="flex min-h-[300px] max-h-[360px] overflow-hidden">
            {/* Left Column: Filter Tabs */}
            <div className="w-40 sm:w-44 border-r border-slate-100 dark:border-slate-800/80 p-2.5 space-y-1 bg-slate-50/40 dark:bg-slate-900/40 shrink-0 select-none overflow-y-auto">
              {/* Category Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('category')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer',
                  activeTab === 'category'
                    ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#155DFC] dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                )}
              >
                <div className="flex items-center gap-2">
                  <Tag className="size-3.5 shrink-0" />
                  <span>Category</span>
                </div>
                {selectedCategories.length > 0 && (
                  <span className="size-4.5 rounded-full bg-[#155DFC] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {selectedCategories.length}
                  </span>
                )}
              </button>

              {/* Status Tab (Assets mode only) */}
              {!isAllocations && (
                <button
                  type="button"
                  onClick={() => setActiveTab('status')}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer',
                    activeTab === 'status'
                      ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#155DFC] dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="size-3.5 shrink-0" />
                    <span>Status</span>
                  </div>
                  {selectedStatuses.length > 0 && (
                    <span className="size-4.5 rounded-full bg-[#155DFC] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {selectedStatuses.length}
                    </span>
                  )}
                </button>
              )}

              {/* Department Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('department')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer',
                  activeTab === 'department'
                    ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#155DFC] dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                )}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="size-3.5 shrink-0" />
                  <span>Department</span>
                </div>
                {selectedDepartments.length > 0 && (
                  <span className="size-4.5 rounded-full bg-[#155DFC] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {selectedDepartments.length}
                  </span>
                )}
              </button>

              {/* Location Tab (Allocations mode) */}
              {isAllocations && (
                <button
                  type="button"
                  onClick={() => setActiveTab('location')}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer',
                    activeTab === 'location'
                      ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#155DFC] dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 shrink-0" />
                    <span>Location</span>
                  </div>
                  {selectedLocations.length > 0 && (
                    <span className="size-4.5 rounded-full bg-[#155DFC] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {selectedLocations.length}
                    </span>
                  )}
                </button>
              )}

              {/* Cost Range Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('cost')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer',
                  activeTab === 'cost'
                    ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#155DFC] dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                )}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="size-3.5 shrink-0" />
                  <span>Cost Range</span>
                </div>
                {(costRange.min !== null || costRange.max !== null) && (
                  <span className="size-2 rounded-full bg-[#155DFC] shrink-0" />
                )}
              </button>

              {/* Saved Presets Tab (Assets mode) */}
              {!isAllocations && (
                <>
                  <div className="pt-2 pb-1">
                    <div className="border-t border-slate-200/80 dark:border-slate-800" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('presets')}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer',
                      activeTab === 'presets'
                        ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#155DFC] dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Bookmark className="size-3.5 shrink-0" />
                      <span>Saved Presets</span>
                    </div>
                    {presets.length > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {presets.length}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Right Column: Facet Options */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 select-none">
              {/* 1. Category Options */}
              {activeTab === 'category' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Asset Categories
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllCategories}
                        className="text-[11px] font-semibold text-[#155DFC] hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={handleClearCategories}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {ASSET_CATEGORIES.map((category) => {
                      const isChecked = selectedCategories.includes(category);
                      return (
                        <label
                          key={category}
                          className={cn(
                            'flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer select-none transition-colors border',
                            isChecked
                              ? 'bg-blue-50/70 border-blue-200/80 text-[#155DFC] font-semibold dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                                isChecked
                                  ? 'bg-[#155DFC] border-[#155DFC] text-white'
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
                          <div className="shrink-0 ml-1">{getCategoryIcon(category)}</div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Status Options (Assets mode only) */}
              {!isAllocations && activeTab === 'status' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Asset Status
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAssetSelectedStatuses([...ASSET_STATUSES]);
                          setAssetStorePage(1);
                        }}
                        className="text-[11px] font-semibold text-[#155DFC] hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAssetSelectedStatuses([]);
                          setAssetStorePage(1);
                        }}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {ASSET_STATUSES.map((status: AssetStatus) => {
                      const isChecked = selectedStatuses.includes(status);
                      const config = ASSET_STATUS_CONFIG[status];
                      return (
                        <label
                          key={status}
                          className={cn(
                            'flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer select-none transition-colors border',
                            isChecked
                              ? 'bg-blue-50/70 border-blue-200/80 text-[#155DFC] font-semibold dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                                isChecked
                                  ? 'bg-[#155DFC] border-[#155DFC] text-white'
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
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className={cn('size-2 rounded-full', config.dot)} />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Department Options */}
              {activeTab === 'department' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Department
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllDepartments}
                        className="text-[11px] font-semibold text-[#155DFC] hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={handleClearDepartments}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {EMPLOYEE_DEPARTMENTS.map((dept) => {
                      const isChecked = selectedDepartments.includes(dept);
                      return (
                        <label
                          key={dept}
                          className={cn(
                            'flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer select-none transition-colors border',
                            isChecked
                              ? 'bg-blue-50/70 border-blue-200/80 text-[#155DFC] font-semibold dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                                isChecked
                                  ? 'bg-[#155DFC] border-[#155DFC] text-white'
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
                          <div className="shrink-0 ml-1">{getDepartmentIcon(dept)}</div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Location Options (Allocations mode) */}
              {isAllocations && activeTab === 'location' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Asset Location
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllLocations}
                        className="text-[11px] font-semibold text-[#155DFC] hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={handleClearLocations}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {ASSET_LOCATIONS.map((loc) => {
                      const isChecked = selectedLocations.includes(loc);
                      return (
                        <label
                          key={loc}
                          className={cn(
                            'flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer select-none transition-colors border',
                            isChecked
                              ? 'bg-blue-50/70 border-blue-200/80 text-[#155DFC] font-semibold dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                                isChecked
                                  ? 'bg-[#155DFC] border-[#155DFC] text-white'
                                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600',
                              )}
                            >
                              {isChecked && <Check className="size-2.5 stroke-[3]" />}
                            </div>
                            <input
                              type="checkbox"
                              aria-label={loc}
                              className="sr-only"
                              checked={isChecked}
                              onChange={() => handleLocationToggle(loc)}
                            />
                            <span className="truncate">{loc}</span>
                          </div>
                          <div className="shrink-0 ml-1">
                            <MapPin className="size-3.5 text-slate-400" />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. Cost Range Options */}
              {activeTab === 'cost' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Purchase Cost Range ($)
                    </span>
                    {(costRange.min !== null || costRange.max !== null) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (isAllocations) {
                            setAllocCostRange({ min: null, max: null });
                            onFilterChange?.();
                          } else {
                            setAssetCostRange({ min: null, max: null });
                            setAssetStorePage(1);
                          }
                        }}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                      >
                        Reset Cost
                      </button>
                    )}
                  </div>

                  {/* Min - Max Input Boxes */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        Min ($)
                      </span>
                      <div className="relative">
                        <DollarSign className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="number"
                          min="0"
                          value={minCostDisplay}
                          onChange={(e) => {
                            if (isAllocations) {
                              setAllocMinCost(e.target.value);
                              onFilterChange?.();
                            } else {
                              setAssetMinCost(e.target.value);
                              setAssetStorePage(1);
                            }
                          }}
                          placeholder="0"
                          className="h-8.5 pl-7 pr-2 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 rounded-lg focus-visible:ring-1 focus-visible:ring-[#155DFC]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        Max ($)
                      </span>
                      <div className="relative">
                        <DollarSign className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="number"
                          min="0"
                          value={maxCostDisplay}
                          onChange={(e) => {
                            if (isAllocations) {
                              setAllocMaxCost(e.target.value);
                              onFilterChange?.();
                            } else {
                              setAssetMaxCost(e.target.value);
                              setAssetStorePage(1);
                            }
                          }}
                          placeholder="5000"
                          className="h-8.5 pl-7 pr-2 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 rounded-lg focus-visible:ring-1 focus-visible:ring-[#155DFC]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Preset Range Pills */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                      Quick Preset Range
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
                              'px-2.5 py-1.5 text-xs rounded-lg font-medium border text-center transition-all cursor-pointer truncate',
                              isSelected
                                ? 'bg-[#155DFC] border-[#155DFC] text-white shadow-2xs'
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

              {/* 6. Saved Presets Options (Assets mode only) */}
              {!isAllocations && activeTab === 'presets' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Saved Filter Presets
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPresetName('');
                        setIsSavePresetOpen(true);
                      }}
                      className="text-[11px] font-semibold text-[#155DFC] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3" />
                      <span>Save Current</span>
                    </button>
                  </div>

                  {presets.length > 0 ? (
                    <div className="space-y-2">
                      {presets.map((preset) => (
                        <div
                          key={preset.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                              {preset.name}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-slate-400">
                              {preset.filters.selectedCategories.length > 0 && (
                                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                                  {preset.filters.selectedCategories.join(', ')}
                                </span>
                              )}
                              {preset.filters.selectedStatuses.length > 0 && (
                                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                                  {preset.filters.selectedStatuses.join(', ')}
                                </span>
                              )}
                              {preset.filters.selectedDepartments.length > 0 && (
                                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                                  {preset.filters.selectedDepartments.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              type="button"
                              onClick={() => handleApplySavedPreset(preset.id)}
                              className="h-7 px-2.5 text-[11px] bg-[#155DFC] hover:bg-[#0D4ECC] text-white font-medium rounded-lg"
                            >
                              Apply
                            </Button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSavedPreset(preset.id, preset.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Delete preset"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="font-medium text-slate-600 dark:text-slate-300">
                        No saved presets yet
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Choose your filter criteria and click "Save Preset" to reuse anytime.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Popup Footer */}
          <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetAll}
              aria-label="Reset all filters"
              className="text-xs font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="h-8.5 px-3.5 text-xs font-medium rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8.5 px-4 bg-[#155DFC] hover:bg-[#0D4ECC] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Save Preset Modal (Assets mode only) */}
      {!isAllocations && (
        <AssetFilterPresetModal
          isSavePresetOpen={isSavePresetOpen}
          setPresetName={setPresetName}
          setIsSavePresetOpen={setIsSavePresetOpen}
          presetName={presetName}
          handleSavePreset={handleSavePreset}
        />
      )}
    </div>
  );
};

export default AssetFilterDropdown;
