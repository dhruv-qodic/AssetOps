import React, { useState } from 'react';
import { History, Download, RefreshCw, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { toast } from 'sonner';
import { exportHistoryToExcel } from '@/utils/historyExport';
import { useActivityStore } from '@/store/useActivityStore';
import type { HistoryRecord, HistoryCategory } from '@/types/activity';
import { HISTORY_HEADER_CONSTANTS } from './constants/HistoryHeader.constants';

export interface HistoryHeaderProps {
  onRefresh?: () => void;
  filteredRecords?: HistoryRecord[];
  activeTab?: HistoryCategory;
}

/**
 * @description: Page header component for activity history providing title, excel export action, and reload button
 * @param {function(): void} onRefresh: Refresh callback
 * @param {HistoryRecord[]} filteredRecords: Filtered history records to export
 * @param {HistoryCategory} activeTab: Current category tab for naming export
 * @returns {JSX.Element} History header component JSX
 */
export const HistoryHeader: React.FC<HistoryHeaderProps> = ({
  onRefresh,
  filteredRecords,
  activeTab,
}) => {
  const { t: translateHistory } = useTranslation('history');
  const [isExporting, setIsExporting] = useState(false);

  /**
   * @description Export history records to Excel
   * @param {HistoryRecord[]} filteredRecords - Filtered and sorted history records
   * @param {HistoryCategory} activeTab - Filter by category
   * @returns {void}
   */

  const handleExport = () => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      const recordsToExport =
        filteredRecords !== undefined ? filteredRecords : useActivityStore.getState().activities;

      if (recordsToExport.length === 0) {
        toast.error(HISTORY_HEADER_CONSTANTS.MESSAGES.NO_RECORDS_ERROR);
        return;
      }

      const result = exportHistoryToExcel(recordsToExport, {
        category: activeTab,
      });

      toast.success(
        `Successfully exported ${result.count} history log${result.count === 1 ? '' : 's'} to ${result.filename}`,
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : HISTORY_HEADER_CONSTANTS.MESSAGES.DEFAULT_EXPORT_ERROR;
      toast.error(msg);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * @description: Triggers data refresh callback and displays success toast
   * @return {void}: void
   */
  const handleRefresh = () => {
    onRefresh?.();
    toast.success(HISTORY_HEADER_CONSTANTS.MESSAGES.REFRESH_SUCCESS);
  };

  return (
    <PageHeader
      title={translateHistory('title', { defaultValue: HISTORY_HEADER_CONSTANTS.TITLE })}
      subtitle={translateHistory('subtitle', { defaultValue: HISTORY_HEADER_CONSTANTS.SUBTITLE })}
      icon={History}
    >
      <Button
        type="button"
        variant="outline"
        onClick={handleRefresh}
        className="h-9 px-3 text-xs font-medium rounded-lg border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer shadow-2xs"
        title={HISTORY_HEADER_CONSTANTS.BUTTONS.REFRESH_TITLE}
      >
        <RefreshCw className="size-3.5" />
        <span>
          {translateHistory('refreshButton', {
            defaultValue: HISTORY_HEADER_CONSTANTS.BUTTONS.REFRESH,
          })}
        </span>
      </Button>

      <Button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        title={HISTORY_HEADER_CONSTANTS.BUTTONS.EXPORT_TITLE}
      >
        {isExporting ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Download className="size-3.5 stroke-[2.5]" />
        )}
        <span>
          {isExporting
            ? translateHistory('exporting', {
                defaultValue: HISTORY_HEADER_CONSTANTS.BUTTONS.EXPORTING,
              })
            : translateHistory('exportButton', {
                defaultValue: HISTORY_HEADER_CONSTANTS.BUTTONS.EXPORT,
              })}
        </span>
      </Button>
    </PageHeader>
  );
};

export default HistoryHeader;
