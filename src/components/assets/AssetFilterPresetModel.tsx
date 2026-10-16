import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import {
  ASSET_FILTER_PRESET_TITLES,
  ASSET_FILTER_PRESET_LABELS,
  ASSET_FILTER_PRESET_PLACEHOLDERS,
  ASSET_FILTER_PRESET_BUTTONS,
} from './constants/AssetFilterPresetModel.constants';

/**
 * @ description: Modal dialog to input a name and save the current filter combination as a preset.
 * @param {boolean} isSavePresetOpen - Boolean indicating if modal is open.
 * @param {function(string): void} setPresetName - State setter for preset name input.
 * @param {function(boolean): void} setIsSavePresetOpen - State setter for modal visibility.
 * @param {string} presetName - Current preset name input value.
 * @param {function(): void} handleSavePreset - Callback to execute saving the preset.
 * @returns {JSX.Element} Dialog component for saving filter presets.
 */
function AssetFilterPresetModal({
  isSavePresetOpen,
  setPresetName,
  setIsSavePresetOpen,
  presetName,
  handleSavePreset,
}: {
  isSavePresetOpen: boolean;
  setPresetName: (name: string) => void;
  setIsSavePresetOpen: (open: boolean) => void;
  presetName: string;
  handleSavePreset: () => void;
}) {
  const { t: translateAssets } = useTranslation('asset');
  return (
    <>
      {/** Save Preset Dialog */}
      <Dialog open={isSavePresetOpen} onOpenChange={setIsSavePresetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex item-center justify-start gap-2">
              <Save className="size-5 text-blue-700 dark:text-blue-300 mt-1" />
              <DialogTitle className="text-slate-700 dark:text-slate-300">
                {translateAssets('filters.savePresetTitle', {
                  defaultValue: ASSET_FILTER_PRESET_TITLES.MODAL_TITLE,
                })}
              </DialogTitle>
            </div>

            <DialogDescription>{ASSET_FILTER_PRESET_TITLES.MODAL_DESCRIPTION}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label
              htmlFor="preset-name"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {ASSET_FILTER_PRESET_LABELS.PRESET_NAME}
            </label>

            <Input
              id="preset-name"
              value={presetName}
              className="mt-2 rounded-md"
              onChange={(e) => setPresetName(e.target.value)}
              placeholder={ASSET_FILTER_PRESET_PLACEHOLDERS.PRESET_NAME}
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
              {translateAssets('deleteModal.cancelButton', {
                defaultValue: ASSET_FILTER_PRESET_BUTTONS.CANCEL,
              })}
            </Button>

            <Button type="button" onClick={handleSavePreset} disabled={!presetName.trim()}>
              {translateAssets('filters.savePreset', {
                defaultValue: ASSET_FILTER_PRESET_BUTTONS.SAVE_PRESET,
              })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AssetFilterPresetModal;
