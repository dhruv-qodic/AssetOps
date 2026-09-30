import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
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

export interface TreeEmployeeNode {
  key: string;
  name: string;
  email?: string;
  avatar?: string;
  department: string;
  isUnassigned: boolean;
  assets: Asset[];
  totalValue: number;
}

export interface TreeDepartmentNode {
  key: string;
  name: string;
  employees: TreeEmployeeNode[];
  totalAssets: number;
  totalValue: number;
}

export interface TreeLocationNode {
  key: string;
  name: string;
  departments: TreeDepartmentNode[];
  totalAssets: number;
  totalValue: number;
  totalEmployees: number;
}

export type FlatTreeNode =
  | {
      type: 'location';
      key: string;
      data: TreeLocationNode;
      isExpanded: boolean;
      depth: 0;
    }
  | {
      type: 'department';
      key: string;
      data: TreeDepartmentNode;
      locationKey: string;
      isExpanded: boolean;
      depth: 1;
    }
  | {
      type: 'employee';
      key: string;
      data: TreeEmployeeNode;
      locationKey: string;
      deptKey: string;
      isExpanded: boolean;
      depth: 2;
    }
  | {
      type: 'asset';
      key: string;
      data: Asset;
      locationKey: string;
      deptKey: string;
      empKey: string;
      depth: 3;
    };

