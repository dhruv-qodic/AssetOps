import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_LOCATIONS,
} from '@/constans/employee.constants';
import type { EmployeeStatus, EmployeeType } from '@/types/employee';

const addEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  status: z.enum(['active', 'inactive', 'terminated'] as const),
  type: z.enum(['full-time', 'contractor', 'intern'] as const),
  location: z.string().min(1, 'Location is required'),
});

type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;

export const AddEmployeeModal: React.FC = () => {
  const { isAddModalOpen, closeModals, addEmployee, employees } = useEmployeeStore();
  const nextEmpNum = employees.length + 1;
  const defaultEmpId = `E${nextEmpNum.toString().padStart(3, '0')}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddEmployeeFormData>({
    resolver: zodResolver(addEmployeeSchema),
  });

  React.useEffect(() => {
    if (isAddModalOpen) {
      reset({
        employeeId: defaultEmpId,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'IT',
        position: 'Specialist',
        status: 'active' as EmployeeStatus,
        type: 'full-time' as EmployeeType,
        location: 'Headquarters',
      });
    }
  }, [isAddModalOpen, defaultEmpId, reset]);

  const onSubmit = (data: AddEmployeeFormData) => {
    addEmployee(data);
    reset();
    closeModals();
  };

  const handleClose = () => {
    reset();
    closeModals();
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Add New Employee
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Employee ID */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Employee ID
            </label>
            <Input
              {...register('employeeId')}
              placeholder="e.g. E006"
              className="h-10 text-xs sm:text-sm"
            />
            {errors.employeeId && (
              <p className="text-xs text-rose-500 mt-1">{errors.employeeId.message}</p>
            )}
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                First Name
              </label>
              <Input
                {...register('firstName')}
                placeholder="John"
                className="h-10 text-xs sm:text-sm"
              />
              {errors.firstName && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Last Name
              </label>
              <Input
                {...register('lastName')}
                placeholder="Doe"
                className="h-10 text-xs sm:text-sm"
              />
              {errors.lastName && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Email Address
            </label>
            <Input
              type="email"
              {...register('email')}
              placeholder="john@company.com"
              className="h-10 text-xs sm:text-sm"
            />
            {errors.email && (
              <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Department & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Department
              </label>
              <select
                {...register('department')}
                className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]"
              >
                {EMPLOYEE_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>

          {/* Position & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Position
              </label>
              <Input
                {...register('position')}
                placeholder="Software Engineer"
                className="h-10 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Location
              </label>
              <select
                {...register('location')}
                className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]"
              >
                {EMPLOYEE_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-9.5 text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9.5 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs sm:text-sm"
            >
              Add Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
