import { Mail, Lock, ShieldCheck, UserCheck, User, Eye, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DEMO_ACCOUNTS } from '@/mocks/seed/users';
import { toast } from 'sonner';
import { LOGIN_PAGE_CONSTANTS } from '@/pages/constants/LoginPage.constants';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordInput } from '@/components/auth/PasswordInput';

function LoginPage() {
  const { t: translateAuth } = useTranslation('auth');
  const { login, isLoading, error: authError, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';

  // React Hook Form with Zod schema resolver
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login(data);

    if (!success) {
      toast.error(
        translateAuth('toast.invalidCredentials', {
          defaultValue: LOGIN_PAGE_CONSTANTS.TOAST.INVALID_CREDENTIALS,
        }),
      );
      if (data.rememberMe) {
        setValue('password', '', { shouldValidate: false });
      }
      return;
    }

    toast.success(
      translateAuth('toast.loginSuccess', {
        defaultValue: LOGIN_PAGE_CONSTANTS.TOAST.LOGIN_SUCCESS,
      }),
    );
    void navigate(redirectPath, { replace: true });
  };

  const handleFillDemo = (demoEmail: string, demoPass: string, autoSubmit = false) => {
    clearError();
    setValue('email', demoEmail, { shouldValidate: true });
    setValue('password', demoPass, { shouldValidate: true });

    if (autoSubmit) {
      void handleSubmit(onSubmit)();
    }
  };

  const getAccountIcon = (roleKey: string) => {
    switch (roleKey) {
      case 'ADMIN':
        return ShieldCheck;
      case 'MANAGER':
        return UserCheck;
      case 'EMPLOYEE':
        return User;
      default:
        return Eye;
    }
  };

  return (
    <AuthLayout
      title={translateAuth('login.title', { defaultValue: LOGIN_PAGE_CONSTANTS.FORM.TITLE })}
      subtitle={translateAuth('login.subtitle', {
        defaultValue: LOGIN_PAGE_CONSTANTS.FORM.SUBTITLE,
      })}
      error={authError}
    >
      {/* React Hook Form with Icons */}
      <form
        className="space-y-3.5"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        noValidate
      >
        {/* Email Field with Icon */}
        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-gray-700 block">
            {translateAuth('login.emailLabel', {
              defaultValue: LOGIN_PAGE_CONSTANTS.FORM.EMAIL_LABEL,
            })}
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Mail className="size-4" />
            </div>
            <Input
              type="email"
              placeholder={translateAuth('login.emailPlaceholder', {
                defaultValue: LOGIN_PAGE_CONSTANTS.FORM.EMAIL_PLACEHOLDER,
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

        {/* Password Field with reusable component */}
        <PasswordInput
          label={translateAuth('login.passwordLabel', {
            defaultValue: LOGIN_PAGE_CONSTANTS.FORM.PASSWORD_LABEL,
          })}
          placeholder={translateAuth('login.passwordPlaceholder', {
            defaultValue: LOGIN_PAGE_CONSTANTS.FORM.PASSWORD_PLACEHOLDER,
          })}
          registration={register('password')}
          error={errors.password?.message}
          showPasswordAria={translateAuth('login.showPasswordAria', {
            defaultValue: LOGIN_PAGE_CONSTANTS.FORM.SHOW_PASSWORD_ARIA,
          })}
          hidePasswordAria={translateAuth('login.hidePasswordAria', {
            defaultValue: LOGIN_PAGE_CONSTANTS.FORM.HIDE_PASSWORD_ARIA,
          })}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="size-3.5 rounded border-gray-300 text-[#155DFC] focus:ring-[#155DFC] accent-[#155DFC]"
            />
            <span className="text-gray-700 text-xs">
              {translateAuth('login.rememberMe', {
                defaultValue: LOGIN_PAGE_CONSTANTS.FORM.REMEMBER_ME,
              })}
            </span>
          </label>
          <a
            href="#forgot"
            onClick={(e) => {
              e.preventDefault();
            }}
            className="text-[#155DFC] hover:text-[#0D4ECC] font-medium hover:underline text-xs"
          >
            {translateAuth('login.forgotPassword', {
              defaultValue: LOGIN_PAGE_CONSTANTS.FORM.FORGOT_PASSWORD,
            })}
          </a>
        </div>

        {/* Sign In Button with Icon & State */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-[#155DFC] hover:bg-[#0D4ECC] text-white font-medium text-xs sm:text-sm rounded-lg shadow-md shadow-[#155DFC]/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>
                {translateAuth('login.submittingButton', {
                  defaultValue: LOGIN_PAGE_CONSTANTS.FORM.SUBMITTING_BUTTON,
                })}
              </span>
            </>
          ) : (
            <>
              <Lock className="size-3.5" />
              <span>
                {translateAuth('login.submitButton', {
                  defaultValue: LOGIN_PAGE_CONSTANTS.FORM.SUBMIT_BUTTON,
                })}
              </span>
            </>
          )}
        </Button>
      </form>

      {/* Demo Accounts Box from Seed Data */}
      <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 sm:p-3.5 text-xs space-y-2 text-left">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
            {translateAuth('login.demoTitle', {
              defaultValue: LOGIN_PAGE_CONSTANTS.DEMO_ACCOUNTS.TITLE,
            })}
          </span>
          <span className="text-[10px] text-gray-400">
            {translateAuth('login.demoSubtitle', {
              defaultValue: LOGIN_PAGE_CONSTANTS.DEMO_ACCOUNTS.SUBTITLE,
            })}
          </span>
        </div>
        <div className="space-y-1">
          {DEMO_ACCOUNTS.map((account) => {
            const IconComponent = getAccountIcon(account.roleKey);
            return (
              <button
                key={account.role}
                type="button"
                onClick={() => {
                  handleFillDemo(account.email, account.password, true);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200 transition-all text-left text-[11px] group cursor-pointer"
                title={translateAuth('login.demoTooltip', {
                  role: account.role,
                  defaultValue: LOGIN_PAGE_CONSTANTS.DEMO_ACCOUNTS.TOOLTIP(account.role),
                })}
              >
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <IconComponent className={`size-3.5 ${account.iconColor}`} />
                  <strong className={`text-xs ${account.badgeColor} group-hover:underline`}>
                    {account.role}:
                  </strong>
                </div>
                <div className="text-gray-500 font-mono text-[10.5px]">
                  <span className="text-gray-700 font-medium">{account.email}</span>
                  {' / '}
                  <span className="text-gray-400">{account.password}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation to Register */}
      <p className="text-center text-xs text-gray-500">
        {translateAuth('login.noAccount', {
          defaultValue: LOGIN_PAGE_CONSTANTS.NAVIGATION.REGISTER_PROMPT,
        })}{' '}
        <Link
          to={LOGIN_PAGE_CONSTANTS.NAVIGATION.REGISTER_PATH}
          className="text-[#155DFC] hover:text-[#0D4ECC] font-semibold hover:underline transition-colors"
        >
          {translateAuth('login.createOne', {
            defaultValue: LOGIN_PAGE_CONSTANTS.NAVIGATION.REGISTER_LINK,
          })}
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