export const AssetHierarchyView: React.FC<AssetHierarchyViewProps> = ({
  assets,
  isLoading = false,
  error = null,
  onRetry,
  onClearFilters,
  onAddAsset,
}) => {
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement>(null);
  const openQrModal = useAssetStore((s) => s.openQrModal);
  const openEditModal = useAssetStore((s) => s.openEditModal);

  // Search filter query within tree
  const [localSearch, setLocalSearch] = useState('');

  // 1. Build hierarchical tree structure from assets
  const { treeData, allNodeKeys, stats, initialExpandedKeys } = useMemo(() => {
    const locationMap = new Map<string, Map<string, Map<string, TreeEmployeeNode>>>();
    const allKeys: string[] = [];
    const defaultExpanded: string[] = [];

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
          initialExpandedKeys: [],
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
          initialExpandedKeys: [],
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
      defaultExpanded.push(locKey);

      const departments: TreeDepartmentNode[] = [];
      let locTotalAssets = 0;
      let locTotalValue = 0;
      let locTotalEmployees = 0;

      for (const [deptName, empMap] of deptMap.entries()) {
        const deptKey = `dept_${locName}_${deptName}`;
        allKeys.push(deptKey);
        defaultExpanded.push(deptKey);
        grandTotalDepartments++;

        const employees: TreeEmployeeNode[] = [];
        let deptTotalAssets = 0;
        let deptTotalValue = 0;

        for (const empNode of empMap.values()) {
          allKeys.push(empNode.key);
          defaultExpanded.push(empNode.key);
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
      initialExpandedKeys: defaultExpanded,
      stats: {
        locationsCount: locations.length,
        departmentsCount: grandTotalDepartments,
        employeesCount: grandTotalEmployees,
        assetsCount: filteredAssets.length,
      },
    };
  }, [assets, localSearch]);

  // Initial expansion state: initialized on mount without triggering an extra delayed render cascade
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    () => new Set(initialExpandedKeys),
  );
  const hasInitializedRef = useRef(false);

  // Sync initial expansion if assets load asynchronously after initial mount
  useEffect(() => {
    if (initialExpandedKeys.length > 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setExpandedNodes(new Set(initialExpandedKeys));
    }
  }, [initialExpandedKeys]);

  // Auto-expand all matching branches when searching
  useEffect(() => {
    if (localSearch.trim()) {
      setExpandedNodes(new Set(allNodeKeys));
    }
  }, [localSearch, allNodeKeys]);

  const toggleNode = useCallback((nodeKey: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeKey)) {
        next.delete(nodeKey);
      } else {
        next.add(nodeKey);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedNodes(new Set(allNodeKeys));
  }, [allNodeKeys]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  const handleAssetClick = useCallback(
    (asset: Asset) => {
      void navigate(`/assets/${asset.assetId}`);
    },
    [navigate],
  );

  // 2. Flatten only the visible/expanded tree nodes for virtualization
  const flatNodes = useMemo<FlatTreeNode[]>(() => {
    const list: FlatTreeNode[] = [];

    for (const loc of treeData) {
      const isLocExpanded = expandedNodes.has(loc.key);
      list.push({
        type: 'location',
        key: loc.key,
        data: loc,
        isExpanded: isLocExpanded,
        depth: 0,
      });

      if (isLocExpanded) {
        for (const dept of loc.departments) {
          const isDeptExpanded = expandedNodes.has(dept.key);
          list.push({
            type: 'department',
            key: dept.key,
            data: dept,
            locationKey: loc.key,
            isExpanded: isDeptExpanded,
            depth: 1,
          });

          if (isDeptExpanded) {
            for (const emp of dept.employees) {
              const isEmpExpanded = expandedNodes.has(emp.key);
              list.push({
                type: 'employee',
                key: emp.key,
                data: emp,
                locationKey: loc.key,
                deptKey: dept.key,
                isExpanded: isEmpExpanded,
                depth: 2,
              });

              if (isEmpExpanded) {
                for (const asset of emp.assets) {
                  list.push({
                    type: 'asset',
                    key: `asset_${asset.id}`,
                    data: asset,
                    locationKey: loc.key,
                    deptKey: dept.key,
                    empKey: emp.key,
                    depth: 3,
                  });
                }
              }
            }
          }
        }
      }
    }

    return list;
  }, [treeData, expandedNodes]);

  // 3. Virtualizer instance to render only visible tree nodes
  const rowVirtualizer = useVirtualizer({
    count: flatNodes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const node = flatNodes[index];
      switch (node.type) {
        case 'location':
          return 76;
        case 'department':
          return 56;
        case 'employee':
          return 58;
        case 'asset':
          return 68;
      }
    },
    getItemKey: (index) => flatNodes[index]?.key ?? index,
    overscan: 10,
    initialRect: { width: 1000, height: 750 },
  });

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

      {/* 2. Hierarchical Virtualized Tree Container */}
      <div
        ref={parentRef}
        className="p-4 sm:p-6 overflow-y-auto max-h-[750px] relative scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
      >
        {flatNodes.length === 0 ? (
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
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const node = flatNodes[virtualRow.index];

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="pb-2.5"
                >
                  {/* Level 0: Location / Office Node */}
                  {node.type === 'location' && (
                    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden transition-all">
                      <button
                        type="button"
                        onClick={() => toggleNode(node.key)}
                        className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-slate-50/90 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                        aria-expanded={node.isExpanded}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-1 text-slate-400 dark:text-slate-500">
                            {node.isExpanded ? (
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
                                {node.data.name}
                              </span>
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#155DFC] dark:text-blue-300">
                                Office Location
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {node.data.departments.length} Departments •{' '}
                              {node.data.totalEmployees} Active Assignees
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                              {node.data.totalAssets} Assets
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              ${node.data.totalValue.toLocaleString()} Value
                            </span>
                          </div>
                          <Badge variant="secondary" className="font-mono text-xs font-bold">
                            {node.data.totalAssets}
                          </Badge>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Level 1: Department Node */}
                  {node.type === 'department' && (
                    <div className="pl-3 sm:pl-6">
                      <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/30 overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => toggleNode(node.key)}
                          className="w-full flex items-center justify-between p-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left"
                          aria-expanded={node.isExpanded}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-0.5 text-slate-400">
                              {node.isExpanded ? (
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
                                {node.data.name}
                              </span>
                              <span className="text-[11px] text-slate-400 ml-2">
                                ({node.data.employees.length}{' '}
                                {node.data.employees.length === 1
                                  ? 'member/group'
                                  : 'members/groups'}
                                )
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                              ${node.data.totalValue.toLocaleString()}
                            </span>
                            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                              {node.data.totalAssets}{' '}
                              {node.data.totalAssets === 1 ? 'asset' : 'assets'}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Level 2: Employee / Assignee Node */}
                  {node.type === 'employee' && (
                    <div className="pl-6 sm:pl-12">
                      <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => toggleNode(node.key)}
                          className="w-full flex items-center justify-between p-2.5 sm:p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-left"
                          aria-expanded={node.isExpanded}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-0.5 text-slate-400">
                              {node.isExpanded ? (
                                <ChevronDown className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <ChevronRight className="size-3.5" />
                              )}
                            </div>

                            {node.data.isUnassigned ? (
                              <div className="size-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                                <Package className="size-3.5" />
                              </div>
                            ) : node.data.avatar ? (
                              <img
                                src={node.data.avatar}
                                alt={node.data.name}
                                className="size-7 rounded-full bg-slate-100 object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                              />
                            ) : (
                              <div className="size-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                                {node.data.name.charAt(0)}
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                                  {node.data.name}
                                </span>
                                {node.data.isUnassigned ? (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                                    Inventory
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-medium">
                                    Assignee
                                  </span>
                                )}
                              </div>
                              {node.data.email && (
                                <p className="text-[10.5px] text-slate-400 truncate">
                                  {node.data.email}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                              {node.data.assets.length}{' '}
                              {node.data.assets.length === 1 ? 'asset' : 'assets'}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Level 3: Leaf Node (Hardware Asset) */}
                  {node.type === 'asset' && (
                    <div className="pl-9 sm:pl-16">
                      <div className="rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900/90 overflow-hidden shadow-2xs">
                        <div className="p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors group">
                          {/* Asset Info & Identity */}
                          <div
                            onClick={() => handleAssetClick(node.data)}
                            className="flex items-start sm:items-center gap-3 cursor-pointer min-w-0 flex-1"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleAssetClick(node.data);
                              }
                            }}
                          >
                            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs shrink-0 group-hover:border-[#155DFC]/40 transition-colors">
                              <AssetDeviceIcon
                                category={node.data.category}
                                name={node.data.name}
                                className="size-7"
                              />
                            </div>

                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-xs text-[#155DFC] dark:text-blue-400">
                                  {node.data.assetId}
                                </span>
                                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 hover:underline">
                                  {node.data.name}
                                </span>
                                {node.data.model && (
                                  <span className="text-[10px] text-slate-400">
                                    • {node.data.model}
                                  </span>
                                )}
                                <AssetStatusBadge status={node.data.status} />
                              </div>

                              <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Layers className="size-3 text-slate-400" />
                                  <span>{node.data.category}</span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-mono">
                                  <Hash className="size-3 text-slate-400" />
                                  <span>{node.data.serialNumber}</span>
                                </span>
                                {node.data.purchaseCost !== undefined && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                                      <BadgeDollarSign className="size-3 text-slate-400" />
                                      <span>${node.data.purchaseCost.toLocaleString()}</span>
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
                              onClick={() => openQrModal(node.data)}
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
                              onClick={() => openEditModal(node.data)}
                              className="h-7 px-2 text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                              title="Edit Asset"
                            >
                              <Edit2 className="size-3" />
                              <span className="hidden md:inline">Edit</span>
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleAssetClick(node.data)}
                              className="h-7 px-2.5 text-xs bg-[#155DFC] hover:bg-[#1243b2] text-white flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Open Asset Detail Page"
                            >
                              <span>Details</span>
                              <ExternalLink className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetHierarchyView;
