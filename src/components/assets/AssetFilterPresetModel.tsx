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
  return (
    <>
      {/** Save Preset Dialog */}
      <Dialog open={isSavePresetOpen} onOpenChange={setIsSavePresetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex item-center justify-start gap-2">
              <Save className="size-5 text-blue-700 dark:text-blue-300 mt-1" />
              <DialogTitle className="text-slate-700 dark:text-slate-300">
                Save Filter Preset
              </DialogTitle>
            </div>

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
              className="mt-2 rounded-md"
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
      </Dialog>
    </>
  );
}

export default AssetFilterPresetModal;
