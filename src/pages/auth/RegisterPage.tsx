import { useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  User,
  ShieldCheck,
  UserCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuthStore } from '@/store/useAuthStore';
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const features = [
  'Track & manage company assets',
  'Allocate assets to employees',
  'Monitor asset lifecycle & history',
  'Get real-time insights',
];

const ROLE_OPTIONS = [
  {
    label: 'Admin (Full System Control)',
    value: 'ADMIN',
    icon: <ShieldCheck className="size-3.5 text-purple-500 shrink-0" />,
  },
  {
    label: 'Manager (Assets & Employees)',
    value: 'MANAGER',
    icon: <UserCheck className="size-3.5 text-blue-500 shrink-0" />,
  },
  {
    label: 'Viewer (Read-Only Access)',
    value: 'VIEWER',
    icon: <Eye className="size-3.5 text-emerald-500 shrink-0" />,
  },
];

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { register: registerUser, isLoading, error: authError, clearError } = useAuthStore();
  const navigate = useNavigate();

  // React Hook Form with Zod schema resolver
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'VIEWER',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    const result = await registerUser(data);

    if (!result.success) {
      toast.error('Registration Failed', {
        description: result.error || 'Unable to complete registration. Please try again.',
      });
      return;
    }

    toast.success('Account created successfully!', {
      description: `Welcome aboard, ${data.name}! Please sign in to access your workspace.`,
    });

    void navigate('/login', {
      replace: true,
      state: { registeredEmail: data.email },
    });
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden flex flex-row bg-white select-none">
      {/* Left Column: Branding & 3D Isometric Visual (Exactly 50%, zero scroll) */}
      <div className="flex-1 min-w-0 h-full bg-[#080E24] text-white px-6 sm:px-10 lg:px-14 py-6 sm:py-8 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute -top-20 -left-20 size-80 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 size-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-[440px] mx-auto mt-10 flex flex-col justify-between h-full">
          {/* Top Branding Section */}
          <div className="space-y-3 flex justify-center items-center flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-white-600 to-black-500 text-white shadow-lg shadow-indigo-500/40">
                <Layers />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">AssetOps</span>
            </div>

            {/* Slogan */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl lg:text-[24px] font-bold text-white leading-tight tracking-tight">
                Enterprise Asset Operations
                <br />
                Platform
              </h2>

              {/* Feature Points */}
              <ul className="space-y-1.5 pt-1">
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

          {/* Prominent 3D Tech & Role Highlights Hero Visualization */}
          <div className="flex-1 flex items-center justify-center mt-4">
            <div className="relative w-full max-w-[380px] p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-blue-400 animate-ping" />
                  <span className="text-xs font-semibold text-white/90">Role-Based Access</span>
                </div>
                <span className="text-[11px] font-mono text-indigo-200 bg-indigo-500/30 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  Granular RBAC
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-white/90 font-medium">
                    <ShieldCheck className="size-4 text-purple-400" />
                    Admin
                  </span>
                  <span className="text-[11px] text-white/60">Full administrative rights</span>
                </div>
                <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-white/90 font-medium">
                    <UserCheck className="size-4 text-blue-400" />
                    Manager
                  </span>
                  <span className="text-[11px] text-white/60">Asset & staff operations</span>
                </div>
                <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-white/90 font-medium">
                    <Eye className="size-4 text-emerald-400" />
                    Viewer
                  </span>
                  <span className="text-[11px] text-white/60">Inventory & audit visibility</span>
                </div>
              </div>

              <div className="p-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/15 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-300" />
                  <span className="font-medium text-[11px]">Instant workspace provisioning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Form (Exactly 50%, zero scroll) */}
      <div className="flex-1 min-w-0 h-full bg-white px-6 sm:px-10 lg:px-12 py-6 sm:py-8 flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full max-w-[360px] space-y-4">
          {/* Header */}
          <div className="text-center space-y-0.5">
            <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs text-gray-500 font-normal">
              Register a new user to access AssetOps workspace
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in duration-200 text-left">
              <AlertCircle className="size-4 shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          {/* React Hook Form with Icons */}
          <form
            className="space-y-3"
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
            noValidate
          >
            {/* Full Name */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-gray-700 block">Full Name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <User className="size-4" />
                </div>
                <Input
                  type="text"
                  placeholder="Enter your full name"
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

            {/* Email Field with Icon */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-gray-700 block">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Mail className="size-4" />
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
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

            {/* Password Field with Icons */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-gray-700 block">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Lock className="size-4" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password (min. 6 chars)"
                  {...register('password')}
                  className={`h-9.5 pl-9.5 pr-10 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus-visible:ring-2 ${
                    errors.password
                      ? 'border-red-400 focus-visible:ring-red-400/20 focus-visible:border-red-500'
                      : 'border-gray-200 focus-visible:ring-[#155DFC]/20 focus-visible:border-[#155DFC]'
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
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Role Field - Custom Asset Dropdown style */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-gray-700 block">Role</label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={ROLE_OPTIONS}
                    placeholder="Select your role"
                  />
                )}
              />
              {errors.role && (
                <p className="text-[11px] text-red-600 font-medium">{errors.role.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-1 bg-[#155DFC] hover:bg-[#1047C7] text-white font-medium text-xs sm:text-sm rounded-lg shadow-md shadow-[#155DFC]/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-2 text-center text-xs text-gray-600">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-semibold text-[#155DFC] hover:text-[#1047C7] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
