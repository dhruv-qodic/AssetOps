import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, Loader2, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  timeRange: string;
  department: string;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  timeRange,
  department,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [format, setFormat] = useState<'csv' | 'pdf'>('pdf');

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsCompleted(true);
    }, 1200);
  };

  const handleDownload = () => {
    // Generate mock CSV / simulated download
    const filename = `${reportType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.${format}`;
    const dummyContent = `Report: ${reportType}\nGenerated: ${new Date().toISOString()}\nTime Range: ${timeRange}\nDepartment: ${department}\nTotal Assets: 1,248\nAllocated: 982\nAvailable: 266\nMaintenance: 156`;

    const blob = new Blob([dummyContent], { type: format === 'csv' ? 'text/csv' : 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onClose();
    setIsCompleted(false);
  };

  const handleModalClose = () => {
    setIsCompleted(false);
    setIsGenerating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-[#4C40F7]">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Export & Generate Report
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure format and download your operational audit report
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleModalClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
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
                  <FileText className="size-3.5" /> Report Type:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {reportType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> Time Range:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {timeRange}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Building2 className="size-3.5" /> Department:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {department}
                </span>
              </div>
            </div>

            {/* Export Format Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    format === 'pdf'
                      ? 'border-[#4C40F7] bg-indigo-50/70 dark:bg-indigo-950/40 text-[#4C40F7]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="size-4" />
                  <span>PDF Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    format === 'csv'
                      ? 'border-[#4C40F7] bg-indigo-50/70 dark:bg-indigo-950/40 text-[#4C40F7]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Download className="size-4" />
                  <span>CSV Spreadsheet</span>
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
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="h-10 px-5 rounded-xl bg-[#4C40F7] hover:bg-[#3f34e3] text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Compiling Report...</span>
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    <span>Compile & Download</span>
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
                Report Ready for Download
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Your customized {reportType} for {timeRange} has been successfully generated.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleModalClose}>
                Close
              </Button>
              <button
                type="button"
                onClick={handleDownload}
                className="h-10 px-5 rounded-xl bg-[#4C40F7] hover:bg-[#3f34e3] text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="size-4" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateReportModal;
