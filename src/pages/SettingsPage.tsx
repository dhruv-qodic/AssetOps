import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="flex-1 p-5 sm:p-7 space-y-6 max-w-[1600px] w-full mx-auto animate-in fade-in duration-200 text-left">
      {/* Page Header */}
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#155DFC]/10 dark:bg-[#155DFC]/20 text-[#155DFC] shadow-xs shrink-0 mt-0.5 sm:mt-0">
          <Settings className="size-6 sm:size-7" />
        </div>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            System Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Configure organization preferences, role policies, and system settings.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
