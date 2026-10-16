import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  EMPLOYEE_STATUS_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS,
  DEPARTMENT_OPTIONS,
  LOCATION_OPTIONS,
} from '@/constant/employee.constants';
import {
  ADD_EMPLOYEE_MODAL_TITLES,
  ADD_EMPLOYEE_MODAL_LABELS,
  ADD_EMPLOYEE_MODAL_PLACEHOLDERS,
  ADD_EMPLOYEE_MODAL_BUTTONS,
  ADD_EMPLOYEE_MODAL_MESSAGES,
  ADD_EMPLOYEE_MODAL_DEFAULTS,
  EDIT_EMPLOYEE_MODAL_TITLES,
  EDIT_EMPLOYEE_MODAL_BUTTONS,
  EDIT_EMPLOYEE_MODAL_MESSAGES,
} from './constants/EmployeeModal.constants';
import { employeeSchema, type EmployeeFormData } from '@/schemas/employee.schema';
import { toast } from 'sonner';
import {
  UserPlus,
  UserCog,
  Hash,
  User,
  Mail,
  Phone,
  Building2,
  Activity,
  Briefcase,
  MapPin,
} from 'lucide-react';

/**
 * Unified modal dialog form for creating a new employee record or editing an existing one.
 */
export const EmployeeModal: React.FC = () => {
  const { t: translateEmployees } = useTranslation('employee');
  const { t: translateAssets } = useTranslation('asset');
  const isAddModalOpen = useEmployeeStore((s) => s.isAddModalOpen);
  const isEditModalOpen = useEmployeeStore((s) => s.isEditModalOpen);
  const selectedEmployee = useEmployeeStore((s) => s.selectedEmployee);
  const closeModals = useEmployeeStore((s) => s.closeModals);
  const addEmployee = useEmployeeStore((s) => s.addEmployee);
  const updateEmployee = useEmployeeStore((s) => s.updateEmployee);
  const employeesCount = useEmployeeStore((s) => s.employees.length);

  const isOpen = isAddModalOpen || isEditModalOpen;
  const isEditMode = Boolean(isEditModalOpen && selectedEmployee);

  const nextEmpNum = employeesCount + 101;
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
      department: ADD_EMPLOYEE_MODAL_DEFAULTS.DEPARTMENT,
      position: ADD_EMPLOYEE_MODAL_DEFAULTS.POSITION,
      status: ADD_EMPLOYEE_MODAL_DEFAULTS.STATUS,
      type: ADD_EMPLOYEE_MODAL_DEFAULTS.TYPE,
      location: ADD_EMPLOYEE_MODAL_DEFAULTS.LOCATION,
    },
  });

  useEffect(() => {
    if (isEditModalOpen && selectedEmployee) {
      reset({
        employeeId: selectedEmployee.employeeId,
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        email: selectedEmployee.email,
        phone: selectedEmployee.phone || '',
        department: selectedEmployee.department,
        position: selectedEmployee.position,
        status: selectedEmployee.status,
        type: selectedEmployee.type,
        location: selectedEmployee.location,
      });
    } else if (isAddModalOpen) {
      reset({
        employeeId: defaultEmpId,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: ADD_EMPLOYEE_MODAL_DEFAULTS.DEPARTMENT,
        position: ADD_EMPLOYEE_MODAL_DEFAULTS.POSITION,
        status: ADD_EMPLOYEE_MODAL_DEFAULTS.STATUS,
        type: ADD_EMPLOYEE_MODAL_DEFAULTS.TYPE,
        location: ADD_EMPLOYEE_MODAL_DEFAULTS.LOCATION,
      });
    }
  }, [isEditModalOpen, isAddModalOpen, selectedEmployee, defaultEmpId, reset]);

  const onSubmit = (data: EmployeeFormData) => {
    if (isEditModalOpen && selectedEmployee) {
      updateEmployee(selectedEmployee.id, data);
      toast.success(
        translateEmployees('toasts.updated', {
          name: `${data.firstName} ${data.lastName}`,
          defaultValue: `${EDIT_EMPLOYEE_MODAL_MESSAGES.SUCCESS_PREFIX}${data.firstName} ${data.lastName}${EDIT_EMPLOYEE_MODAL_MESSAGES.SUCCESS_SUFFIX}`,
        }),
      );
    } else {
      addEmployee(data);
      toast.success(
        translateEmployees('toasts.created', {
          name: `${data.firstName} ${data.lastName}`,
          defaultValue: `${ADD_EMPLOYEE_MODAL_MESSAGES.SUCCESS_PREFIX}${data.firstName} ${data.lastName}${ADD_EMPLOYEE_MODAL_MESSAGES.SUCCESS_SUFFIX}`,
        }),
      );
    }
    reset();
    closeModals();
  };

  const handleClose = () => {
    reset();
    closeModals();
  };

  const modalTitle = isEditMode
    ? translateEmployees('modal.editTitle', { defaultValue: EDIT_EMPLOYEE_MODAL_TITLES.TITLE })
    : translateEmployees('modal.createTitle', { defaultValue: ADD_EMPLOYEE_MODAL_TITLES.TITLE });
  const modalDescription =
    isEditModalOpen && selectedEmployee
      ? translateEmployees('modal.editSubtitleWithName', {
          name: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
          defaultValue: `${EDIT_EMPLOYEE_MODAL_TITLES.DESCRIPTION_PREFIX}${selectedEmployee.firstName} ${selectedEmployee.lastName}${EDIT_EMPLOYEE_MODAL_TITLES.DESCRIPTION_SUFFIX}`,
        })
      : translateEmployees('modal.createSubtitle', {
          defaultValue: ADD_EMPLOYEE_MODAL_TITLES.DESCRIPTION,
        });
  const submitButtonText = isEditMode
    ? translateEmployees('modal.submitEditButton', {
        defaultValue: EDIT_EMPLOYEE_MODAL_BUTTONS.SAVE_CHANGES,
      })
    : translateEmployees('modal.submitAddButton', {
        defaultValue: ADD_EMPLOYEE_MODAL_BUTTONS.ADD_EMPLOYEE,
      });

  const typeSelectOptions = EMPLOYEE_TYPE_OPTIONS.map((opt) => ({
    label: translateEmployees(`types.${opt.value === 'full-time' ? 'fullTime' : opt.value}`, {
      defaultValue: opt.label,
    }),
    value: opt.value,
  }));

  const departmentSelectOptions = DEPARTMENT_OPTIONS.map((opt) => ({
    label: translateEmployees(`departments.${opt.value}`, { defaultValue: opt.label }),
    value: opt.value,
  }));

  const statusSelectOptions = EMPLOYEE_STATUS_OPTIONS.map((opt) => ({
    label: translateEmployees(`statuses.${opt.value}`, { defaultValue: opt.label }),
    value: opt.value,
  }));

  const locationSelectOptions = LOCATION_OPTIONS.map((opt) => ({
    label: translateAssets(`locations.${opt.value}`, { defaultValue: opt.label }),
    value: opt.value,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose} className="max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-primary border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              {isEditMode ? <UserCog className="size-5" /> : <UserPlus className="size-5" />}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {modalTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {modalDescription}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e);
          }}
          className="space-y-4 pt-1"
        >
          {/* Employee ID */}
          <div className="space-y-1 text-left">
            <label
              htmlFor="employee-id-input"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Hash className="size-3.5 text-slate-400" />
              <span>
                {translateEmployees('modal.employeeIdLabel', {
                  defaultValue: ADD_EMPLOYEE_MODAL_LABELS.EMPLOYEE_ID,
                })}
              </span>
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="employee-id-input"
              {...register('employeeId')}
              placeholder={translateEmployees('modal.employeeIdPlaceholder', {
                defaultValue: ADD_EMPLOYEE_MODAL_PLACEHOLDERS.EMPLOYEE_ID,
              })}
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
              <label
                htmlFor="employee-first-name"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <User className="size-3.5 text-slate-400" />
                <span>
                  {translateEmployees('modal.firstNameLabel', {
                    defaultValue: ADD_EMPLOYEE_MODAL_LABELS.FIRST_NAME,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="employee-first-name"
                {...register('firstName')}
                placeholder={translateEmployees('modal.firstNamePlaceholder', {
                  defaultValue: ADD_EMPLOYEE_MODAL_PLACEHOLDERS.FIRST_NAME,
                })}
                className={`h-9 text-xs sm:text-sm rounded-md ${
                  errors.firstName ? 'border-red-400 focus-visible:ring-red-400/20' : ''
                }`}
              />
              {errors.firstName && (
                <p className="text-[11px] text-red-500 font-medium">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <label
                htmlFor="employee-last-name"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <User className="size-3.5 text-slate-400" />
                <span>
                  {translateEmployees('modal.lastNameLabel', {
                    defaultValue: ADD_EMPLOYEE_MODAL_LABELS.LAST_NAME,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="employee-last-name"
                {...register('lastName')}
                placeholder={translateEmployees('modal.lastNamePlaceholder', {
                  defaultValue: ADD_EMPLOYEE_MODAL_PLACEHOLDERS.LAST_NAME,
                })}
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
            <label
              htmlFor="employee-email"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Mail className="size-3.5 text-slate-400" />
              <span>
                {translateEmployees('modal.emailLabel', {
                  defaultValue: ADD_EMPLOYEE_MODAL_LABELS.EMAIL_ADDRESS,
                })}
              </span>
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="employee-email"
              type="email"
              {...register('email')}
              placeholder={translateEmployees('modal.emailPlaceholder', {
                defaultValue: ADD_EMPLOYEE_MODAL_PLACEHOLDERS.EMAIL,
              })}
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
              <label
                htmlFor="employee-phone"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Phone className="size-3.5 text-slate-400" />
                <span>
                  {translateEmployees('modal.phoneLabel', {
                    defaultValue: ADD_EMPLOYEE_MODAL_LABELS.PHONE_NUMBER,
                  })}
                </span>
              </label>
              <Input
                id="employee-phone"
                {...register('phone')}
                placeholder={translateEmployees('modal.phonePlaceholder', {
                  defaultValue: ADD_EMPLOYEE_MODAL_PLACEHOLDERS.PHONE,
                })}
                className="h-9 text-xs sm:text-sm rounded-md"
              />
            </div>

            <div className="space-y-1 text-left">
              <label
                htmlFor="employee-type-select"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Briefcase className="size-3.5 text-slate-400" />
                <span>
                  {translateEmployees('modal.typeLabel', {
                    defaultValue: ADD_EMPLOYEE_MODAL_LABELS.EMPLOYMENT_TYPE,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    id="employee-type-select"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={typeSelectOptions}
                    placeholder={translateEmployees('modal.typePlaceholder', {
                      defaultValue: ADD_EMPLOYEE_MODAL_PLACEHOLDERS.SELECT_TYPE,
                    })}
                  />
                )}
              />
            </div>
          </div>

          {/* Department & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-1 text-left">
              <label
                htmlFor="employee-dept-select"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Building2 className="size-3.5 text-slate-400" />
                <span>
                  {translateEmployees('modal.departmentLabel', {
                    defaultValue: ADD_EMPLOYEE_MODAL_LABELS.DEPARTMENT,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    id="employee-dept-select"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={departmentSelectOptions}
                    placeholder={translateEmployees('modal.departmentPlaceholder', {
                      defaultValue: ADD_EMPLOYEE_MODAL_PLACEHOLDERS.SELECT_DEPARTMENT,
                    })}
                  />
                )}
              />
            </div>

            <div className="space-y-1 text-left">
              <label
                htmlFor="employee-status-select"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Activity className="size-3.5 text-slate-400" />
                <span>
                  {translateEmployees('modal.statusLabel', {
                    defaultValue: ADD_EMPLOYEE_MODAL_LABELS.STATUS,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    id="employee-status-select"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={statusSelectOptions}
                    placeholder={translateEmployees('modal.statusPlaceholder', {
                      defaultValue: ADD_EMPLOYEE_MODAL_PLACEHOLDERS.SELECT_STATUS,
                    })}
                  />
                )}
              />
            </div>
          </div>

          {/* Position & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-1 text-left">
              <label
                htmlFor="employee-position-input"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <UserCog className="size-3.5 text-slate-400" />
                <span>
                  {translateEmployees('modal.positionLabel', {
                    defaultValue: ADD_EMPLOYEE_MODAL_LABELS.POSITION,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="employee-position-input"
                {...register('position')}
                placeholder={translateEmployees('modal.positionPlaceholder', {
                  defaultValue: ADD_EMPLOYEE_MODAL_PLACEHOLDERS.POSITION,
                })}
                className={`h-9 text-xs sm:text-sm rounded-md ${
                  errors.position ? 'border-red-400 focus-visible:ring-red-400/20' : ''
                }`}
              />
              {errors.position && (
                <p className="text-[11px] text-red-500 font-medium">{errors.position.message}</p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <label
                htmlFor="employee-location-select"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <MapPin className="size-3.5 text-slate-400" />
                <span>
                  {translateEmployees('modal.locationLabel', {
                    defaultValue: ADD_EMPLOYEE_MODAL_LABELS.LOCATION,
                  })}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    id="employee-location-select"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={locationSelectOptions}
                    placeholder={translateEmployees('modal.locationPlaceholder', {
                      defaultValue: ADD_EMPLOYEE_MODAL_PLACEHOLDERS.SELECT_LOCATION,
                    })}
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
              {translateEmployees('modal.cancelButton', {
                defaultValue: ADD_EMPLOYEE_MODAL_BUTTONS.CANCEL,
              })}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-5 rounded-md shadow-xs cursor-pointer"
            >
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeModal;
