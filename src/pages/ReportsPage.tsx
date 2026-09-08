import { useState } from 'react';
import ReportsFilterBar from '@/components/reports/ReportsFilterBar';
import ReportsKpiCards from '@/components/reports/ReportsKpiCards';
import AssetCategoryDistributionChart from '@/components/reports/AssetCategoryDistributionChart';
import AssetGrowthTrendChart from '@/components/reports/AssetGrowthTrendChart';
import TopDepartmentsChart from '@/components/reports/TopDepartmentsChart';
import GenerateReportModal from '@/components/reports/GenerateReportModal';

export function ReportsPage() {
  const [reportType, setReportType] = useState('Asset Overview');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [department, setDepartment] = useState('All');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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

      {/* KPI Metrics Summary Row */}
      <ReportsKpiCards departmentFilter={department} />

      {/* Visual Analytics Grid (3 Charts Matching Reference Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Asset Category Distribution (Donut Chart) */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col">
          <AssetCategoryDistributionChart />
        </div>

        {/* Center: Asset Growth Trend (Area / Line Chart) */}
        <div className="lg:col-span-8 xl:col-span-6 flex flex-col">
          <AssetGrowthTrendChart />
        </div>

        {/* Right: Top Departments Breakdown */}
        <div className="lg:col-span-12 xl:col-span-3 flex flex-col">
          <TopDepartmentsChart />
        </div>
      </div>

      {/* Export & Generate Report Dialog */}
      <GenerateReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        reportType={reportType}
        timeRange={timeRange}
        department={department}
      />
    </div>
  );
}

export default ReportsPage;
