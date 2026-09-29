import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAssetStore } from '@/store/useAssetStore';
import { AssetStatusBadge } from '@/components/assets/AssetStatusBadge';
import { AssetDeviceIcon } from '@/components/assets/AssetDeviceIcon';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import AddAssetModal from '@/components/assets/AddAssetModal';
import AllocateAssetModal from '@/components/assets/AllocateAssetModal';
import AssetQrModal from '@/components/assets/AssetQrModal';
import {
  ArrowLeft,
  Edit2,
  QrCode,
  ShieldCheck,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
  PackageSearch,
  Laptop,
  History,
  Calendar,
  MapPin,
  Tag,
  Hash,
  Layers,
  Building2,
  Mail,
  BadgeDollarSign,
  FileText,
  Cpu,
  Sliders,
  CheckCircle2,
  CornerDownLeft,
  UserCog,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

type DetailTab = 'details' | 'history';

export const AssetDetailPage: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DetailTab>('details');

  const isLoading = useAssetStore((s) => s.isLoading);
  const getAssetById = useAssetStore((s) => s.getAssetById);
  const getAssetAllocationHistory = useAssetStore((s) => s.getAssetAllocationHistory);
  const openEditModal = useAssetStore((s) => s.openEditModal);
  const openAllocateModal = useAssetStore((s) => s.openAllocateModal);
  const openQrModal = useAssetStore((s) => s.openQrModal);
  const deallocateAsset = useAssetStore((s) => s.deallocateAsset);

  const asset = getAssetById(assetId ?? '');
  const allocationHistory = asset ? getAssetAllocationHistory(asset) : [];

  if (isLoading) {
    return (
      <div className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
        <LoadingState
          icon={Laptop}
          title="Loading Asset Details..."
          description="Fetching the latest asset profile and history."
        />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
          <EmptyState
            icon={PackageSearch}
            title="Asset Not Found"
            description={`We couldn't locate an asset with identifier "${assetId}". It may have been retired or removed.`}
            actionLabel="Back to Assets List"
            onAction={() => {
              void navigate('/assets');
            }}
          />
        </div>
      </div>
    );
  }

  const handleDeallocate = () => {
    const success = deallocateAsset(asset.id);
    if (success) {
      toast.success(`${asset.name} has been returned to inventory`);
    } else {
      toast.error('Failed to deallocate asset');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full text-left">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link
          to="/assets"
          className="inline-flex items-center gap-1.5 hover:text-[#155DFC] dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Assets</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1">
          <Tag className="size-3 text-slate-400" />
          {asset.assetId}
        </span>
      </div>

      {/* 2. Top Header with Icon Badge, Title, Subtitle, and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#155DFC]/10 dark:bg-[#155DFC]/20 text-[#155DFC] shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <Laptop className="size-6 sm:size-7" />
          </div>
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Asset Details
              </h1>
              <AssetStatusBadge status={asset.status} />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Detailed hardware specifications, current allocation, and historical activity for{' '}
              {asset.name} ({asset.assetId}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => openQrModal(asset)}
            className="h-9 text-xs sm:text-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <QrCode className="size-4 text-[#155DFC]" />
            <span>QR Code</span>
          </Button>

          <Button
            type="button"
            onClick={() => openEditModal(asset)}
            className="h-9 text-xs sm:text-sm bg-[#155DFC] hover:bg-[#1243b2] text-white font-medium flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Edit2 className="size-4" />
            <span>Edit Asset</span>
          </Button>
        </div>
      </div>

      {/* 2. Hero Overview Card with Rich Lucide Icons */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Device Icon / Showcase */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-slate-800/30 border border-slate-200/70 dark:border-slate-700/60 shrink-0 flex items-center justify-center">
            <AssetDeviceIcon category={asset.category} name={asset.name} className="size-16" />
          </div>

          {/* Info & Metadata */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>{asset.name}</span>
                  {asset.model && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {asset.model}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Layers className="size-3 text-slate-400" />
                  <span>{asset.category}</span>
                  <span>•</span>
                  <Calendar className="size-3 text-slate-400" />
                  <span>Added {new Date(asset.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>

            {/* 6-Column Quick Metadata Grid with Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Tag className="size-3 text-slate-400" />
                  <span>Asset ID</span>
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {asset.assetId}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Hash className="size-3 text-slate-400" />
                  <span>Serial Number</span>
                </span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 block truncate">
                  {asset.serialNumber}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="size-3 text-slate-400" />
                  <span>Location</span>
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                  {asset.location}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="size-3 text-slate-400" />
                  <span>Purchase Date</span>
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                  {asset.purchaseDate}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <BadgeDollarSign className="size-3 text-slate-400" />
                  <span>Purchase Cost</span>
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                  {asset.purchaseCost !== undefined
                    ? `$${asset.purchaseCost.toLocaleString()}`
                    : 'N/A'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  <span>Warranty</span>
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 block truncate">
                  {asset.warrantyExpiry || 'Valid (3 Years)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tabbed Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'details'
              ? 'border-[#155DFC] text-[#155DFC] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="size-3.5" />
          <span>Details</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'border-[#155DFC] text-[#155DFC] dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="size-3.5" />
          <span>Allocation History</span>
          {allocationHistory.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 dark:bg-blue-950/80 text-[#155DFC] font-bold">
              {allocationHistory.length}
            </span>
          )}
        </button>
      </div>

      {/* 4. Tab Contents */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1: Current Allocation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="size-4 text-[#155DFC]" />
                <span>Current Allocation</span>
              </h3>
              {asset.assignedTo ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeallocate}
                  className="h-7 text-xs text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1 cursor-pointer"
                >
                  <UserMinus className="size-3" />
                  <span>Deallocate</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openAllocateModal(asset)}
                  className="h-7 text-xs text-[#155DFC] border-[#155DFC]/30 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="size-3" />
                  <span>Allocate Asset</span>
                </Button>
              )}
            </div>

            {asset.assignedTo ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-4">
                <div className="size-11 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#155DFC] font-bold flex items-center justify-center text-sm ring-2 ring-blue-500/20 shrink-0">
                  {asset.assignedTo.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {asset.assignedTo.name}
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <Building2 className="size-3 text-slate-400" />
                      <span>{asset.assignedTo.department || 'IT Department'}</span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="size-3 text-slate-400" />
                      <span>{asset.assignedTo.email || 'employee@assetops.com'}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                    <Calendar className="size-3" />
                    <span>Allocated on {asset.assignedTo.assignedDate || asset.purchaseDate}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50/80 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                <UserX className="size-7 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  This asset is currently in inventory and not allocated to any team member.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => openAllocateModal(asset)}
                  className="h-8 text-xs bg-[#155DFC] hover:bg-[#1243b2] text-white flex items-center gap-1 mx-auto cursor-pointer"
                >
                  <UserPlus className="size-3.5" />
                  <span>Allocate Asset</span>
                </Button>
              </div>
            )}
          </div>

          {/* Card 2: Asset Specifications & Notes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="size-4 text-[#155DFC]" />
                <span>Asset Specifications</span>
              </h3>
              <button
                type="button"
                onClick={() => openEditModal(asset)}
                className="text-[11px] text-[#155DFC] hover:underline font-medium cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="size-3" />
                <span>Edit Specs</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 text-[10.5px] flex items-center gap-1">
                  <Layers className="size-3 text-slate-400" />
                  <span>Category</span>
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {asset.category}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 text-[10.5px] flex items-center gap-1">
                  <MapPin className="size-3 text-slate-400" />
                  <span>Location</span>
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {asset.location}
                </p>
              </div>

              {asset.specifications &&
                Object.entries(asset.specifications).map(([k, v]) => (
                  <div
                    key={k}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                  >
                    <span className="text-slate-400 text-[10.5px] flex items-center gap-1">
                      <Cpu className="size-3 text-slate-400" />
                      <span>{k}</span>
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                      {v}
                    </p>
                  </div>
                ))}
            </div>

            {asset.notes && (
              <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <FileText className="size-3 text-slate-400" />
                  <span>Notes & Remarks:</span>
                </span>
                <p>{asset.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Complete Allocation & Deallocation History */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <History className="size-4.5 text-[#155DFC]" />
                <span>Complete Allocation & Deallocation History</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Full chronological lifecycle of assignments and returns for {asset.name} (
                {asset.assetId})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Total Events:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {allocationHistory.length}
                </strong>
              </span>
            </div>
          </div>

          {/* Chronological Flow List */}
          {allocationHistory.length > 0 ? (
            <div className="space-y-3">
              {allocationHistory.map((record, index) => {
                const isAllocated = record.action === 'Allocated';
                return (
                  <div
                    key={record.id || `${record.assetId}_${index}`}
                    className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isAllocated
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-900/40'
                        : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-900/40'
                    }`}
                  >
                    {/* Left: Progression representation (Asset → Employee → Action) */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isAllocated
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                        }`}
                      >
                        {isAllocated ? (
                          <UserPlus className="size-5" />
                        ) : (
                          <CornerDownLeft className="size-5" />
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        {/* Flow breadcrumb */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 flex-wrap">
                          <span className="font-mono text-slate-600 dark:text-slate-400">
                            {record.assetId || asset.assetId}
                          </span>
                          <ArrowRight className="size-3 text-slate-400 shrink-0" />
                          <span className="text-slate-900 dark:text-white font-bold">
                            {record.employeeName}
                          </span>
                          <ArrowRight className="size-3 text-slate-400 shrink-0" />
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold inline-flex items-center gap-1 ${
                              isAllocated
                                ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200'
                                : 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200'
                            }`}
                          >
                            {isAllocated ? (
                              <CheckCircle2 className="size-3" />
                            ) : (
                              <CornerDownLeft className="size-3" />
                            )}
                            {record.action}
                          </span>
                        </div>

                        {/* Sub metadata: Department, Email, Notes */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          {record.department && (
                            <span className="flex items-center gap-1">
                              <Building2 className="size-3 text-slate-400" />
                              <span>{record.department}</span>
                            </span>
                          )}
                          {record.employeeEmail && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Mail className="size-3 text-slate-400" />
                                <span>{record.employeeEmail}</span>
                              </span>
                            </>
                          )}
                          {record.notes && (
                            <>
                              <span>•</span>
                              <span className="italic text-slate-600 dark:text-slate-300">
                                "{record.notes}"
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Date, Timestamp & Performed By */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 text-xs text-slate-500 dark:text-slate-400 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/50 dark:border-slate-800">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Calendar className="size-3.5 text-[#155DFC]" />
                        <span>{record.date}</span>
                      </span>
                      {record.performedBy && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <UserCog className="size-3" />
                          <span>Logged by {record.performedBy}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-slate-50/80 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
              <Clock className="size-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No allocation or deallocation history recorded yet.
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Future assignment events will automatically appear in this chronological audit log.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Global Modals Mounted */}
      <AddAssetModal />
      <AllocateAssetModal />
      <AssetQrModal />
    </div>
  );
};

export default AssetDetailPage;
