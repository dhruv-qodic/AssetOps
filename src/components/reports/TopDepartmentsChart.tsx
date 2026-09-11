import React, { useMemo } from 'react';
import { Building2, Laptop, Cpu, BarChart3, Wallet, Users, Building } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { EMPLOYEE_DEPARTMENTS } from '@/constans/employee.constants';
import { getAssetDepartment } from '@/utils/assetDepartment';

interface DepartmentStat {
  name: string;
  percentage: number;
  assetsCount: number;
  icon: React.ElementType;
}

interface TopDepartmentsChartProps {
  selectedDepartment?: string;
}

export const TopDepartmentsChart: React.FC<TopDepartmentsChartProps> = ({
  selectedDepartment = 'All',
}) => {
  const { assets } = useAssetStore();
  const { employees } = useEmployeeStore();

  const allocatedAssets = useMemo(() => {
    return assets.filter((a) => a.status === 'Allocated');
  }, [assets]);

  const totalAllocated = allocatedAssets.length;

  // Dynamically aggregate department allocation data
  const topDepartments = useMemo<DepartmentStat[]>(() => {
    // Gather all distinct departments from employee constants & active employees
    const allDepts = new Set<string>(EMPLOYEE_DEPARTMENTS);
    employees.forEach((e) => {
      if (e.department) allDepts.add(e.department);
    });
    assets.forEach((a) => {
      const dept = getAssetDepartment(a, employees);
      if (dept !== 'Unassigned') allDepts.add(dept);
    });

    const deptStats = Array.from(allDepts).map((dept) => {
      const count = allocatedAssets.filter(
        (asset) => getAssetDepartment(asset, employees).toLowerCase() === dept.toLowerCase()
      ).length;

      let icon = Building;
      const lower = dept.toLowerCase();
      if (lower === 'it' || lower.includes('engineer')) icon = Laptop;
      else if (lower.includes('op')) icon = Cpu;
      else if (lower.includes('market') || lower.includes('sale')) icon = BarChart3;
      else if (lower.includes('fin')) icon = Wallet;
      else if (lower.includes('hr')) icon = Users;

      // Proportional percentage
      const percentage = totalAllocated > 0
        ? Math.round((count / totalAllocated) * 100)
        : 0;

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

  const displayAllocatedTotal = `${totalAllocated} Allocated`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Building2 className="size-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Top Departments
          </h3>
        </div>

        {/* Department Progress Bars */}
        <div className="space-y-4 my-auto">
          {topDepartments.map((dept) => {
            const Icon = dept.icon;
            const isHighlighted =
              selectedDepartment !== 'All' &&
              dept.name.toLowerCase().includes(selectedDepartment.toLowerCase());

            return (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className={`size-3.5 ${isHighlighted ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span
                      className={`font-semibold ${
                        isHighlighted
                          ? 'text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {dept.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {dept.percentage}%
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700 ease-out ${
                      isHighlighted ? 'ring-2 ring-blue-400' : ''
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
        <span>Across {topDepartments.length} primary units</span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {displayAllocatedTotal}
        </span>
      </div>
    </div>
  );
};

export default TopDepartmentsChart;
