import React from 'react';
import { Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AUTH_BRANDING } from '@/constant/auth.constants';

export const AuthMobileHeader: React.FC = () => {
  const { t: translateAuth } = useTranslation('auth');

  return (
    <div className="flex md:hidden items-center gap-2.5 justify-center mb-1">
      <div className="flex size-9 items-center justify-center rounded-xl bg-[#080E24] text-white shadow-sm">
        <Layers className="size-4.5" />
      </div>
      <span className="text-xl font-bold tracking-tight text-gray-900">
        {translateAuth('branding.appName', { defaultValue: AUTH_BRANDING.APP_NAME })}
      </span>
    </div>
  );
};
