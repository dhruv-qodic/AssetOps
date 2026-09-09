import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import ReportsFilterBar from '@/components/reports/ReportsFilterBar';
import ReportsKpiCards from '@/components/reports/ReportsKpiCards';
import AssetCategoryDistributionChart from '@/components/reports/AssetCategoryDistributionChart';
import AssetGrowthTrendChart from '@/components/reports/AssetGrowthTrendChart';
import TopDepartmentsChart from '@/components/reports/TopDepartmentsChart';
import GenerateReportModal from '@/components/reports/GenerateReportModal';
import AddAssetModal from '@/components/assets/AddAssetModal';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

export function ReportsPage() {
  const {
    assets,
    isLoading: isAssetLoading,
    error: assetError,
    reloadAssets,
    openAddModal,
  } = useAssetStore();
  const {
    isLoading: isEmpLoading,
    error: empError,
    reloadEmployees,
  } = useEmployeeStore();

  const [reportType, setReportType] = useState('Asset Overview');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [department, setDepartment] = useState('All');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const isLoading = isAssetLoading || isEmpLoading;
  const error = assetError || empError;

  const handleRetry = () => {
    reloadAssets();
    reloadEmployees();
  };

  return (
    <div className="flex-1 p-5 sm:p-7 space-y-6 max-w-[1600px] w-full mx-auto animate-in fade-in duration-200 text-left">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Reports & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Insights and analytics for better decision making
        </p>
      </div>

      {/* Interactive Filter Bar */}
      <ReportsFilterBar
        reportType={reportType}
        setReportType={setReportType}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        department={department}
        setDepartment={setDepartment}
        onGenerateReport={() => setIsExportModalOpen(true)}
      />

      {/* 1. Loading State */}
      {isLoading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs">
          <LoadingState
            icon={BarChart3}
            title="Compiling analytics and operational reports..."
            description="Please wait while we aggregate asset metrics across departments."
            size="lg"
          />
        </div>
      )}

      {/* 2. Error State */}
      {!isLoading && error && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs">
          <ErrorState
            title="Failed to generate reports"
            message={error}
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* 3. Empty State */}
      {!isLoading && !error && assets.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs">
          <EmptyState
            icon={BarChart3}
            title="No asset data available for reports"
            description="Reports and analytics will be automatically compiled once you add assets into the inventory."
            actionLabel="Add Asset"
            onAction={openAddModal}
          />
        </div>
      )}

      {/* 4. Success State (KPIs and Visualization Grid) */}
      {!isLoading && !error && assets.length > 0 && (
        <>
          {/* KPI Metrics Summary Row */}
          <ReportsKpiCards
            departmentFilter={department}
            timeRange={timeRange}
            reportType={reportType}
          />

          {/* Visual Analytics Grid (3 Charts Matching Reference Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Asset Category Distribution (Donut Chart) */}
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col">
              <AssetCategoryDistributionChart departmentFilter={department} />
            </div>

            {/* Center: Asset Growth Trend (Area / Line Chart) */}
            <div className="lg:col-span-8 xl:col-span-6 flex flex-col">
              <AssetGrowthTrendChart timeRange={timeRange} />
            </div>

            {/* Right: Top Departments Breakdown */}
            <div className="lg:col-span-12 xl:col-span-3 flex flex-col">
              <TopDepartmentsChart selectedDepartment={department} />
            </div>
          </div>
        </>
      )}

      {/* Export & Generate Report Dialog */}
      <GenerateReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        reportType={reportType}
        timeRange={timeRange}
        department={department}
      />

      {/* Add Asset Modal */}
      <AddAssetModal />
    </div>
  );
}

export default ReportsPage;
