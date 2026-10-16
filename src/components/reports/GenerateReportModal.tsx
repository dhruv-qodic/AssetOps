import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, Loader2, Calendar, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { getAssetDepartment } from '@/utils/assetDepartment';
import { toast } from 'sonner';
import { GENERATE_REPORT_MODAL_CONSTANTS } from './constants/GenerateReportModal.constants';
import { useCurrency } from '@/hooks/useCurrency';
import { formatDate, formatDateTime } from '@/utils/date';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  timeRange: string;
  department: string;
}

/**
 * @description: Modal dialog facilitating on-demand generation and export of formatted asset reports (CSV or PDF/Text)
 * @param {boolean} isOpen: Modal open state boolean
 * @param {function(): void} onClose: Modal close callback
 * @param {string} reportType: Title of the report to compile
 * @param {string} timeRange: Selected timeframe filter
 * @param {string} department: Selected department filter
 * @returns {JSX.Element} Report generator modal dialog JSX
 */
export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  timeRange,
  department,
}) => {
  const { t: translateReports } = useTranslation('report');
  const { t: translateEmployees } = useTranslation('employee');

  const assets = useAssetStore((s) => s.assets);
  const employees = useEmployeeStore((s) => s.employees);
  const { currency, convert } = useCurrency();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [format, setFormat] = useState<'csv' | 'pdf'>('pdf');

  if (!isOpen) return null;

  /**
   * @description: Simulates compilation of report records and switches modal into completed state
   * @return {void}: void
   */
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsCompleted(true);
    }, 1000);
  };

  /**
   * @description: Formats report data matching criteria and triggers browser download of the exported file
   * @return {void}: void
   */
  const handleDownload = () => {
    // Filter assets matching selected department
    const exportAssets =
      department === GENERATE_REPORT_MODAL_CONSTANTS.DEFAULT_DEPARTMENT
        ? assets
        : assets.filter(
            (a) => getAssetDepartment(a, employees).toLowerCase() === department.toLowerCase(),
          );

    const filename = `${reportType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.${format}`;

    let content: string;
    if (format === GENERATE_REPORT_MODAL_CONSTANTS.FORMATS.CSV) {
      const headers = [
        'Asset ID',
        'Name',
        'Category',
        'Status',
        'Location',
        'Department',
        'Assigned To',
        'Purchase Date',
        `Cost (${currency})`,
      ];
      const rows = exportAssets.map((a) => {
        const dept = getAssetDepartment(a, employees);
        const assignedEmployee = a.assignedTo?.id
          ? employees.find((e) => e.id === a.assignedTo?.id)
          : null;
        const assigneeName = assignedEmployee
          ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}`
          : a.assignedTo?.name || 'Unassigned';

        const displayCost = a.purchaseCost != null ? convert(a.purchaseCost).toFixed(2) : '0.00';

        return [
          a.assetId || a.id,
          `"${a.name.replace(/"/g, '""')}"`,
          a.category,
          a.status,
          `"${a.location || 'Headquarters'}"`,
          `"${dept}"`,
          `"${assigneeName}"`,
          a.purchaseDate ? formatDate(a.purchaseDate) : '',
          displayCost,
        ].join(',');
      });
      content = [headers.join(','), ...rows].join('\n');
    } else {
      // Formatted text summary representation for PDF mockup export
      content = `=================================================================\n`;
      content += ` ASSETOPS ENTERPRISE AUDIT REPORT\n`;
      content += `=================================================================\n\n`;
      content += `Report Type: ${reportType}\n`;
      content += `Timeframe:   ${timeRange}\n`;
      content += `Department:  ${department}\n`;
      content += `Generated:   ${formatDateTime(new Date())}\n`;
      content += `Total Records: ${exportAssets.length}\n\n`;
      content += `-----------------------------------------------------------------\n`;
      content += `ID       | NAME                          | CATEGORY   | STATUS    \n`;
      content += `-----------------------------------------------------------------\n`;

      exportAssets.forEach((a) => {
        const id = (a.assetId || a.id).padEnd(8);
        const name = (a.name.length > 28 ? a.name.substring(0, 25) + '...' : a.name).padEnd(29);
        const cat = a.category.padEnd(10);
        const stat = a.status.padEnd(10);
        content += `${id} | ${name} | ${cat} | ${stat}\n`;
      });
      content += `-----------------------------------------------------------------\n`;
    }

    // Trigger browser file download via Blob
    const mimeType =
      format === GENERATE_REPORT_MODAL_CONSTANTS.FORMATS.CSV
        ? 'text/csv;charset=utf-8;'
        : 'text/plain;charset=utf-8;';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(
      translateReports('toasts.downloadSuccess', {
        defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.DOWNLOAD_SUCCESS_MSG,
      }),
    );
    handleModalClose();
  };

  const handleModalClose = () => {
    setIsCompleted(false);
    setIsGenerating(false);
    onClose();
  };

  const departmentDisplay =
    department === GENERATE_REPORT_MODAL_CONSTANTS.DEFAULT_DEPARTMENT
      ? translateReports('filters.all', { defaultValue: 'All' })
      : translateEmployees(`departments.${department}`, { defaultValue: department });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Download className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {translateReports('modal.title', {
                  defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.MODAL_TITLE,
                })}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {translateReports('modal.subtitle', {
                  defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.MODAL_SUBTITLE,
                })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleModalClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={GENERATE_REPORT_MODAL_CONSTANTS.CLOSE_MODAL_ARIA}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <div className="py-5 space-y-4">
            {/* Summary Details */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText className="size-3.5" />{' '}
                  {translateReports('modal.reportTypeLabel', {
                    defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.REPORT_TYPE_LABEL,
                  })}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {reportType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="size-3.5" />{' '}
                  {translateReports('modal.dateRangeLabel', {
                    defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.TIME_RANGE_LABEL,
                  })}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {timeRange}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Building2 className="size-3.5" />{' '}
                  {translateReports('modal.departmentLabel', {
                    defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.DEPARTMENT_LABEL,
                  })}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {departmentDisplay}
                </span>
              </div>
            </div>

            {/* Export Format Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {translateReports('modal.formatLabel', {
                  defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.EXPORT_FORMAT_LABEL,
                })}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    format === 'pdf'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="size-4" />
                  <span>
                    {translateReports('modal.pdfButtonText', {
                      defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.PDF_BUTTON_TEXT,
                    })}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    format === 'csv'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Download className="size-4" />
                  <span>
                    {translateReports('modal.csvButtonText', {
                      defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.CSV_BUTTON_TEXT,
                    })}
                  </span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                disabled={isGenerating}
              >
                {translateReports('modal.cancelButton', {
                  defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.CANCEL_BUTTON_TEXT,
                })}
              </Button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs sm:text-sm shadow-md shadow-primary/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>
                      {translateReports('modal.generating', {
                        defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.COMPILING_TEXT,
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    <span>
                      {translateReports('modal.compileDownload', {
                        defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.COMPILE_DOWNLOAD_TEXT,
                      })}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="flex size-14 mx-auto items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-90">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {translateReports('modal.readyTitle', {
                  defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.READY_TITLE,
                })}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Your customized {reportType} for {timeRange} has been successfully generated.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleModalClose}>
                {translateReports('modal.closeButton', {
                  defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.CLOSE_BUTTON_TEXT,
                })}
              </Button>
              <button
                type="button"
                onClick={handleDownload}
                className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs sm:text-sm shadow-md shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="size-4" />
                <span>
                  {translateReports('modal.downloadFile', {
                    defaultValue: GENERATE_REPORT_MODAL_CONSTANTS.DOWNLOAD_FILE_TEXT,
                  })}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateReportModal;
