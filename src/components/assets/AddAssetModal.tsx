import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAssetStore } from '@/store/useAssetStore';
import {
  ASSET_CATEGORIES,
  ASSET_STATUSES,
  ASSET_LOCATIONS,
} from '@/constans/asset.constants';
import { assetSchema, type AssetFormData } from '@/schemas/asset.schema';
import type { AssetCategory, AssetStatus } from '@/types/asset';
import {
  Briefcase,
  Hash,
  Box,
  Cpu,
  Barcode,
  Tag,
  Activity,
  MapPin,
  Calendar,
  FileText,
  Plus,
  Trash2,
  Sliders,
} from 'lucide-react';

interface SpecRow {
  key: string;
  value: string;
}

export const AddAssetModal: React.FC = () => {
  const {
    isAddModalOpen,
    isEditModalOpen,
    selectedAsset,
    closeModals,
    addAsset,
    updateAsset,
    assets,
  } = useAssetStore();

  const isOpen = isAddModalOpen || isEditModalOpen;
  const isEditing = isEditModalOpen && selectedAsset !== null;

  const nextAssetId = `A${1000 + assets.length + 1}`;

  // Dynamic Technical Specifications rows
  const [specRows, setSpecRows] = useState<SpecRow[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      assetId: nextAssetId,
      name: '',
      model: '',
      category: 'Laptop',
      status: 'Available',
      location: 'Headquarters',
      serialNumber: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseCost: 999,
      notes: '',
    },
  });

  const selectedCategory = watch('category');

  useEffect(() => {
    if (isEditing && selectedAsset) {
      setValue('assetId', selectedAsset.assetId);
      setValue('name', selectedAsset.name);
      setValue('model', selectedAsset.model || '');
      setValue('category', selectedAsset.category);
      setValue('status', selectedAsset.status);
      setValue('location', selectedAsset.location);
      setValue('serialNumber', selectedAsset.serialNumber);
      setValue('purchaseDate', selectedAsset.purchaseDate);
      setValue('purchaseCost', selectedAsset.purchaseCost || 0);
      setValue('notes', selectedAsset.notes || '');

      // Load existing specs into rows
      if (selectedAsset.specifications) {
        const rows = Object.entries(selectedAsset.specifications).map(([key, value]) => ({
          key,
          value,
        }));
        setSpecRows(rows);
      } else {
        setSpecRows([]);
      }
    } else if (isAddModalOpen) {
      reset({
        assetId: nextAssetId,
        name: '',
        model: '',
        category: 'Laptop',
        status: 'Available',
        location: 'Headquarters',
        serialNumber: `SN-0${Math.floor(10000 + Math.random() * 90000)}`,
        purchaseDate: new Date().toISOString().split('T')[0],
        purchaseCost: 999,
        notes: '',
      });
      setSpecRows([]);
    }
  }, [isEditing, selectedAsset, isAddModalOpen, nextAssetId, setValue, reset]);

  const handleAddSpecRow = (defaultKey = '', defaultValue = '') => {
    setSpecRows((prev) => [...prev, { key: defaultKey, value: defaultValue }]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', text: string) => {
    setSpecRows((prev) => {
      const updated = [...prev];
      updated[index][field] = text;
      return updated;
    });
  };

  const onSubmit = (data: AssetFormData) => {
    // Build clean specifications record from rows
    const specsRecord: Record<string, string> = {};
    specRows.forEach((row) => {
      const trimmedKey = row.key.trim();
      const trimmedVal = row.value.trim();
      if (trimmedKey && trimmedVal) {
        specsRecord[trimmedKey] = trimmedVal;
      }
    });

    const payload = {
      ...data,
      category: data.category as AssetCategory,
      status: data.status as AssetStatus,
      specifications: Object.keys(specsRecord).length > 0 ? specsRecord : undefined,
    };

    if (isEditing && selectedAsset) {
      updateAsset(selectedAsset.id, payload);
    } else {
      addAsset(payload);
    }
    closeModals();
  };

  const categoryOptions = ASSET_CATEGORIES.map((c) => ({ label: c, value: c }));
  const statusOptions = ASSET_STATUSES.map((s) => ({ label: s, value: s }));
  const locationOptions = ASSET_LOCATIONS.map((l) => ({ label: l, value: l }));

  return (
    <Dialog open={isOpen} onOpenChange={closeModals}>
      <DialogContent onClose={closeModals} className="max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Header matching Photo */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4C40F7] border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <Briefcase className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Asset' : 'Add New Asset'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEditing
                  ? `Update specifications and details for ${selectedAsset?.assetId}`
                  : 'Fill in the information below to register a new organization asset.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            {/* Asset ID */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Hash className="size-3.5 text-slate-400" />
                <span>Asset ID</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('assetId')}
                placeholder="A1010"
                className={`h-9 text-xs sm:text-sm rounded-md ${errors.assetId ? 'border-red-400 focus-visible:ring-red-400/20' : ''
                  }`}
              />
              {errors.assetId && (
                <p className="text-[11px] text-red-500 font-medium">{errors.assetId.message}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Box className="size-3.5 text-slate-400" />
                <span>Asset Name</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('name')}
                placeholder="e.g. Dell Laptop"
                className={`h-9 text-xs sm:text-sm rounded-md ${errors.name ? 'border-red-400 focus-visible:ring-red-400/20' : ''
                  }`}
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Model / Subtitle */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Cpu className="size-3.5 text-slate-400" />
                <span>Model / Specification</span>
              </label>
              <Input
                {...register('model')}
                placeholder="e.g. Latitude 5440, 27-inch"
                className="h-9 text-xs sm:text-sm rounded-md"
              />
            </div>

            {/* Serial Number */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Barcode className="size-3.5 text-slate-400" />
                <span>Serial Number</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('serialNumber')}
                placeholder="SN-078000"
                className={`h-9 text-xs sm:text-sm font-mono rounded-md ${errors.serialNumber ? 'border-red-400 focus-visible:ring-red-400/20' : ''
                  }`}
              />
              {errors.serialNumber && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.serialNumber.message}
                </p>
              )}
            </div>

            {/* Category - Shadcn Custom Select */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag className="size-3.5 text-slate-400" />
                <span>Category</span>
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={categoryOptions}
                    placeholder="Select asset category"
                  />
                )}
              />
            </div>

            {/* Status - Shadcn Custom Select */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="size-3.5 text-slate-400" />
                <span>Status</span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={statusOptions}
                    placeholder="Current asset status"
                  />
                )}
              />
            </div>

            {/* Location - Shadcn Custom Select */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-slate-400" />
                <span>Location</span>
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={locationOptions}
                    placeholder="Asset's current location"
                  />
                )}
              />
            </div>

            {/* Purchase Date */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-slate-400" />
                <span>Purchase Date</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register('purchaseDate')}
                className={`h-9 text-xs sm:text-sm rounded-md ${errors.purchaseDate ? 'border-red-400 focus-visible:ring-red-400/20' : ''
                  }`}
              />
              {errors.purchaseDate && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.purchaseDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders className="size-3.5 text-[#4C40F7]" />
                <span>Technical Specifications</span>
              </label>
              <button
                type="button"
                onClick={() => handleAddSpecRow('', '')}
                className="text-[11px] font-semibold text-[#4C40F7] hover:text-[#3B30E6] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="size-3" />
                <span>Add Spec Field</span>
              </button>
            </div>

            {/* Dynamic Key-Value list */}
            {specRows.length > 0 ? (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {specRows.map((row, index) => (
                  <div key={`spec-row-${index}`} className="flex items-center gap-2">
                    <Input
                      placeholder="Property (e.g. Processor, RAM)"
                      value={row.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      className="h-8.5 text-xs flex-1 rounded-md bg-white dark:bg-slate-900 font-medium"
                    />
                    <Input
                      placeholder="Value (e.g. 16GB DDR5, M3 Pro)"
                      value={row.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="h-8.5 text-xs flex-1 rounded-md bg-white dark:bg-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecRow(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer"
                      title="Remove field"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between py-2 px-2.5 text-xs text-slate-400 bg-white/60 dark:bg-slate-900/60 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-[11.5px] italic">No technical specifications added yet.</span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedCategory === 'Laptop' || selectedCategory === 'Desktop') {
                      setSpecRows([
                        { key: 'Processor', value: '' },
                        { key: 'RAM', value: '' },
                        { key: 'Storage', value: '' },
                      ]);
                    } else if (selectedCategory === 'Monitor') {
                      setSpecRows([
                        { key: 'Resolution', value: '' },
                        { key: 'Refresh Rate', value: '' },
                        { key: 'Panel', value: '' },
                      ]);
                    } else {
                      handleAddSpecRow('Property', '');
                    }
                  }}
                  className="text-[11px] text-[#4C40F7] hover:underline font-medium cursor-pointer"
                >
                  Load Presets
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="size-3.5 text-slate-400" />
              <span>Notes / Remarks</span>
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Additional inventory details or maintenance notes..."
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20"
            />
            <p className="text-[11px] text-slate-400 leading-tight">
              Any additional information that might be useful
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeModals}
              className="h-9 text-xs rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs font-medium px-5 rounded-md shadow-xs"
            >
              {isEditing ? 'Save Changes' : 'Create Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetModal;