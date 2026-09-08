import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_LOCATIONS,
} from '@/constans/employee.constants';
import { employeeSchema, type EmployeeFormData } from '@/schemas/employee.schema';
import {
  UserPlus,
  Hash,
  User,
  Mail,
  Phone,
  Building2,
  Activity,
  Briefcase,
  UserCog,
  MapPin,
} from 'lucide-react';

export const AddEmployeeModal: React.FC = () => {
  const { isAddModalOpen, closeModals, addEmployee, employees } = useEmployeeStore();
  const nextEmpNum = employees.length + 101;
  const defaultEmpId = `E${nextEmpNum}`;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeId: defaultEmpId,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'IT',
      position: 'Specialist',
      status: 'active',
      type: 'full-time',
      location: 'Headquarters',
    },
  });

  useEffect(() => {
    if (isAddModalOpen) {
      reset({
        employeeId: defaultEmpId,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'IT',
        position: 'Specialist',
        status: 'active',
        type: 'full-time',
        location: 'Headquarters',
      });
    }
  }, [isAddModalOpen, defaultEmpId, reset]);

  const onSubmit = (data: EmployeeFormData) => {
    addEmployee(data);
    reset();
    closeModals();
  };

  const handleClose = () => {
    reset();
    closeModals();
  };

  const departmentOptions = EMPLOYEE_DEPARTMENTS.map((d) => ({ label: d, value: d }));
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Terminated', value: 'terminated' },
  ];
  const typeOptions = [
    { label: 'Full-Time', value: 'full-time' },
    { label: 'Contractor', value: 'contractor' },
    { label: 'Intern', value: 'intern' },
  ];
  const locationOptions = EMPLOYEE_LOCATIONS.map((l) => ({ label: l, value: l }));

  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose} className="max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4C40F7] border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <UserPlus className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Add New Employee
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fill in the information below to register a new employee.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Employee ID */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Hash className="size-3.5 text-slate-400" />
              <span>Employee ID</span>
              <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('employeeId')}
              placeholder="e.g. E156"
              className={`h-9 text-xs sm:text-sm rounded-md ${
                errors.employeeId ? 'border-red-400 focus-visible:ring-red-400/20' : ''
              }`}
            />
            {errors.employeeId && (
              <p className="text-[11px] text-red-500 font-medium">{errors.employeeId.message}</p>
            )}
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="size-3.5 text-slate-400" />
                <span>First Name</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('firstName')}
                placeholder="John"
                className={`h-9 text-xs sm:text-sm rounded-md ${
                  errors.firstName ? 'border-red-400 focus-visible:ring-red-400/20' : ''
                }`}
              />
              {errors.firstName && (
                <p className="text-[11px] text-red-500 font-medium">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="size-3.5 text-slate-400" />
                <span>Last Name</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('lastName')}
                placeholder="Doe"
                className={`h-9 text-xs sm:text-sm rounded-md ${
                  errors.lastName ? 'border-red-400 focus-visible:ring-red-400/20' : ''
                }`}
              />
              {errors.lastName && (
                <p className="text-[11px] text-red-500 font-medium">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="size-3.5 text-slate-400" />
              <span>Email Address</span>
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              {...register('email')}
              placeholder="john@company.com"
              className={`h-9 text-xs sm:text-sm rounded-md ${
                errors.email ? 'border-red-400 focus-visible:ring-red-400/20' : ''
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="size-3.5 text-slate-400" />
                <span>Phone Number</span>
              </label>
              <Input
                {...register('phone')}
                placeholder="+1 (555) 000-1234"
                className="h-9 text-xs sm:text-sm rounded-md"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Briefcase className="size-3.5 text-slate-400" />
                <span>Employment Type</span>
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={typeOptions}
                    placeholder="Select type"
                  />
                )}
              />
            </div>
          </div>

          {/* Department & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 className="size-3.5 text-slate-400" />
                <span>Department</span>
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={departmentOptions}
                    placeholder="Select department"
                  />
                )}
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="size-3.5 text-slate-400" />
                <span>Status</span>
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={statusOptions}
                    placeholder="Select status"
                  />
                )}
              />
            </div>
          </div>

          {/* Position & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <UserCog className="size-3.5 text-slate-400" />
                <span>Position</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('position')}
                placeholder="Specialist"
                className={`h-9 text-xs sm:text-sm rounded-md ${
                  errors.position ? 'border-red-400 focus-visible:ring-red-400/20' : ''
                }`}
              />
              {errors.position && (
                <p className="text-[11px] text-red-500 font-medium">{errors.position.message}</p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-slate-400" />
                <span>Location</span>
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={locationOptions}
                    placeholder="Select location"
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-9 text-xs rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs font-medium px-5 rounded-md shadow-xs cursor-pointer"
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

