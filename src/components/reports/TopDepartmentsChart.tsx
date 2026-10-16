import React, { useMemo } from 'react';
import { Building2, Laptop, Cpu, BarChart3, Wallet, Users, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { EMPLOYEE_DEPARTMENTS } from '@/constant/employee.constants';
import { getAssetDepartment } from '@/utils/assetDepartment';
import { TOP_DEPARTMENTS_CHART_CONSTANTS } from './constants/TopDepartmentsChart.constants';

interface DepartmentStat {
  name: string;
  percentage: number;
  assetsCount: number;
  icon: React.ElementType;
}

interface TopDepartmentsChartProps {
  selectedDepartment?: string;
}

/**
 * @description: Displays a ranking list of top departments by allocated device count and utilization percentage
 * @param {TopDepartmentsChartProps}selectedDepartment: Currently filtered department (defaults to 'All')
 * @return {JSX.Element}: Top departments chart component JSX
 */
export const TopDepartmentsChart: React.FC<TopDepartmentsChartProps> = ({
  selectedDepartment = TOP_DEPARTMENTS_CHART_CONSTANTS.DEFAULT_DEPARTMENT,
}) => {
  const { t: translateReports } = useTranslation('report');
  const { t: translateEmployees } = useTranslation('employee');
  const { t: translateAssets } = useTranslation('asset');

  const assets = useAssetStore((s) => s.assets);
  const employees = useEmployeeStore((s) => s.employees);

  /**
   * @description: Filters all assets currently allocated to employees
   * @return {Asset[]}: Array of allocated assets
   */
  const allocatedAssets = useMemo(() => {
    return assets.filter((a) => a.status === 'Allocated');
  }, [assets]);

  const totalAllocated = allocatedAssets.length;

  /**
   * @description: Aggregates allocated equipment counts and calculates utilization percentage per department
   * @return {DepartmentStat[]}: Top department statistics array sorted descending
   */
  const topDepartments = useMemo<DepartmentStat[]>(() => {
    // Gather all distinct departments from employee constants & active employees
    const allDepts = new Set<string>(EMPLOYEE_DEPARTMENTS);
    employees.forEach((e) => {
      if (e.department) allDepts.add(e.department);
    });
    assets.forEach((a) => {
      const dept = getAssetDepartment(a, employees);
      if (dept !== TOP_DEPARTMENTS_CHART_CONSTANTS.UNASSIGNED) allDepts.add(dept);
    });

    const deptStats = Array.from(allDepts).map((dept) => {
      const count = allocatedAssets.filter(
        (asset) => getAssetDepartment(asset, employees).toLowerCase() === dept.toLowerCase(),
      ).length;

      let icon = Building;
      const lower = dept.toLowerCase();
      if (
        lower === TOP_DEPARTMENTS_CHART_CONSTANTS.KEYWORDS.IT ||
        lower.includes(TOP_DEPARTMENTS_CHART_CONSTANTS.KEYWORDS.ENGINEER)
      ) {
        icon = Laptop;
      } else if (lower.includes(TOP_DEPARTMENTS_CHART_CONSTANTS.KEYWORDS.OP)) {
        icon = Cpu;
      } else if (
        lower.includes(TOP_DEPARTMENTS_CHART_CONSTANTS.KEYWORDS.MARKET) ||
        lower.includes(TOP_DEPARTMENTS_CHART_CONSTANTS.KEYWORDS.SALE)
      ) {
        icon = BarChart3;
      } else if (lower.includes(TOP_DEPARTMENTS_CHART_CONSTANTS.KEYWORDS.FIN)) {
        icon = Wallet;
      } else if (lower.includes(TOP_DEPARTMENTS_CHART_CONSTANTS.KEYWORDS.HR)) {
        icon = Users;
      }

      // Proportional percentage
      const percentage = totalAllocated > 0 ? Math.round((count / totalAllocated) * 100) : 0;

      return {
        name: dept,
        percentage,
        assetsCount: count,
        icon,
      };
    });

    // Sort by count descending, top 5 units
    deptStats.sort((a, b) => b.percentage - a.percentage || b.assetsCount - a.assetsCount);
    return deptStats.slice(0, 5);
  }, [assets, employees, allocatedAssets, totalAllocated]);

  const displayAllocatedTotal = `${totalAllocated} ${translateAssets('statuses.Allocated', {
    defaultValue: TOP_DEPARTMENTS_CHART_CONSTANTS.ALLOCATED_SUFFIX,
  })}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {translateReports('charts.topDepartments', {
              defaultValue: TOP_DEPARTMENTS_CHART_CONSTANTS.TITLE,
            })}
          </h3>
        </div>

        {/* Department Progress Bars */}
        <div className="space-y-4 my-auto">
          {topDepartments.map((dept) => {
            const Icon = dept.icon;
            const isHighlighted =
              selectedDepartment !== TOP_DEPARTMENTS_CHART_CONSTANTS.DEFAULT_DEPARTMENT &&
              dept.name.toLowerCase().includes(selectedDepartment.toLowerCase());

            const departmentDisplayName = translateEmployees(`departments.${dept.name}`, {
              defaultValue: dept.name,
            });

            return (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`size-3.5 ${isHighlighted ? 'text-primary' : 'text-slate-400'}`}
                    />
                    <span
                      className={`font-semibold ${
                        isHighlighted
                          ? 'text-primary font-bold'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {departmentDisplayName}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {dept.percentage}%
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700 ease-out ${
                      isHighlighted ? 'ring-2 ring-primary/50' : ''
                    }`}
                    style={{ width: `${Math.max(4, dept.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          {translateReports('charts.acrossUnits', {
            count: topDepartments.length,
            defaultValue: `${TOP_DEPARTMENTS_CHART_CONSTANTS.UNITS_PREFIX}${topDepartments.length}${TOP_DEPARTMENTS_CHART_CONSTANTS.UNITS_SUFFIX}`,
          })}
        </span>
        <span className="font-semibold text-primary">{displayAllocatedTotal}</span>
      </div>
    </div>
  );
};

export default TopDepartmentsChart;
