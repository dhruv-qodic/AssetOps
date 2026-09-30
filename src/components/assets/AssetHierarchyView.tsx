import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Layers,
  Hash,
  BadgeDollarSign,
  QrCode,
  Edit2,
  ExternalLink,
  Maximize2,
  Minimize2,
  Package,
  PackageSearch,
  Search,
} from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { AssetStatusBadge } from './AssetStatusBadge';
import { AssetDeviceIcon } from './AssetDeviceIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import type { Asset } from '@/types/asset';

interface AssetHierarchyViewProps {
  assets: Asset[];
  isLoading?: boolean;
  isPending?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onAddAsset?: () => void;
}

interface TreeEmployeeNode {
  key: string;
  name: string;
  email?: string;
  avatar?: string;
  department: string;
  isUnassigned: boolean;
  assets: Asset[];
  totalValue: number;
}

interface TreeDepartmentNode {
  key: string;
  name: string;
  employees: TreeEmployeeNode[];
  totalAssets: number;
  totalValue: number;
}

interface TreeLocationNode {
  key: string;
  name: string;
  departments: TreeDepartmentNode[];
  totalAssets: number;
  totalValue: number;
  totalEmployees: number;
}

export const AssetHierarchyView: React.FC<AssetHierarchyViewProps> = ({
  assets,
  isLoading = false,
  error = null,
  onRetry,
  onClearFilters,
  onAddAsset,
}) => {
  const navigate = useNavigate();
  const openQrModal = useAssetStore((s) => s.openQrModal);
  const openEditModal = useAssetStore((s) => s.openEditModal);

  // Search filter query within tree
  const [localSearch, setLocalSearch] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // 1. Build hierarchical tree structure from assets
  const { treeData, allNodeKeys, stats } = useMemo(() => {
    const locationMap = new Map<string, Map<string, Map<string, TreeEmployeeNode>>>();
    const allKeys: string[] = [];

    const query = localSearch.trim().toLowerCase();
    const filteredAssets = query
      ? assets.filter(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            a.assetId.toLowerCase().includes(query) ||
            a.category.toLowerCase().includes(query) ||
            a.location.toLowerCase().includes(query) ||
            a.serialNumber.toLowerCase().includes(query) ||
            a.assignedTo?.name.toLowerCase().includes(query) ||
            a.assignedTo?.department?.toLowerCase().includes(query),
        )
      : assets;

    for (const asset of filteredAssets) {
      const loc = asset.location || 'Headquarters';
      const isAssigned = !!asset.assignedTo;
      const dept =
        asset.assignedTo?.department || (isAssigned ? 'General' : 'Unassigned Inventory');
      const empName =
        asset.assignedTo?.name ||
        (asset.status === 'Maintenance' ? 'Under Maintenance' : 'Available Stock');
      const empKey = `emp_${loc}_${dept}_${empName}`;

      if (!locationMap.has(loc)) {
        locationMap.set(loc, new Map());
      }
      const deptMap = locationMap.get(loc);

      if (!deptMap) {
        return {
          treeData: [],
          allNodeKeys: [],
          stats: {
            locationsCount: 0,
            departmentsCount: 0,
            employeesCount: 0,
            assetsCount: 0,
          },
        };
      }

      if (!deptMap.has(dept)) {
        deptMap.set(dept, new Map());
      }
      const empMap = deptMap.get(dept);

      if (!empMap) {
        return {
          treeData: [],
          allNodeKeys: [],
          stats: {
            locationsCount: 0,
            departmentsCount: 0,
            employeesCount: 0,
            assetsCount: 0,
          },
        };
      }

      if (!empMap.has(empName)) {
        empMap.set(empName, {
          key: empKey,
          name: empName,
          email: asset.assignedTo?.email,
          avatar: asset.assignedTo?.avatar,
          department: dept,
          isUnassigned: !isAssigned,
          assets: [],
          totalValue: 0,
        });
      }

      const empNode = empMap.get(empName);

      if (empNode) {
        empNode.assets.push(asset);
        empNode.totalValue += asset.purchaseCost || 0;
      }
    }

    const locations: TreeLocationNode[] = [];
    let grandTotalDepartments = 0;
    let grandTotalEmployees = 0;

    for (const [locName, deptMap] of locationMap.entries()) {
      const locKey = `loc_${locName}`;
      allKeys.push(locKey);

      const departments: TreeDepartmentNode[] = [];
      let locTotalAssets = 0;
      let locTotalValue = 0;
      let locTotalEmployees = 0;

      for (const [deptName, empMap] of deptMap.entries()) {
        const deptKey = `dept_${locName}_${deptName}`;
        allKeys.push(deptKey);
        grandTotalDepartments++;

        const employees: TreeEmployeeNode[] = [];
        let deptTotalAssets = 0;
        let deptTotalValue = 0;

        for (const empNode of empMap.values()) {
          allKeys.push(empNode.key);
          if (!empNode.isUnassigned) {
            locTotalEmployees++;
            grandTotalEmployees++;
          }
          deptTotalAssets += empNode.assets.length;
          deptTotalValue += empNode.totalValue;
          employees.push(empNode);
        }

        // Sort employees alphabetically, keeping unassigned at bottom
        employees.sort((a, b) => {
          if (a.isUnassigned && !b.isUnassigned) return 1;
          if (!a.isUnassigned && b.isUnassigned) return -1;
          return a.name.localeCompare(b.name);
        });

        locTotalAssets += deptTotalAssets;
        locTotalValue += deptTotalValue;

        departments.push({
          key: deptKey,
          name: deptName,
          employees,
          totalAssets: deptTotalAssets,
          totalValue: deptTotalValue,
        });
      }

      // Sort departments alphabetically
      departments.sort((a, b) => a.name.localeCompare(b.name));

      locations.push({
        key: locKey,
        name: locName,
        departments,
        totalAssets: locTotalAssets,
        totalValue: locTotalValue,
        totalEmployees: locTotalEmployees,
      });
    }

    // Sort locations alphabetically
    locations.sort((a, b) => a.name.localeCompare(b.name));

    return {
      treeData: locations,
      allNodeKeys: allKeys,
      stats: {
        locationsCount: locations.length,
        departmentsCount: grandTotalDepartments,
        employeesCount: grandTotalEmployees,
        assetsCount: filteredAssets.length,
      },
    };
  }, [assets, localSearch]);

  const hasInitializedRef = React.useRef(false);

  // Initial expansion of top-level locations, departments, and employee groups
  useEffect(() => {
    if (treeData.length > 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const initialExpanded = new Set<string>();
      for (const loc of treeData) {
        initialExpanded.add(loc.key);
        for (const dept of loc.departments) {
          initialExpanded.add(dept.key);
          for (const emp of dept.employees) {
            initialExpanded.add(emp.key);
          }
        }
      }
      setExpandedNodes(initialExpanded);
    }
  }, [treeData]);

  // Auto-expand all matching branches when searching
  useEffect(() => {
    if (localSearch.trim()) {
      setExpandedNodes(new Set(allNodeKeys));
    }
  }, [localSearch, allNodeKeys]);

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeKey)) {
        next.delete(nodeKey);
      } else {
        next.add(nodeKey);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedNodes(new Set(allNodeKeys));
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleAssetClick = (asset: Asset) => {
    void navigate(`/assets/${asset.assetId}`);
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <LoadingState
        icon={Package}
        title="Loading asset hierarchy..."
        description="Organizing hardware assets by office locations, departments, and employees."
      />
    );
  }

  // 2. Error State
  if (error) {
    return <ErrorState title="Failed to load asset hierarchy" message={error} onRetry={onRetry} />;
  }

  // 3. Empty State
  if (assets.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No assets available for hierarchy view"
        description="No assets match your search or filter criteria. Try clearing filters or create a new asset."
        secondaryActionLabel={onClearFilters ? 'Clear filters' : undefined}
        onSecondaryAction={onClearFilters}
        actionLabel={onAddAsset ? 'Add Asset' : undefined}
        onAction={onAddAsset}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 select-none text-left">
      {/* 1. Tree View Sub-Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-[#155DFC] dark:text-blue-400">
            <FolderTree className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                Asset Hierarchy Tree
              </span>
              <Badge
                variant="outline"
                className="text-[10px] font-medium bg-white dark:bg-slate-800"
              >
                {stats.locationsCount} Offices • {stats.departmentsCount} Departments •{' '}
                {stats.assetsCount} Assets
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Structured parent-child view: Office Location → Department → Assignee → Hardware Asset
            </p>
          </div>
        </div>

        {/* Tree Interactive Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Quick Filter Search inside tree */}
          <div className="relative">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search tree..."
              className="h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155DFC]/30 w-36 sm:w-44 transition-all"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="h-8 px-2.5 text-xs text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1"
            title="Expand All Nodes"
          >
            <Maximize2 className="size-3" />
            <span>Expand All</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="h-8 px-2.5 text-xs text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1"
            title="Collapse All Nodes"
          >
            <Minimize2 className="size-3" />
            <span>Collapse All</span>
          </Button>
        </div>
      </div>

      {/* 2. Hierarchical Tree Nodes Body */}
      <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[750px]">
        {treeData.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <PackageSearch className="size-8 mx-auto text-slate-400" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No matching assets found in tree view
            </p>
            {localSearch && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setLocalSearch('')}
                className="text-xs h-7"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          treeData.map((locationNode) => {
            const isLocExpanded = expandedNodes.has(locationNode.key);

            return (
              <div
                key={locationNode.key}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden transition-all"
              >
                {/* Level 1: Location / Office Node Header */}
                <button
                  type="button"
                  onClick={() => toggleNode(locationNode.key)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-slate-50/90 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  aria-expanded={isLocExpanded}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1 text-slate-400 dark:text-slate-500">
                      {isLocExpanded ? (
                        <ChevronDown className="size-4.5 text-[#155DFC] dark:text-blue-400" />
                      ) : (
                        <ChevronRight className="size-4.5" />
                      )}
                    </div>

                    <div className="p-2 rounded-xl bg-blue-50 text-[#155DFC] dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                      <Building2 className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                          {locationNode.name}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#155DFC] dark:text-blue-300">
                          Office Location
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {locationNode.departments.length} Departments •{' '}
                        {locationNode.totalEmployees} Active Assignees
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {locationNode.totalAssets} Assets
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ${locationNode.totalValue.toLocaleString()} Value
                      </span>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs font-bold">
                      {locationNode.totalAssets}
                    </Badge>
                  </div>
                </button>

                {/* Location Children: Departments */}
                {isLocExpanded && (
                  <div className="p-3 sm:p-5 space-y-3 bg-white dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800">
                    {locationNode.departments.map((deptNode) => {
                      const isDeptExpanded = expandedNodes.has(deptNode.key);

                      return (
                        <div
                          key={deptNode.key}
                          className="rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/30 overflow-hidden ml-2 sm:ml-4"
                        >
                          {/* Level 2: Department Node Header */}
                          <button
                            type="button"
                            onClick={() => toggleNode(deptNode.key)}
                            className="w-full flex items-center justify-between p-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left"
                            aria-expanded={isDeptExpanded}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="p-0.5 text-slate-400">
                                {isDeptExpanded ? (
                                  <ChevronDown className="size-4 text-indigo-600 dark:text-indigo-400" />
                                ) : (
                                  <ChevronRight className="size-4" />
                                )}
                              </div>

                              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60">
                                <Layers className="size-4" />
                              </div>

                              <div>
                                <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                                  {deptNode.name}
                                </span>
                                <span className="text-[11px] text-slate-400 ml-2">
                                  ({deptNode.employees.length}{' '}
                                  {deptNode.employees.length === 1
                                    ? 'member/group'
                                    : 'members/groups'}
                                  )
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                                ${deptNode.totalValue.toLocaleString()}
                              </span>
                              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                {deptNode.totalAssets}{' '}
                                {deptNode.totalAssets === 1 ? 'asset' : 'assets'}
                              </span>
                            </div>
                          </button>

                          {/* Department Children: Employees */}
                          {isDeptExpanded && (
                            <div className="p-3 space-y-2.5 border-t border-slate-200/50 dark:border-slate-800/60 ml-3 sm:ml-5">
                              {deptNode.employees.map((empNode) => {
                                const isEmpExpanded = expandedNodes.has(empNode.key);

                                return (
                                  <div
                                    key={empNode.key}
                                    className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs"
                                  >
                                    {/* Level 3: Employee / Assignee Node Header */}
                                    <button
                                      type="button"
                                      onClick={() => toggleNode(empNode.key)}
                                      className="w-full flex items-center justify-between p-2.5 sm:p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-left"
                                      aria-expanded={isEmpExpanded}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="p-0.5 text-slate-400">
                                          {isEmpExpanded ? (
                                            <ChevronDown className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                          ) : (
                                            <ChevronRight className="size-3.5" />
                                          )}
                                        </div>

                                        {empNode.isUnassigned ? (
                                          <div className="size-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                                            <Package className="size-3.5" />
                                          </div>
                                        ) : empNode.avatar ? (
                                          <img
                                            src={empNode.avatar}
                                            alt={empNode.name}
                                            className="size-7 rounded-full bg-slate-100 object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                          />
                                        ) : (
                                          <div className="size-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                                            {empNode.name.charAt(0)}
                                          </div>
                                        )}

                                        <div className="min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                                              {empNode.name}
                                            </span>
                                            {empNode.isUnassigned ? (
                                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                                                Inventory
                                              </span>
                                            ) : (
                                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-medium">
                                                Assignee
                                              </span>
                                            )}
                                          </div>
                                          {empNode.email && (
                                            <p className="text-[10.5px] text-slate-400 truncate">
                                              {empNode.email}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                          {empNode.assets.length}{' '}
                                          {empNode.assets.length === 1 ? 'asset' : 'assets'}
                                        </span>
                                      </div>
                                    </button>

                                    {/* Level 4: Leaf Nodes (Hardware Assets) */}
                                    {isEmpExpanded && (
                                      <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
                                        {empNode.assets.map((asset) => (
                                          <div
                                            key={asset.id}
                                            className="p-3 pl-8 sm:pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors group"
                                          >
                                            {/* Asset Info & Identity */}
                                            <div
                                              onClick={() => handleAssetClick(asset)}
                                              className="flex items-start sm:items-center gap-3 cursor-pointer min-w-0 flex-1"
                                              role="button"
                                              tabIndex={0}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                  handleAssetClick(asset);
                                                }
                                              }}
                                            >
                                              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs shrink-0 group-hover:border-[#155DFC]/40 transition-colors">
                                                <AssetDeviceIcon
                                                  category={asset.category}
                                                  name={asset.name}
                                                  className="size-7"
                                                />
                                              </div>

                                              <div className="space-y-0.5 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  <span className="font-mono font-bold text-xs text-[#155DFC] dark:text-blue-400">
                                                    {asset.assetId}
                                                  </span>
                                                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 hover:underline">
                                                    {asset.name}
                                                  </span>
                                                  {asset.model && (
                                                    <span className="text-[10px] text-slate-400">
                                                      • {asset.model}
                                                    </span>
                                                  )}
                                                  <AssetStatusBadge status={asset.status} />
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                                                  <span className="flex items-center gap-1">
                                                    <Layers className="size-3 text-slate-400" />
                                                    <span>{asset.category}</span>
                                                  </span>
                                                  <span>•</span>
                                                  <span className="flex items-center gap-1 font-mono">
                                                    <Hash className="size-3 text-slate-400" />
                                                    <span>{asset.serialNumber}</span>
                                                  </span>
                                                  {asset.purchaseCost !== undefined && (
                                                    <>
                                                      <span>•</span>
                                                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                                                        <BadgeDollarSign className="size-3 text-slate-400" />
                                                        <span>
                                                          ${asset.purchaseCost.toLocaleString()}
                                                        </span>
                                                      </span>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openQrModal(asset)}
                                                className="h-7 px-2 text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                                                title="View QR Code"
                                              >
                                                <QrCode className="size-3 text-[#155DFC]" />
                                                <span className="hidden md:inline">QR</span>
                                              </Button>

                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditModal(asset)}
                                                className="h-7 px-2 text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                                                title="Edit Asset"
                                              >
                                                <Edit2 className="size-3" />
                                                <span className="hidden md:inline">Edit</span>
                                              </Button>

                                              <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleAssetClick(asset)}
                                                className="h-7 px-2.5 text-xs bg-[#155DFC] hover:bg-[#1243b2] text-white flex items-center gap-1 cursor-pointer shadow-2xs"
                                                title="Open Asset Detail Page"
                                              >
                                                <span>Details</span>
                                                <ExternalLink className="size-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AssetHierarchyView;
