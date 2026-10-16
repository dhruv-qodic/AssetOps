import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
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
import { toast } from 'sonner';
import { useAssetStore } from '@/store/useAssetStore';
import { ASSET_CATEGORIES, ASSET_STATUSES, ASSET_LOCATIONS } from '@/constant/asset.constants';
import {
  ASSET_MODAL_MESSAGES,
  ASSET_MODAL_TITLES,
  ASSET_MODAL_LABELS,
  ASSET_MODAL_PLACEHOLDERS,
  ASSET_MODAL_BUTTONS,
  ASSET_MODAL_STRINGS,
  SPEC_PRESETS,
} from './constants/AddAssetModel.constants';
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

/**
 * @ description: Dialog modal for creating a new hardware asset or editing an existing one.
 * @returns {JSX.Element} Add or edit asset modal dialog JSX.
 */
export const AddAssetModal: React.FC = () => {
  const { t: translateAssets } = useTranslation('asset');
  const isAddModalOpen = useAssetStore((s) => s.isAddModalOpen);
  const isEditModalOpen = useAssetStore((s) => s.isEditModalOpen);
  const selectedAsset = useAssetStore((s) => s.selectedAsset);
  const closeModals = useAssetStore((s) => s.closeModals);
  const addAsset = useAssetStore((s) => s.addAsset);
  const updateAsset = useAssetStore((s) => s.updateAsset);
  const assetsCount = useAssetStore((s) => s.assets.length);

  const isOpen = isAddModalOpen || isEditModalOpen;
  const isEditing = isEditModalOpen && selectedAsset !== null;

  const nextAssetId = `A${1000 + assetsCount + 1}`;

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
    if (isEditing) {
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

  /**
   * @description: Add a new specification row to the form
   * @param {string} [defaultKey=''] - Default key for the specification
   * @param {string} [defaultValue=''] - Default value for the specification
   * @returns {void}
   */
  const handleAddSpecRow = (defaultKey = '', defaultValue = '') => {
    setSpecRows((prev) => [...prev, { key: defaultKey, value: defaultValue }]);
  };

  /**
   * @description: Remove a specification row from the form
   * @param {number} index - Index of the specification row to remove
   * @returns {void}
   */
  const handleRemoveSpecRow = (index: number) => {
    setSpecRows((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * @description: Handle specification change in the form
   * @param {number} index - Index of the specification row
   * @param {'key' | 'value'} field - Field to update
   * @param {string} text - New value for the specification
   * @returns {void}
   */
  const handleSpecChange = (index: number, field: 'key' | 'value', text: string) => {
    setSpecRows((prev) => {
      const updated = [...prev];
      updated[index][field] = text;
      return updated;
    });
  };

  /**
   * @description: Submit the form data to create or update an asset
   * @param {AssetFormData} data - Form data to submit
   * @returns {void}
   */
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

    if (isEditing) {
      updateAsset(selectedAsset.id, payload);
      toast.success(ASSET_MODAL_MESSAGES.UPDATED_SUCCESS);
    } else {
      addAsset(payload);
      toast.success(ASSET_MODAL_MESSAGES.CREATED_SUCCESS);
    }
    closeModals();
  };

  const categoryOptions = ASSET_CATEGORIES.map((c) => ({
    label: translateAssets(`categories.${c}`, { defaultValue: c }),
    value: c,
  }));
  const statusOptions = ASSET_STATUSES.map((s) => ({
    label: translateAssets(`statuses.${s}`, { defaultValue: s }),
    value: s,
  }));
  const locationOptions = ASSET_LOCATIONS.map((l) => ({
    label: translateAssets(`locations.${l}`, { defaultValue: l }),
    value: l,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={closeModals}>
      <DialogContent onClose={closeModals} className="max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Header matching Photo */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-primary border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <Briefcase className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing
                  ? translateAssets('addModal.editTitle', {
                      defaultValue: ASSET_MODAL_TITLES.EDIT_ASSET,
                    })
                  : translateAssets('addModal.createTitle', {
                      defaultValue: ASSET_MODAL_TITLES.ADD_ASSET,
                    })}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEditing
                  ? translateAssets('addModal.editSubtitle', {
                      id: selectedAsset.assetId,
                      defaultValue: `${ASSET_MODAL_TITLES.EDIT_DESCRIPTION_PREFIX} ${selectedAsset.assetId}`,
                    })
                  : translateAssets('addModal.createSubtitle', {
                      defaultValue: ASSET_MODAL_TITLES.ADD_DESCRIPTION,
                    })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e);
          }}
          className="space-y-4 pt-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            {/* Asset ID */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Hash className="size-3.5 text-slate-400" />
                <span>
                  {translateAssets('addModal.assetIdLabel', {
                    defaultValue: ASSET_MODAL_LABELS.ASSET_ID,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('assetId')}
                placeholder={ASSET_MODAL_PLACEHOLDERS.ASSET_ID}
                className={`h-9 text-xs sm:text-sm rounded-md ${
                  errors.assetId ? 'border-red-400 focus-visible:ring-red-400/20' : ''
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
                <span>
                  {translateAssets('addModal.nameLabel', {
                    defaultValue: ASSET_MODAL_LABELS.ASSET_NAME,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('name')}
                placeholder={ASSET_MODAL_PLACEHOLDERS.NAME}
                className={`h-9 text-xs sm:text-sm rounded-md ${
                  errors.name ? 'border-red-400 focus-visible:ring-red-400/20' : ''
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
                <span>
                  {translateAssets('addModal.modelSpecification', {
                    defaultValue: ASSET_MODAL_LABELS.MODEL_SPECIFICATION,
                  })}
                </span>
              </label>
              <Input
                {...register('model')}
                placeholder={ASSET_MODAL_PLACEHOLDERS.MODEL}
                className="h-9 text-xs sm:text-sm rounded-md"
              />
            </div>

            {/* Serial Number */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Barcode className="size-3.5 text-slate-400" />
                <span>
                  {translateAssets('addModal.serialNumberLabel', {
                    defaultValue: ASSET_MODAL_LABELS.SERIAL_NUMBER,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('serialNumber')}
                placeholder={ASSET_MODAL_PLACEHOLDERS.SERIAL_NUMBER}
                className={`h-9 text-xs sm:text-sm font-mono rounded-md ${
                  errors.serialNumber ? 'border-red-400 focus-visible:ring-red-400/20' : ''
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
                <span>
                  {translateAssets('addModal.categoryLabel', {
                    defaultValue: ASSET_MODAL_LABELS.CATEGORY,
                  })}
                </span>
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={categoryOptions}
                    placeholder={ASSET_MODAL_PLACEHOLDERS.CATEGORY}
                  />
                )}
              />
            </div>

            {/* Status - Shadcn Custom Select */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="size-3.5 text-slate-400" />
                <span>
                  {translateAssets('addModal.statusLabel', {
                    defaultValue: ASSET_MODAL_LABELS.STATUS,
                  })}
                </span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={statusOptions}
                    placeholder={ASSET_MODAL_PLACEHOLDERS.STATUS}
                  />
                )}
              />
            </div>

            {/* Location - Shadcn Custom Select */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-slate-400" />
                <span>
                  {translateAssets('addModal.locationLabel', {
                    defaultValue: ASSET_MODAL_LABELS.LOCATION,
                  })}
                </span>
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={locationOptions}
                    placeholder={ASSET_MODAL_PLACEHOLDERS.LOCATION}
                  />
                )}
              />
            </div>

            {/* Purchase Date */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-slate-400" />
                <span>
                  {translateAssets('addModal.purchaseDateLabel', {
                    defaultValue: ASSET_MODAL_LABELS.PURCHASE_DATE,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register('purchaseDate')}
                className={`h-9 text-xs sm:text-sm rounded-md ${
                  errors.purchaseDate ? 'border-red-400 focus-visible:ring-red-400/20' : ''
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
                <Sliders className="size-3.5 text-primary" />
                <span>
                  {translateAssets('addModal.technicalSpecs', {
                    defaultValue: ASSET_MODAL_LABELS.TECHNICAL_SPECS,
                  })}
                </span>
              </label>
              <button
                type="button"
                onClick={() => handleAddSpecRow('', '')}
                className="text-[11px] font-semibold text-primary hover:text-primary/80 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="size-3" />
                <span>
                  {translateAssets('addModal.addSpecField', {
                    defaultValue: ASSET_MODAL_BUTTONS.ADD_SPEC_FIELD,
                  })}
                </span>
              </button>
            </div>

            {/* Dynamic Key-Value list */}
            {specRows.length > 0 ? (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {specRows.map((row, index) => (
                  <div key={`spec-row-${index}`} className="flex items-center gap-2">
                    <Input
                      placeholder={ASSET_MODAL_PLACEHOLDERS.SPEC_PROPERTY}
                      value={row.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      className="h-8.5 text-xs flex-1 rounded-md bg-white dark:bg-slate-900 font-medium"
                    />
                    <Input
                      placeholder={ASSET_MODAL_PLACEHOLDERS.SPEC_VALUE}
                      value={row.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="h-8.5 text-xs flex-1 rounded-md bg-white dark:bg-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecRow(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer"
                      title={ASSET_MODAL_STRINGS.REMOVE_FIELD}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between py-2 px-2.5 text-xs text-slate-400 bg-white/60 dark:bg-slate-900/60 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-[11.5px] italic">
                  {translateAssets('addModal.noSpecsAdded', {
                    defaultValue: ASSET_MODAL_STRINGS.NO_SPECS_ADDED,
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedCategory === 'Laptop' || selectedCategory === 'Desktop') {
                      setSpecRows([...SPEC_PRESETS.COMPUTERS]);
                    } else if (selectedCategory === 'Monitor') {
                      setSpecRows([...SPEC_PRESETS.MONITORS]);
                    } else {
                      handleAddSpecRow(ASSET_MODAL_STRINGS.DEFAULT_PROPERTY, '');
                    }
                  }}
                  className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                >
                  {translateAssets('addModal.loadPresets', {
                    defaultValue: ASSET_MODAL_BUTTONS.LOAD_PRESETS,
                  })}
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="size-3.5 text-slate-400" />
              <span>
                {translateAssets('addModal.notesLabel', {
                  defaultValue: ASSET_MODAL_LABELS.NOTES_REMARKS,
                })}
              </span>
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder={translateAssets('addModal.notesPlaceholder', {
                defaultValue: ASSET_MODAL_PLACEHOLDERS.NOTES,
              })}
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-[11px] text-slate-400 leading-tight">
              {translateAssets('addModal.notesHelper', {
                defaultValue: ASSET_MODAL_STRINGS.NOTES_HELPER,
              })}
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeModals}
              className="h-9 text-xs rounded-md cursor-pointer"
            >
              {translateAssets('addModal.cancelButton', {
                defaultValue: ASSET_MODAL_BUTTONS.CANCEL,
              })}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 bg-primary hover:bg-primary text-white text-xs font-medium px-5 rounded-md shadow-xs cursor-pointer"
            >
              {isEditing
                ? translateAssets('addModal.saveChangesButton', {
                    defaultValue: ASSET_MODAL_BUTTONS.SAVE_CHANGES,
                  })
                : translateAssets('addModal.createAssetButton', {
                    defaultValue: ASSET_MODAL_BUTTONS.CREATE_ASSET,
                  })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetModal;
