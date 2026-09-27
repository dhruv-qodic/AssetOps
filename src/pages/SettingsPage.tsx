import { useState } from 'react';
import { Settings, Save, Bell, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SettingsPage() {
  const [orgName, setOrgName] = useState('AssetOps Enterprise');
  const [currency, setCurrency] = useState('USD ($)');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoDecommission, setAutoDecommission] = useState(false);

  const handleSave = () => {
    toast.success('Settings updated successfully', {
      description: 'Your organization preferences have been saved.',
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full text-left">
      <PageHeader
        icon={Settings}
        title="System Settings"
        description="Configure organization preferences, role policies, and inventory defaults."
      >
        <Button
          type="button"
          onClick={handleSave}
          className="h-9 px-4 bg-[#155DFC] hover:bg-[#1047C7] text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs shadow-[#155DFC]/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <Save className="size-4" />
          <span>Save Changes</span>
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {/* Organization Preferences */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-[#155DFC]/10 text-[#155DFC]">
              <Building2 className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Organization Profile</h3>
              <p className="text-[11px] text-slate-400">Company identity and regional defaults</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Company Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full h-9.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20 focus:border-[#155DFC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Default Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-9.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20 focus:border-[#155DFC] cursor-pointer"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="INR (₹)">INR (₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Automation */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-[#155DFC]/10 text-[#155DFC]">
              <Bell className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alerts & Automation</h3>
              <p className="text-[11px] text-slate-400">Inventory alerts and automated state rules</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">Email Notifications</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Receive alerts when assets are allocated or returned</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="size-4 rounded text-[#155DFC] focus:ring-[#155DFC] accent-[#155DFC] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">Auto-Decommission Warning</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Flag assets older than 4 years for retirement review</span>
              </div>
              <input
                type="checkbox"
                checked={autoDecommission}
                onChange={(e) => setAutoDecommission(e.target.checked)}
                className="size-4 rounded text-[#155DFC] focus:ring-[#155DFC] accent-[#155DFC] cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

