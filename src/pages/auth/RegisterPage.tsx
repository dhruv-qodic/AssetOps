import { useState } from 'react';
import {
  Loader2,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
  Eye,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { registerSchema, type RegisterFormData, ROLE_OPTIONS } from '@/schemas/auth.schema';
import type { Role } from '@/types/auth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { REGISTER_PAGE_CONSTANTS } from '@/pages/constants/RegisterPage.constants';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordInput } from '@/components/auth/PasswordInput';

interface RoleDisplayItem {
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

// Role display metadata
const ROLE_DISPLAY: Partial<Record<Role, RoleDisplayItem>> = {
  ADMIN: {
    label: REGISTER_PAGE_CONSTANTS.ROLES.ADMIN,
    icon: <ShieldCheck className="size-3.5 text-purple-500" />,
    color: 'text-purple-600',
    description: 'Full system access',
  },
  MANAGER: {
    label: REGISTER_PAGE_CONSTANTS.ROLES.MANAGER,
    icon: <UserPlus className="size-3.5 text-blue-500" />,
    color: 'text-blue-600',
    description: 'Manage assets & staff',
  },
  VIEWER: {
    label: REGISTER_PAGE_CONSTANTS.ROLES.VIEWER,
    icon: <Eye className="size-3.5 text-emerald-500" />,
    color: 'text-emerald-600',
    description: 'Read-only access',
  },
};

function RegisterPage() {
  const { t: translateAuth } = useTranslation('auth');
  const [roleOpen, setRoleOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register: registerUser, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
  });

  const passwordValue = watch('password') || '';

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    setFormError(null);

    const result = await registerUser(data);

    if (!result.success) {
      const errMsg =
        result.error ??
        translateAuth('toast.genericError', {
          defaultValue: REGISTER_PAGE_CONSTANTS.TOAST.GENERIC_ERROR,
        });
      setFormError(errMsg);
      toast.error(errMsg);
      return;
    }

    toast.success(
      translateAuth('toast.registerSuccess', {
        name: data.name.trim(),
        defaultValue: REGISTER_PAGE_CONSTANTS.TOAST.SUCCESS(data.name.trim()),
      }),
    );
    void navigate(REGISTER_PAGE_CONSTANTS.NAVIGATION.LOGIN_PATH, { replace: true });
  };

  const getRoleLabel = (roleKey: Role): string => {
    switch (roleKey) {
      case 'ADMIN':
        return translateAuth('roles.admin', { defaultValue: REGISTER_PAGE_CONSTANTS.ROLES.ADMIN });
      case 'MANAGER':
        return translateAuth('roles.manager', {
          defaultValue: REGISTER_PAGE_CONSTANTS.ROLES.MANAGER,
        });
      case 'VIEWER':
        return translateAuth('roles.viewer', {
          defaultValue: REGISTER_PAGE_CONSTANTS.ROLES.VIEWER,
        });
      default:
        return roleKey;
    }
  };

  return (
    <AuthLayout
      title={translateAuth('register.title', { defaultValue: REGISTER_PAGE_CONSTANTS.FORM.TITLE })}
      subtitle={translateAuth('register.subtitle', {
        defaultValue: REGISTER_PAGE_CONSTANTS.FORM.SUBTITLE,
      })}
      error={formError}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        noValidate
      >
        {/* Full Name */}
        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-gray-700 block">
            {translateAuth('register.nameLabel', {
              defaultValue: REGISTER_PAGE_CONSTANTS.FORM.NAME_LABEL,
            })}
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <User className="size-4" />
            </div>
            <Input
              type="text"
              placeholder={translateAuth('register.namePlaceholder', {
                defaultValue: REGISTER_PAGE_CONSTANTS.FORM.NAME_PLACEHOLDER,
              })}
              {...register('name')}
              className={`h-9.5 pl-9.5 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus-visible:ring-2 ${
                errors.name
                  ? 'border-red-400 focus-visible:ring-red-400/20 focus-visible:border-red-500'
                  : 'border-gray-200 focus-visible:ring-[#155DFC]/20 focus-visible:border-[#155DFC]'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-[11px] text-red-600 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-gray-700 block">
            {translateAuth('register.emailLabel', {
              defaultValue: REGISTER_PAGE_CONSTANTS.FORM.EMAIL_LABEL,
            })}
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Mail className="size-4" />
            </div>
            <Input
              type="email"
              placeholder={translateAuth('register.emailPlaceholder', {
                defaultValue: REGISTER_PAGE_CONSTANTS.FORM.EMAIL_PLACEHOLDER,
              })}
              {...register('email')}
              className={`h-9.5 pl-9.5 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus-visible:ring-2 ${
                errors.email
                  ? 'border-red-400 focus-visible:ring-red-400/20 focus-visible:border-red-500'
                  : 'border-gray-200 focus-visible:ring-[#155DFC]/20 focus-visible:border-[#155DFC]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-600 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Role Dropdown */}
        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-gray-700 block">
            {translateAuth('register.roleLabel', {
              defaultValue: REGISTER_PAGE_CONSTANTS.FORM.ROLE_LABEL,
            })}
          </label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => {
              const roleInfo = ROLE_DISPLAY[field.value];
              const translatedRoleLabel = getRoleLabel(field.value);
              return (
                <div className="relative">
                  <button
                    type="button"
                    id="role-dropdown"
                    aria-haspopup="listbox"
                    aria-expanded={roleOpen}
                    onClick={() => setRoleOpen((p) => !p)}
                    className={`flex h-9.5 w-full items-center justify-between rounded-lg border px-3 py-1.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 cursor-pointer ${
                      errors.role
                        ? 'border-red-400 focus:ring-red-400/20'
                        : roleOpen
                          ? 'border-[#155DFC] ring-2 ring-[#155DFC]/20 focus:ring-[#155DFC]/20'
                          : 'border-gray-200 focus:ring-[#155DFC]/20 focus:border-[#155DFC] hover:border-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {roleInfo ? (
                        <>
                          {roleInfo.icon}
                          <span className={`truncate font-medium ${roleInfo.color}`}>
                            {translatedRoleLabel || roleInfo.label}
                          </span>
                          <span className="text-gray-400 text-[10.5px] truncate hidden sm:inline">
                            — {roleInfo.description}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400">
                          {translateAuth('register.rolePlaceholder', {
                            defaultValue: REGISTER_PAGE_CONSTANTS.FORM.ROLE_PLACEHOLDER,
                          })}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      className={`size-4 text-gray-400 shrink-0 ml-1.5 transition-transform duration-200 ${
                        roleOpen ? 'rotate-180 text-[#155DFC]' : ''
                      }`}
                    />
                  </button>

                  {roleOpen && (
                    <div
                      role="listbox"
                      aria-label="Role options"
                      className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200/90 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5"
                    >
                      {ROLE_OPTIONS.map((roleKey) => {
                        const info = ROLE_DISPLAY[roleKey];
                        const isSelected = field.value === roleKey;
                        const itemRoleLabel = getRoleLabel(roleKey);
                        return (
                          <button
                            key={roleKey}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              field.onChange(roleKey);
                              setRoleOpen(false);
                            }}
                            className={`w-full px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-between text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'font-semibold bg-blue-50 text-[#155DFC]'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {info?.icon}
                              <div>
                                <span
                                  className={`font-medium ${
                                    isSelected ? 'text-[#155DFC]' : info?.color
                                  }`}
                                >
                                  {itemRoleLabel || info?.label}
                                </span>
                                <p className="text-[10.5px] text-gray-400 mt-0.5">
                                  {info?.description}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="size-4 rounded-full bg-[#155DFC] flex items-center justify-center shrink-0">
                                <CheckCircle2 className="size-2.5 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }}
          />
          {errors.role && (
            <p className="text-[11px] text-red-600 font-medium">{errors.role.message}</p>
          )}
        </div>

        {/* Password */}
        <PasswordInput
          label={translateAuth('register.passwordLabel', {
            defaultValue: REGISTER_PAGE_CONSTANTS.FORM.PASSWORD_LABEL,
          })}
          placeholder={translateAuth('register.passwordPlaceholder', {
            defaultValue: REGISTER_PAGE_CONSTANTS.FORM.PASSWORD_PLACEHOLDER,
          })}
          registration={register('password')}
          error={errors.password?.message}
          showPasswordAria={translateAuth('register.showPasswordAria', {
            defaultValue: REGISTER_PAGE_CONSTANTS.FORM.SHOW_PASSWORD_ARIA,
          })}
          hidePasswordAria={translateAuth('register.hidePasswordAria', {
            defaultValue: REGISTER_PAGE_CONSTANTS.FORM.HIDE_PASSWORD_ARIA,
          })}
          showRequirementsPopover
          value={passwordValue}
        />

        {/* Confirm Password */}
        <PasswordInput
          label={translateAuth('register.confirmPasswordLabel', {
            defaultValue: REGISTER_PAGE_CONSTANTS.FORM.CONFIRM_PASSWORD_LABEL,
          })}
          placeholder={translateAuth('register.confirmPasswordPlaceholder', {
            defaultValue: REGISTER_PAGE_CONSTANTS.FORM.CONFIRM_PASSWORD_PLACEHOLDER,
          })}
          registration={register('confirmPassword')}
          error={errors.confirmPassword?.message}
          showPasswordAria={translateAuth('register.showConfirmAria', {
            defaultValue: REGISTER_PAGE_CONSTANTS.FORM.SHOW_CONFIRM_ARIA,
          })}
          hidePasswordAria={translateAuth('register.hideConfirmAria', {
            defaultValue: REGISTER_PAGE_CONSTANTS.FORM.HIDE_CONFIRM_ARIA,
          })}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-[#155DFC] hover:bg-[#0D4ECC] text-white font-medium text-xs sm:text-sm rounded-lg shadow-md shadow-[#155DFC]/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>
                {translateAuth('register.submittingButton', {
                  defaultValue: REGISTER_PAGE_CONSTANTS.FORM.SUBMITTING_BUTTON,
                })}
              </span>
            </>
          ) : (
            <>
              <UserPlus className="size-3.5" />
              <span>
                {translateAuth('register.submitButton', {
                  defaultValue: REGISTER_PAGE_CONSTANTS.FORM.SUBMIT_BUTTON,
                })}
              </span>
            </>
          )}
        </Button>
      </form>

      {/* Navigation to Login */}
      <p className="text-center text-xs text-gray-500">
        {translateAuth('register.haveAccount', {
          defaultValue: REGISTER_PAGE_CONSTANTS.NAVIGATION.LOGIN_PROMPT,
        })}{' '}
        <Link
          to={REGISTER_PAGE_CONSTANTS.NAVIGATION.LOGIN_PATH}
          className="text-[#155DFC] hover:text-[#0D4ECC] font-semibold hover:underline transition-colors"
        >
          {translateAuth('register.signInLink', {
            defaultValue: REGISTER_PAGE_CONSTANTS.NAVIGATION.LOGIN_LINK,
          })}
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
