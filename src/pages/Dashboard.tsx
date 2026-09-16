import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSummaryCards } from '@/components/dashboard/DashboardSummaryCards';
import { DashboardMiddleSection } from '@/components/dashboard/DashboardMiddleSection';
import { DashboardAnalyticsSection } from '@/components/dashboard/DashboardAnalyticsSection';
import { DashboardCustomizationModal } from '@/components/dashboard/DashboardCustomizationModal';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import { LayoutDashboard } from 'lucide-react';

export function Dashboard() {
  const isAssetLoading = useAssetStore((s) => s.isLoading);
  const assetError = useAssetStore((s) => s.error);
  const reloadAssets = useAssetStore((s) => s.reloadAssets);

  const isEmpLoading = useEmployeeStore((s) => s.isLoading);
  const empError = useEmployeeStore((s) => s.error);
  const reloadEmployees = useEmployeeStore((s) => s.reloadEmployees);

  const { isCustomizationOpen, closeCustomization } = useDashboardStore();

  const isLoading = isAssetLoading || isEmpLoading;
  const error = assetError || empError;

  const handleRetry = () => {
    void reloadAssets();
    void reloadEmployees();
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1600px] w-full mx-auto animate-in fade-in duration-200 text-left">
      {/* 1. Dashboard Header */}
      <DashboardHeader />

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs">
          <LoadingState
            icon={LayoutDashboard}
            title="Loading Dashboard Metrics..."
            description="Aggregating real-time asset inventory and lifecycle analytics."
            size="lg"
          />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs">
          <ErrorState title="Failed to load dashboard data" message={error} onRetry={handleRetry} />
        </div>
      )}

      {/* Main Content (4 Main Sections) */}
      {!isLoading && !error && (
        <>
          {/* 2. Summary Cards */}
          <section aria-label="Summary Metrics">
            <DashboardSummaryCards />
          </section>

          {/* 3. Charts + Recent Activity */}
          <section aria-label="Lifecycle & Activity Overview">
            <DashboardMiddleSection />
          </section>

          {/* 4. Analytics Charts */}
          <section aria-label="Operational Analytics & Forecasting">
            <DashboardAnalyticsSection />
          </section>
        </>
      )}

      {/* Customization Modal */}
      <DashboardCustomizationModal isOpen={isCustomizationOpen} onClose={closeCustomization} />
    </div>
  );
}

export default Dashboard;
