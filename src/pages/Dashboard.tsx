import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useTranslation } from 'react-i18next';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSummaryCards } from '@/components/dashboard/DashboardSummaryCards';
import { DashboardMiddleSection } from '@/components/dashboard/DashboardMiddleSection';
import { DashboardAnalyticsSection } from '@/components/dashboard/DashboardAnalyticsSection';
import { DashboardCustomizationModal } from '@/components/dashboard/DashboardCustomizationModal';
import { DASHBOARD_WIDGET_TITLES } from '@/constant/dashboard.constants';
import { ErrorBoundary } from 'react-error-boundary';
import { WidgetErrorFallback } from '@/components/common/ErrorFallback';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import { LayoutDashboard } from 'lucide-react';
import { DASHBOARD_PAGE_CONSTANTS } from './constants/Dashboard.constants';

/**
 * @description: Root layout component for the dashboard page.
 *              - Fetches data for assets and employees.
 *              - Displays loading and error states.
 *              - Renders four main sections: summary cards, middle section, analytics section, and customization modal.
 * @returns {React.ReactNode}
 */
export function Dashboard() {
  const { t: translateDashboard } = useTranslation('dashboard');
  const isAssetLoading = useAssetStore((s) => s.isLoading);
  const assetError = useAssetStore((s) => s.error);
  const reloadAssets = useAssetStore((s) => s.reloadAssets);

  const isEmpLoading = useEmployeeStore((s) => s.isLoading);
  const empError = useEmployeeStore((s) => s.error);
  const reloadEmployees = useEmployeeStore((s) => s.reloadEmployees);

  const { isCustomizationOpen, closeCustomization } = useDashboardStore();

  const isLoading = isAssetLoading || isEmpLoading;
  const error = assetError || empError;

  /**
   * @description: Handler for retrying data fetching operations.
   */
  const handleRetry = () => {
    void reloadAssets();
    void reloadEmployees();
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1400px] w-full mx-auto animate-in fade-in duration-200 text-left">
      {/* 1. Dashboard Header */}
      <DashboardHeader />

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs">
          <LoadingState
            icon={LayoutDashboard}
            title={translateDashboard('loading.title', {
              defaultValue: DASHBOARD_PAGE_CONSTANTS.LOADING.TITLE,
            })}
            description={translateDashboard('loading.description', {
              defaultValue: DASHBOARD_PAGE_CONSTANTS.LOADING.DESCRIPTION,
            })}
            size="lg"
          />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs">
          <ErrorState
            title={translateDashboard('error.title', {
              defaultValue: DASHBOARD_PAGE_CONSTANTS.ERROR_TITLE,
            })}
            message={error}
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Main Content (4 Main Sections) */}
      {!isLoading && !error && (
        <>
          {/* 2. Summary Cards */}
          <section
            aria-label={translateDashboard('sections.summary', {
              defaultValue: DASHBOARD_PAGE_CONSTANTS.SECTIONS.SUMMARY,
            })}
          >
            <ErrorBoundary
              fallbackRender={({ error, resetErrorBoundary }) => (
                <WidgetErrorFallback
                  error={error}
                  resetErrorBoundary={resetErrorBoundary}
                  widgetTitle={DASHBOARD_WIDGET_TITLES.SUMMARY_METRICS}
                  minHeight="min-h-[140px]"
                />
              )}
            >
              <DashboardSummaryCards />
            </ErrorBoundary>
          </section>

          {/* 3. Charts + Recent Activity */}
          <section
            aria-label={translateDashboard('sections.middle', {
              defaultValue: DASHBOARD_PAGE_CONSTANTS.SECTIONS.MIDDLE,
            })}
          >
            <DashboardMiddleSection />
          </section>

          {/* 4. Analytics Charts */}
          <section
            aria-label={translateDashboard('sections.analytics', {
              defaultValue: DASHBOARD_PAGE_CONSTANTS.SECTIONS.ANALYTICS,
            })}
          >
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
