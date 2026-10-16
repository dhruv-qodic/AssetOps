import React, { useState, useRef, useEffect } from 'react';
import {
  Filter,
  Tag,
  Activity,
  Building2,
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
import { useTranslation } from 'react-i18next';
import {
  ASSET_FILTER_DROPDOWN_TITLES,
  ASSET_FILTER_DROPDOWN_BUTTONS,
  ASSET_FILTER_DROPDOWN_PLACEHOLDERS,
  ASSET_FILTER_DROPDOWN_MESSAGES,
  ASSET_FILTER_DROPDOWN_TOOLTIPS,
  type CostPreset,
} from './constants/AssetFilterDropdown.constants';
import { useCurrency } from '@/hooks/useCurrency';

export type AssetFilterDropdownMode = 'assets' | 'allocations';

type FilterTab = 'category' | 'status' | 'department' | 'location' | 'cost' | 'presets';

export interface AssetFilterDropdownProps {
  mode?: AssetFilterDropdownMode;
  onFilterChange?: () => void;
}

/**
 * @ description: Returns the associated Lucide icon for an asset category.
 * @param {AssetCategory} cat - Asset category.
 * @returns {JSX.Element} Icon JSX element.
 */
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

/**
 * @ description: Returns the associated Lucide icon for an employee department.
 * @param {string} dept - Department name.
 * @returns {JSX.Element} Icon JSX element.
 */
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

/**
 * @ description: Multi-tab filter popover for assets and active allocations with presets.
 * @param {AssetFilterDropdownProps} props - Component properties for filter dropdown.
 * @returns {JSX.Element} Filter popover dropdown component JSX.
 */
export const AssetFilterDropdown: React.FC<AssetFilterDropdownProps> = ({
  mode = 'assets',
  onFilterChange,
}) => {
  const { t: translateAssets } = useTranslation('asset');
  const { t: translateEmployees } = useTranslation('employee');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('category');
  const [isSavePresetOpen, setIsSavePresetOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { symbol, formatConverted, convert } = useCurrency();

  const dynamicPresets: CostPreset[] = React.useMemo(() => {
    const p1 = Math.round(convert(500));
    const p2 = Math.round(convert(1000));
    const p3 = Math.round(convert(2500));

    return [
      {
        label: `Under ${formatConverted(p1, 0)}`,
        min: 0,
        max: p1,
      },
      {
        label: `${formatConverted(p1, 0)} - ${formatConverted(p2, 0)}`,
        min: p1,
        max: p2,
      },
      {
        label: `${formatConverted(p2, 0)} - ${formatConverted(p3, 0)}`,
        min: p2,
        max: p3,
      },
      {
        label: `${formatConverted(p3, 0)}+`,
        min: p3,
        max: null,
      },
    ];
  }, [convert, formatConverted]);

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

  /**
   * @ description: Close dropdown on click outside.
   * @returns {void}
   */
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

  /**
   * @ description: Resets all active filters to their default states.
   * @returns {void}
   */
  const handleResetAll = () => {
    if (isAllocations) {
      resetAllocFilters();
      onFilterChange?.();
    } else {
      resetAssetFilters();
      resetAssetStoreFilters();
      setAssetStorePage(1);
    }
    toast.success(ASSET_FILTER_DROPDOWN_MESSAGES.RESET_SUCCESS);
  };

  /**
   * @ description: Toggles selection of an asset category filter.
   * @param {AssetCategory} category - Asset category to toggle.
   * @returns {void}
   */
  const handleCategoryToggle = (category: AssetCategory) => {
    if (isAllocations) {
      toggleAllocCategory(category);
      onFilterChange?.();
    } else {
      toggleAssetCategory(category);
      setAssetStorePage(1);
    }
  };

  /**
   * @ description: Toggles selection of an asset status filter.
   * @param {AssetStatus} status - Asset status to toggle.
   * @returns {void}
   */
  const handleStatusToggle = (status: AssetStatus) => {
    if (!isAllocations) {
      toggleAssetStatus(status);
      setAssetStorePage(1);
    }
  };

  /**
   * @ description: Toggles selection of a department filter.
   * @param {string} dept - Department name to toggle.
   * @returns {void}
   */
  const handleDepartmentToggle = (dept: string) => {
    if (isAllocations) {
      toggleAllocDepartment(dept);
      onFilterChange?.();
    } else {
      toggleAssetDepartment(dept);
      setAssetStorePage(1);
    }
  };

  /**
   * @ description: Toggles selection of a location filter in allocations mode.
   * @param {string} location - Location name to toggle.
   * @returns {void}
   */
  const handleLocationToggle = (location: string) => {
    if (isAllocations) {
      toggleAllocLocation(location);
      onFilterChange?.();
    }
  };

  /**
   * @ description: Selects all available categories.
   * @returns {void}
   */
  const handleSelectAllCategories = () => {
    if (isAllocations) {
      setAllocSelectedCategories([...ASSET_CATEGORIES]);
      onFilterChange?.();
    } else {
      setAssetSelectedCategories([...ASSET_CATEGORIES]);
      setAssetStorePage(1);
    }
  };

  /**
   * @ description: Clears all selected category filters.
   * @returns {void}
   */
  const handleClearCategories = () => {
    if (isAllocations) {
      setAllocSelectedCategories([]);
      onFilterChange?.();
    } else {
      setAssetSelectedCategories([]);
      setAssetStorePage(1);
    }
  };

  /**
   * @ description: Selects all available department filters.
   * @returns {void}
   */
  const handleSelectAllDepartments = () => {
    if (isAllocations) {
      setAllocSelectedDepartments([...EMPLOYEE_DEPARTMENTS]);
      onFilterChange?.();
    } else {
      setAssetSelectedDepartments([...EMPLOYEE_DEPARTMENTS]);
      setAssetStorePage(1);
    }
  };

  /**
   * @ description: Clears all selected department filters.
   * @returns {void}
   */
  const handleClearDepartments = () => {
    if (isAllocations) {
      setAllocSelectedDepartments([]);
      onFilterChange?.();
    } else {
      setAssetSelectedDepartments([]);
      setAssetStorePage(1);
    }
  };

  /**
   * @ description: Selects all available location filters in allocations mode.
   * @returns {void}
   */
  const handleSelectAllLocations = () => {
    if (isAllocations) {
      setAllocSelectedLocations([...ASSET_LOCATIONS]);
      onFilterChange?.();
    }
  };

  /**
   * @ description: Clears all selected location filters in allocations mode.
   * @returns {void}
   */
  const handleClearLocations = () => {
    if (isAllocations) {
      setAllocSelectedLocations([]);
      onFilterChange?.();
    }
  };

  /**
   * @ description: Applies or toggles a predefined cost range preset.
   * @param {{ label: string; min: number; max: number | null }} preset - Selected cost preset configuration.
   * @returns {void}
   */
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

  /**
   * @ description: Determines if the given cost preset is currently active.
   * @param {{ min: number; max: number | null }} preset - Cost preset to check.
   * @returns {boolean} Boolean indicating if preset matches active cost range.
   */
  const isPresetActive = (preset: CostPreset) => {
    return costRange.min === preset.min && costRange.max === preset.max;
  };

  /**
   * @ description: Saves current filter values as a named preset.
   * @returns {void}
   */
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

    toast.success(
      `${ASSET_FILTER_DROPDOWN_MESSAGES.PRESET_SAVED_PREFIX}${trimmedName}${ASSET_FILTER_DROPDOWN_MESSAGES.PRESET_SAVED_SUFFIX}`,
    );
    setPresetName('');
    setIsSavePresetOpen(false);
  };

  /**
   * @ description: Applies a previously saved filter preset by ID.
   * @param {string} presetId - Unique identifier of the preset.
   * @returns {void}
   */
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

    toast.success(
      `${ASSET_FILTER_DROPDOWN_MESSAGES.APPLIED_PRESET_PREFIX}${preset.name}${ASSET_FILTER_DROPDOWN_MESSAGES.APPLIED_PRESET_SUFFIX}`,
    );
  };

  /**
   * @ description: Deletes a saved filter preset by ID.
   * @param {string} presetId - Unique identifier of the preset to delete.
   * @param {string} name - Display name of the preset.
   * @returns {void}
   */
  const handleDeleteSavedPreset = (presetId: string, name: string) => {
    deletePreset(presetId);
    toast.success(
      `${ASSET_FILTER_DROPDOWN_MESSAGES.DELETED_PRESET_PREFIX}${name}${ASSET_FILTER_DROPDOWN_MESSAGES.DELETED_PRESET_SUFFIX}`,
    );
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
            ? 'bg-blue-50/80 dark:bg-blue-950/60 border-primary text-primary dark:text-blue-400 font-semibold'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
        )}
        title={
          isAllocations
            ? ASSET_FILTER_DROPDOWN_TOOLTIPS.ALLOCATIONS_TRIGGER
            : ASSET_FILTER_DROPDOWN_TOOLTIPS.ASSETS_TRIGGER
        }
        aria-label={
          isAllocations
            ? ASSET_FILTER_DROPDOWN_TOOLTIPS.ALLOCATIONS_ARIA
            : ASSET_FILTER_DROPDOWN_TOOLTIPS.ASSETS_ARIA
        }
      >
        <Filter className="size-3.5" />
        <span>
          {translateAssets('filters.filterButton', {
            defaultValue: ASSET_FILTER_DROPDOWN_TITLES.FILTER_BUTTON,
          })}
        </span>
        {totalActiveFiltersCount > 0 && (
          <span className="size-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
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
                {translateAssets('filters.filtersHeading', {
                  defaultValue: ASSET_FILTER_DROPDOWN_TITLES.FILTERS_HEADING,
                })}
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                {totalActiveFiltersCount}{' '}
                {translateAssets('filters.selectedSuffix', {
                  defaultValue: ASSET_FILTER_DROPDOWN_TITLES.SELECTED_SUFFIX,
                })}
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
                  className="text-xs font-semibold text-primary hover:text-primary dark:text-blue-400 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>
                    {translateAssets('filters.savePreset', {
                      defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.SAVE_PRESET,
                    })}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={ASSET_FILTER_DROPDOWN_BUTTONS.CLOSE_TITLE}
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
                    ? 'bg-blue-50/90 dark:bg-blue-950/60 text-primary dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                )}
              >
                <div className="flex items-center gap-2">
                  <Tag className="size-3.5 shrink-0" />
                  <span>
                    {translateAssets('filters.category', {
                      defaultValue: ASSET_FILTER_DROPDOWN_TITLES.CATEGORY_TAB,
                    })}
                  </span>
                </div>
                {selectedCategories.length > 0 && (
                  <span className="size-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
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
                      ? 'bg-blue-50/90 dark:bg-blue-950/60 text-primary dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="size-3.5 shrink-0" />
                    <span>
                      {translateAssets('filters.status', {
                        defaultValue: ASSET_FILTER_DROPDOWN_TITLES.STATUS_TAB,
                      })}
                    </span>
                  </div>
                  {selectedStatuses.length > 0 && (
                    <span className="size-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
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
                    ? 'bg-blue-50/90 dark:bg-blue-950/60 text-primary dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                )}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="size-3.5 shrink-0" />
                  <span>
                    {translateAssets('filters.department', {
                      defaultValue: ASSET_FILTER_DROPDOWN_TITLES.DEPARTMENT_TAB,
                    })}
                  </span>
                </div>
                {selectedDepartments.length > 0 && (
                  <span className="size-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
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
                      ? 'bg-blue-50/90 dark:bg-blue-950/60 text-primary dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 shrink-0" />
                    <span>
                      {translateAssets('filters.location', {
                        defaultValue: ASSET_FILTER_DROPDOWN_TITLES.LOCATION_TAB,
                      })}
                    </span>
                  </div>
                  {selectedLocations.length > 0 && (
                    <span className="size-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
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
                    ? 'bg-blue-50/90 dark:bg-blue-950/60 text-primary dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="size-3.5 flex items-center justify-center font-bold font-mono text-[11px] shrink-0 text-slate-600 dark:text-slate-400">
                    {symbol}
                  </span>
                  <span>
                    {translateAssets('filters.costRange', {
                      defaultValue: ASSET_FILTER_DROPDOWN_TITLES.COST_RANGE_TAB,
                    })}
                  </span>
                </div>
                {(costRange.min !== null || costRange.max !== null) && (
                  <span className="size-2 rounded-full bg-primary shrink-0" />
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
                        ? 'bg-blue-50/90 dark:bg-blue-950/60 text-primary dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-900/50 shadow-2xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Bookmark className="size-3.5 shrink-0" />
                      <span>
                        {translateAssets('filters.savedPresets', {
                          defaultValue: ASSET_FILTER_DROPDOWN_TITLES.SAVED_PRESETS_TAB,
                        })}
                      </span>
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
                      {translateAssets('filters.assetCategoriesSection', {
                        defaultValue: ASSET_FILTER_DROPDOWN_TITLES.ASSET_CATEGORIES_SECTION,
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllCategories}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {translateAssets('filters.selectAll', {
                          defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.SELECT_ALL,
                        })}
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={handleClearCategories}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                      >
                        {translateAssets('filters.clear', {
                          defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.CLEAR,
                        })}
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
                              ? 'bg-blue-50/70 border-blue-200/80 text-primary font-semibold dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                                isChecked
                                  ? 'bg-primary border-primary text-white'
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
                            <span className="truncate">
                              {translateAssets(`categories.${category}`, {
                                defaultValue: category,
                              })}
                            </span>
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
                      {translateAssets('filters.assetStatusSection', {
                        defaultValue: ASSET_FILTER_DROPDOWN_TITLES.ASSET_STATUS_SECTION,
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAssetSelectedStatuses([...ASSET_STATUSES]);
                          setAssetStorePage(1);
                        }}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {translateAssets('filters.selectAll', {
                          defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.SELECT_ALL,
                        })}
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
                        {translateAssets('filters.clear', {
                          defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.CLEAR,
                        })}
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
                              ? 'bg-blue-50/70 border-blue-200/80 text-primary font-semibold dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                                isChecked
                                  ? 'bg-primary border-primary text-white'
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
                            <span className="truncate">
                              {translateAssets(`statuses.${status}`, {
                                defaultValue: status,
                              })}
                            </span>
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
                      {translateAssets('filters.departmentSection', {
                        defaultValue: ASSET_FILTER_DROPDOWN_TITLES.DEPARTMENT_SECTION,
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllDepartments}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {translateAssets('filters.selectAll', {
                          defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.SELECT_ALL,
                        })}
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={handleClearDepartments}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                      >
                        {translateAssets('filters.clear', {
                          defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.CLEAR,
                        })}
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
                              ? 'bg-blue-50/70 border-blue-200/80 text-primary font-semibold dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                                isChecked
                                  ? 'bg-primary border-primary text-white'
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
                            <span className="truncate">
                              {translateEmployees(`departments.${dept}`, {
                                defaultValue: dept,
                              })}
                            </span>
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
                      {translateAssets('filters.assetLocationSection', {
                        defaultValue: ASSET_FILTER_DROPDOWN_TITLES.ASSET_LOCATION_SECTION,
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllLocations}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {translateAssets('filters.selectAll', {
                          defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.SELECT_ALL,
                        })}
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={handleClearLocations}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                      >
                        {translateAssets('filters.clear', {
                          defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.CLEAR,
                        })}
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
                              ? 'bg-blue-50/70 border-blue-200/80 text-primary font-semibold dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'size-4 rounded flex items-center justify-center shrink-0 border transition-all',
                                isChecked
                                  ? 'bg-primary border-primary text-white'
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
                            <span className="truncate">
                              {translateAssets(`locations.${loc}`, {
                                defaultValue: loc,
                              })}
                            </span>
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
                      {translateAssets('filters.purchaseCostSection', {
                        defaultValue: `Purchase Cost Range (${symbol})`,
                      })}
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
                        {translateAssets('filters.resetCost', {
                          defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.RESET_COST,
                        })}
                      </button>
                    )}
                  </div>

                  {/* Min - Max Input Boxes */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {translateAssets('filters.minCost', {
                          defaultValue: `Min (${symbol})`,
                        })}
                      </span>
                      <div className="relative">
                        <span className="size-3 text-[11px] font-bold font-mono absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center select-none">
                          {symbol}
                        </span>
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
                          placeholder={ASSET_FILTER_DROPDOWN_PLACEHOLDERS.MIN_COST}
                          className="h-8.5 pl-7 pr-2 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 rounded-lg focus-visible:ring-1 focus-visible:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {translateAssets('filters.maxCost', {
                          defaultValue: `Max (${symbol})`,
                        })}
                      </span>
                      <div className="relative">
                        <span className="size-3 text-[11px] font-bold font-mono absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center select-none">
                          {symbol}
                        </span>
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
                          placeholder={ASSET_FILTER_DROPDOWN_PLACEHOLDERS.MAX_COST}
                          className="h-8.5 pl-7 pr-2 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 rounded-lg focus-visible:ring-1 focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Preset Range Pills */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                      {translateAssets('filters.quickPresetRange', {
                        defaultValue: ASSET_FILTER_DROPDOWN_TITLES.QUICK_PRESET_RANGE,
                      })}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {dynamicPresets.map((preset) => {
                        const isSelected = isPresetActive(preset);
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handlePresetClick(preset)}
                            className={cn(
                              'px-2.5 py-1.5 text-xs rounded-lg font-medium border text-center transition-all cursor-pointer truncate',
                              isSelected
                                ? 'bg-primary border-primary text-white shadow-2xs'
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
                      {translateAssets('filters.savedPresetsSection', {
                        defaultValue: ASSET_FILTER_DROPDOWN_TITLES.SAVED_PRESETS_SECTION,
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPresetName('');
                        setIsSavePresetOpen(true);
                      }}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3" />
                      <span>
                        {translateAssets('filters.saveCurrent', {
                          defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.SAVE_CURRENT,
                        })}
                      </span>
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
                              className="h-7 px-2.5 text-[11px] bg-primary hover:bg-primary text-white font-medium rounded-lg"
                            >
                              {translateAssets('filters.applyPreset', {
                                defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.APPLY,
                              })}
                            </Button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSavedPreset(preset.id, preset.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title={translateAssets('filters.deletePresetTitle', {
                                defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.DELETE_PRESET_TITLE,
                              })}
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
                        {translateAssets('filters.noSavedPresetsTitle', {
                          defaultValue: ASSET_FILTER_DROPDOWN_TITLES.NO_SAVED_PRESETS_TITLE,
                        })}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {translateAssets('filters.noSavedPresetsDesc', {
                          defaultValue: ASSET_FILTER_DROPDOWN_TITLES.NO_SAVED_PRESETS_DESC,
                        })}
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
              aria-label={ASSET_FILTER_DROPDOWN_BUTTONS.RESET_ALL_FILTERS}
              className="text-xs font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="size-3" />
              <span>
                {translateAssets('filters.resetFilters', {
                  defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.RESET,
                })}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="h-8.5 px-3.5 text-xs font-medium rounded-lg cursor-pointer"
              >
                {translateAssets('addModal.cancelButton', {
                  defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.CANCEL,
                })}
              </Button>
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8.5 px-4 bg-primary hover:bg-primary text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                {translateAssets('filters.applyFilters', {
                  defaultValue: ASSET_FILTER_DROPDOWN_BUTTONS.APPLY,
                })}
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
