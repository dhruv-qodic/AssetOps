import { History } from 'lucide-react';

export function HistoryPage() {
  return (
    <div className="flex-1 p-5 sm:p-7 space-y-6 max-w-[1400px] w-full mx-auto animate-in fade-in duration-200 text-left">
      {/* Page Header */}
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#155DFC]/10 dark:bg-[#155DFC]/20 text-[#155DFC] shadow-xs shrink-0 mt-0.5 sm:mt-0">
          <History className="size-6 sm:size-7" />
        </div>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Activity History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Audit logs, lifecycle updates, and assignment history across organization assets.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
