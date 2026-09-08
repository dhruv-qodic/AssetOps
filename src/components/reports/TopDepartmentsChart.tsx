import React from 'react';

interface DepartmentStat {
  name: string;
  percentage: number;
  assetsCount: number;
}

const topDepartments: DepartmentStat[] = [
  { name: 'IT', percentage: 28, assetsCount: 349 },
  { name: 'Operations', percentage: 18, assetsCount: 224 },
  { name: 'Marketing & Sales', percentage: 16, assetsCount: 199 },
  { name: 'Finance', percentage: 10, assetsCount: 125 },
  { name: 'HR', percentage: 6, assetsCount: 75 },
];

export const TopDepartmentsChart: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">
          Top Departments
        </h3>

        {/* Department Progress Bars */}
        <div className="space-y-4 my-auto">
          {topDepartments.map((dept) => (
            <div key={dept.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {dept.name}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {dept.percentage}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4C40F7] to-[#6366F1] transition-all duration-700 ease-out"
                  style={{ width: `${dept.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Across 5 primary units</span>
        <span className="font-semibold text-[#4C40F7]">972 Allocated</span>
      </div>
    </div>
  );
};

export default TopDepartmentsChart;
