import { useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  ShieldCheck,
  UserCheck,
  User,
  Layers,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import loginIllustration from '@/assets/login-illustration.jpg';
import { useAuthStore } from '@/store/useAuthStore';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEMO_ACCOUNTS } from '@/mocks/seed/users';

const features = [
  'Track & manage company assets',
  'Allocate assets to employees',
  'Monitor asset lifecycle & history',
  'Get real-time insights',
];

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error: authError, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

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

    if (!success && data.rememberMe) {
      setValue('password', '', { shouldValidate: false });
      return;
    }

    if (success) {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleFillDemo = async (demoEmail: string, demoPass: string, autoSubmit = false) => {
    clearError();
    setValue('email', demoEmail, { shouldValidate: true });
    setValue('password', demoPass, { shouldValidate: true });

    if (autoSubmit) {
      handleSubmit(onSubmit)();
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
    <div className="fixed inset-0 h-screen w-screen overflow-hidden flex flex-row bg-white select-none">
      {/* Left Column: Branding & 3D Isometric Visual (Exactly 50%, zero scroll) */}
      <div className="flex-1 min-w-0 h-full bg-[#080E24] text-white px-6 sm:px-10 lg:px-14 py-6 sm:py-8 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute -top-20 -left-20 size-80 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 size-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-[440px] mx-auto mt-14 flex flex-col justify-between h-full">
          {/* Top Branding Section */}
          <div className="space-y-4 flex justify-center items-center flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-white-600 to-black-500 text-white shadow-lg shadow-indigo-500/40">
                <Layers />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                AssetOps
              </span>
            </div>

            {/* Slogan */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-white leading-tight tracking-tight">
                Smart Asset Management
                <br />
                for a Smarter Business
              </h2>

              {/* Feature Points */}
              <ul className="space-y-2">
                {features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 font-normal"
                  >
                    <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
                      <CheckCircle2 className="size-3.5" />
                    </div>
                    <span className="truncate">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Larger, Prominent 3D Tech Illustration */}
          <div className="flex-1 flex items-start mt-8 justify-center">
            <img
              src={loginIllustration}
              alt="AssetOps Smart 3D Visualization"
              className="w-full max-w-[360px] lg:max-w-[420px] max-h-[44vh] object-contain drop-shadow-[0_20px_35px_rgba(0,140,255,0.35)] rounded-2xl [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Clean Form & Demo Accounts (Exactly 50%, zero scroll) */}
      <div className="flex-1 min-w-0 h-full bg-white px-6 sm:px-10 lg:px-12 py-6 sm:py-8 flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full max-w-[360px] space-y-4 sm:space-y-5">
          {/* Header */}
          <div className="text-center space-y-0.5">
            <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-gray-500 font-normal">
              Sign in to access your AssetOps workspace
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in duration-200">
              <AlertCircle className="size-4 shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          {/* React Hook Form with Icons */}
          <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field with Icon */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-gray-700 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Mail className="size-4" />
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...register('email')}
                  className={`h-9.5 pl-9.5 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus-visible:ring-2 ${errors.email
                    ? 'border-red-400 focus-visible:ring-red-400/20 focus-visible:border-red-500'
                    : 'border-gray-200 focus-visible:ring-[#4C40F7]/20 focus-visible:border-[#4C40F7]'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field with Icons */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Lock className="size-4" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className={`h-9.5 pl-9.5 pr-10 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus-visible:ring-2 ${errors.password
                    ? 'border-red-400 focus-visible:ring-red-400/20 focus-visible:border-red-500'
                    : 'border-gray-200 focus-visible:ring-[#4C40F7]/20 focus-visible:border-[#4C40F7]'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="size-3.5 rounded border-gray-300 text-[#4C40F7] focus:ring-[#4C40F7] accent-[#4C40F7]"
                />
                <span className="text-gray-700 text-xs">Remember me</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="text-[#4C40F7] hover:text-[#3B30E6] font-medium hover:underline text-xs"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button with Icon & State */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-[#4C40F7] hover:bg-[#3D31E5] text-white font-medium text-xs sm:text-sm rounded-lg shadow-md shadow-[#4C40F7]/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="size-3.5" />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </form>

          {/* Demo Accounts Box from Seed Data */}
          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 sm:p-3.5 text-xs space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
                Demo Accounts:
              </span>
              <span className="text-[10px] text-gray-400">Click to 1-click login</span>
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
                    title={`Click to login as ${account.role}`}
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
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
