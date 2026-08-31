import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { useAssetStore } from '@/store/useAssetStore';
import {
  ASSET_CATEGORIES,
  ASSET_STATUSES,
  ASSET_LOCATIONS,
} from '@/constans/asset.constants';
import type { CreateAssetInput } from '@/types/asset';

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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateAssetInput>({
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
      warrantyExpiry: '',
      notes: '',
    },
  });

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
      setValue('warrantyExpiry', selectedAsset.warrantyExpiry || '');
      setValue('notes', selectedAsset.notes || '');
    } else if (isAddModalOpen) {
      reset({
        assetId: nextAssetId,
        name: '',
        model: '',
        category: 'Laptop',
        status: 'Available',
        location: 'Headquarters',
        serialNumber: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
        purchaseDate: new Date().toISOString().split('T')[0],
        purchaseCost: 999,
        warrantyExpiry: '',
        notes: '',
      });
    }
  }, [isEditing, selectedAsset, isAddModalOpen, nextAssetId, setValue, reset]);

  const onSubmit = (data: CreateAssetInput) => {
    if (isEditing && selectedAsset) {
      updateAsset(selectedAsset.id, data);
    } else {
      addAsset(data);
    }
    closeModals();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModals}>
      <DialogContent onClose={closeModals} className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Asset Details' : 'Add New Asset'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Update specifications and configuration for ${selectedAsset?.assetId}`
              : 'Fill in the information below to register a new organization asset.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Asset ID */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Asset ID <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('assetId', { required: 'Asset ID is required' })}
                placeholder="e.g. A1001"
                className="h-9 text-xs sm:text-sm"
              />
              {errors.assetId && (
                <p className="text-[11px] text-red-500">{errors.assetId.message}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Asset Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('name', { required: 'Asset name is required' })}
                placeholder="e.g. Dell Laptop"
                className="h-9 text-xs sm:text-sm"
              />
              {errors.name && (
                <p className="text-[11px] text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Model / Subtitle */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Model / Specification
              </label>
              <Input
                {...register('model')}
                placeholder="e.g. Latitude 5440, 27-inch"
                className="h-9 text-xs sm:text-sm"
              />
            </div>

            {/* Serial Number */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('serialNumber', {
                  required: 'Serial number is required',
                })}
                placeholder="e.g. DL-5440-98214"
                className="h-9 text-xs sm:text-sm font-mono"
              />
              {errors.serialNumber && (
                <p className="text-[11px] text-red-500">
                  {errors.serialNumber.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20"
              >
                {ASSET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20"
              >
                {ASSET_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Location
              </label>
              <select
                {...register('location')}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20"
              >
                {ASSET_LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Purchase Date */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Purchase Date
              </label>
              <Input
                type="date"
                {...register('purchaseDate')}
                className="h-9 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Notes / Remarks
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Additional inventory details or maintenance notes..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeModals}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs font-medium px-5"
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
