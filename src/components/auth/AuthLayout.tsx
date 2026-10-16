import React from 'react';
import { AuthHeroPanel } from './AuthHeroPanel';
import { AuthMobileHeader } from './AuthMobileHeader';
import { AuthErrorAlert } from './AuthErrorAlert';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  error?: string | null;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, error, children }) => {
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-white select-none">
      {/* Left Column: Branding & 3D Hero Panel (Desktop) */}
      <AuthHeroPanel />

      {/* Right Column: Form Container (Mobile & Desktop) */}
      <div className="flex-1 min-w-0 h-full bg-white px-6 sm:px-10 lg:px-12 py-6 sm:py-8 flex flex-col justify-center items-center overflow-y-auto">
        <div className="w-full max-w-[360px] sm:max-w-[380px] space-y-4 sm:space-y-5 my-auto py-4">
          {/* Mobile Branding Header */}
          <AuthMobileHeader />

          {/* Form Header */}
          <div className="text-center space-y-0.5">
            <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-gray-500 font-normal">{subtitle}</p>
          </div>

          {/* Error Alert */}
          <AuthErrorAlert error={error ?? null} />

          {/* Page Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
