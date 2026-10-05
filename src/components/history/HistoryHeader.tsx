import React from 'react';
import { History, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HistoryHeaderProps {
  onRefresh?: () => void;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({ onRefresh }) => {
  const handleExport = () => {
    toast.success('Audit log export initiated. File will download shortly.');
  };

  const handleRefresh = () => {
    onRefresh?.();
    toast.success('Activity history refreshed');
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      {/* Title & Icon Header */}
      <div className="flex items-start sm:items-center gap-3 shrink-0">
        <div className="p-2.5 rounded-xl bg-[#155DFC]/10 dark:bg-[#155DFC]/20 text-[#155DFC] shadow-xs shrink-0 mt-0.5 sm:mt-0">
          <History className="size-6 sm:size-7" />
        </div>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Activity History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Comprehensive audit logs, lifecycle events, and operational tracking across AssetOps
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          className="h-9 px-3 text-xs font-medium rounded-lg border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Refresh History Feed"
        >
          <RefreshCw className="size-3.5" />
          <span>Refresh</span>
        </Button>

        <Button
          type="button"
          onClick={handleExport}
          className="h-9 px-4 bg-[#155DFC] hover:bg-[#0D4ECC] text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <Download className="size-3.5 stroke-[2.5]" />
          <span>Export Audit Log</span>
        </Button>
      </div>
    </div>
  );
};

export default HistoryHeader;
