import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AssetStatusBadge } from './AssetStatusBadge';
import { useAssetStore } from '@/store/useAssetStore';
import {
  getAssetReferenceUrl,
  generateAssetQrPayload,
  copyToClipboard,
  downloadCanvasAsPng,
} from '@/utils/qrCode';
import { QrCode, Download, Copy, Check, RefreshCw, Hash, Tag, ExternalLink } from 'lucide-react';
import type { Asset } from '@/types/asset';

interface AssetQrModalProps {
  asset?: Asset | null;
  open?: boolean;
  onClose?: () => void;
}

export const AssetQrModalCard: React.FC<{
  asset: Asset;
  onClose: () => void;
}> = ({ asset, onClose }) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrFormat, setQrFormat] = useState<'url' | 'json'>('url');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const referenceUrl = getAssetReferenceUrl(asset);
  const qrPayload = generateAssetQrPayload(asset, qrFormat);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(referenceUrl);
    if (success) {
      setCopied(true);
      toast.success('Asset link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy link to clipboard');
    }
  };

  const handleDownloadQr = () => {
    const canvas =
      canvasRef.current ||
      (document.getElementById(`qr-canvas-${asset.assetId}`) as HTMLCanvasElement | null);
    if (!canvas) {
      toast.error('Could not generate QR code image');
      return;
    }

    const success = downloadCanvasAsPng(canvas, `qrcode-${asset.assetId}`);
    if (success) {
      toast.success(`QR Code downloaded for ${asset.assetId}`);
    } else {
      toast.error('Failed to download QR code');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.info('QR Code refreshed');
    }, 350);
  };

  const handleNavigateToDetail = () => {
    onClose();
    void navigate(`/assets/${asset.assetId}`);
  };

  return (
    <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all animate-in zoom-in-95 duration-200">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Close QR modal"
      >
        {/* <X className="size-4.5" /> */}
        {/* <span className="sr-only">Close</span> */}
      </button>

      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 text-[#155DFC]">
            <QrCode className="size-6" />
          </div>
          <div className="text-left">
            <DialogTitle className="text-base sm:text-lg font-bold">Asset QR Code</DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-0.5">
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {asset.assetId}
              </span>
              <span>•</span>
              <span className="truncate max-w-[140px]">{asset.name}</span>
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-4 py-1 text-left text-xs sm:text-sm">
        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
          <div className="relative p-3 bg-white dark:bg-white rounded-xl shadow-xs border border-slate-200/60 flex items-center justify-center">
            <QRCodeCanvas
              id={`qr-canvas-${asset.assetId}`}
              ref={canvasRef}
              value={qrPayload}
              size={170}
              level="H"
              marginSize={1}
              className={`transition-opacity duration-200 ${isRefreshing ? 'opacity-40' : 'opacity-100'}`}
            />
            {isRefreshing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="size-6 text-[#155DFC] animate-spin" />
              </div>
            )}
          </div>

          {/* Asset summary badge underneath QR */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs">
              <Hash className="size-3 text-slate-500" />
              {asset.assetId}
            </span>
            <AssetStatusBadge status={asset.status} />
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1.5 text-center">
            Scan to navigate directly to this asset page
          </p>
        </div>

        {/* Asset Identity Details */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
            <div className="flex items-center gap-1 text-slate-400 text-[10.5px]">
              <Tag className="size-3" />
              <span>Category</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {asset.category}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
            <div className="flex items-center gap-1 text-slate-400 text-[10.5px]">
              <Hash className="size-3" />
              <span>Serial</span>
            </div>
            <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
              {asset.serialNumber}
            </p>
          </div>
        </div>

        {/* Reference URL / Payload Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-0.5">
            <span className="font-medium">Direct Asset URL</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQrFormat(qrFormat === 'url' ? 'json' : 'url')}
                className="text-[10px] text-[#155DFC] hover:underline font-medium cursor-pointer"
                title="Toggle payload encoding format"
              >
                Format: {qrFormat.toUpperCase()}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="text-[10px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 inline-flex items-center gap-0.5 cursor-pointer"
                title="Refresh QR Code"
              >
                <RefreshCw className="size-2.5" />
                Refresh
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 pl-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px] truncate flex-1 select-all">
              {referenceUrl}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void handleCopyLink();
              }}
              className="h-7 px-2 text-xs flex items-center gap-1 shrink-0 bg-white dark:bg-slate-800"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>

          {/* Quick link to open detail page */}
          <button
            type="button"
            onClick={handleNavigateToDetail}
            className="w-full text-center text-[11.5px] text-[#155DFC] hover:underline font-medium pt-1 inline-flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Open Asset Detail Page</span>
            <ExternalLink className="size-3" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          onClick={handleDownloadQr}
          className="w-full h-9 text-xs bg-[#155DFC] hover:bg-[#1243b2] text-white font-medium flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Download className="size-3.5" />
          <span>Download QR Code</span>
        </Button>
      </DialogFooter>
    </div>
  );
};

export const AssetQrModal: React.FC<AssetQrModalProps> = ({
  asset: propAsset,
  open: propOpen,
  onClose: propOnClose,
}) => {
  const storeIsQrOpen = useAssetStore((s) => s.isQrModalOpen);
  const selectedAsset = useAssetStore((s) => s.selectedAsset);
  const closeQrModal = useAssetStore((s) => s.closeQrModal);

  const isOpen = propOpen !== undefined ? propOpen : storeIsQrOpen;
  const currentAsset = propAsset || selectedAsset;
  const handleClose = propOnClose || closeQrModal;

  if (!isOpen || !currentAsset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        onClose={handleClose}
        className="max-w-sm p-0 border-none bg-transparent shadow-none"
      >
        <AssetQrModalCard asset={currentAsset} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AssetQrModal;
