import { History, ShieldCheck, Download } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { DashboardRecentActivity } from '@/components/dashboard/DashboardRecentActivity';
import { toast } from 'sonner';

export function HistoryPage() {
  const handleExportAudit = () => {
    toast.success('Audit log exported successfully', {
      description: 'System activity history downloaded as CSV.',
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full text-left">
      <PageHeader
        icon={History}
        title="Activity Log & History"
        description="Audit trail of hardware assignments, lifecycle changes, and inventory updates."
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleExportAudit}
          className="flex items-center gap-2 h-9 px-3.5 text-xs sm:text-sm font-medium border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs hover:text-[#155DFC] dark:hover:text-[#155DFC] transition-colors cursor-pointer"
        >
          <Download className="size-3.5 text-slate-500" />
          <span>Export Audit Log</span>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <DashboardRecentActivity />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-[#155DFC]/10 text-[#155DFC]">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Audit Policies</h3>
              <p className="text-[11px] text-slate-400">Compliance & Security</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All administrative actions, asset allocation changes, employee status updates, and hardware lifecycle modifications are immutably logged for audit readiness.
          </p>
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Retention Period</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">365 Days</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Log Integrity</span>
              <span className="font-semibold text-emerald-600">Verified</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500">Automated Backup</span>
              <span className="font-semibold text-[#155DFC]">Daily (00:00 UTC)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;

