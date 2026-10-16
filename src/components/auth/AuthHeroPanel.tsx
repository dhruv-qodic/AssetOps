import React from 'react';
import { Layers, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AUTH_BRANDING, AUTH_FEATURES, AUTH_LIVE_STATUS } from '@/constant/auth.constants';

export const AuthHeroPanel: React.FC = () => {
  const { t: translateAuth } = useTranslation('auth');

  const featureKeys = [
    'features.trackAssets',
    'features.allocateAssets',
    'features.monitorLifecycle',
    'features.realtimeInsights',
  ];

  return (
    <div className="hidden md:flex flex-1 min-w-0 h-full bg-[#080E24] text-white px-6 sm:px-10 lg:px-14 py-6 sm:py-8 flex-col justify-between relative overflow-hidden">
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
              {translateAuth('branding.appName', { defaultValue: AUTH_BRANDING.APP_NAME })}
            </span>
          </div>

          {/* Slogan */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-white leading-tight tracking-tight">
              {translateAuth('branding.sloganLine1', { defaultValue: AUTH_BRANDING.SLOGAN_LINE_1 })}
              <br />
              {translateAuth('branding.sloganLine2', { defaultValue: AUTH_BRANDING.SLOGAN_LINE_2 })}
            </h2>

            {/* Feature Points */}
            <ul className="space-y-2">
              {AUTH_FEATURES.map((feat, idx) => (
                <li
                  key={feat}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 font-normal"
                >
                  <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <span className="truncate">
                    {translateAuth(featureKeys[idx] || '', { defaultValue: feat })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hero Visualization Card */}
        <div className="flex-1 flex items-center justify-center mt-6">
          <div className="relative w-full max-w-[380px] p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-white/90">
                  {translateAuth('liveStatus.title', { defaultValue: AUTH_LIVE_STATUS.TITLE })}
                </span>
              </div>
              <span className="text-[11px] font-mono text-indigo-200 bg-indigo-500/30 px-2 py-0.5 rounded-full border border-indigo-400/30">
                {translateAuth('liveStatus.activeAssets', {
                  defaultValue: AUTH_LIVE_STATUS.ACTIVE_ASSETS,
                })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex flex-col gap-1">
                <span className="text-[11px] text-white/70">
                  {translateAuth('liveStatus.healthLabel', {
                    defaultValue: AUTH_LIVE_STATUS.HEALTH_LABEL,
                  })}
                </span>
                <span className="text-sm font-bold text-white">
                  {translateAuth('liveStatus.healthValue', {
                    defaultValue: AUTH_LIVE_STATUS.HEALTH_VALUE,
                  })}
                </span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex flex-col gap-1">
                <span className="text-[11px] text-white/70">
                  {translateAuth('liveStatus.speedLabel', {
                    defaultValue: AUTH_LIVE_STATUS.SPEED_LABEL,
                  })}
                </span>
                <span className="text-sm font-bold text-emerald-300">
                  {translateAuth('liveStatus.speedValue', {
                    defaultValue: AUTH_LIVE_STATUS.SPEED_VALUE,
                  })}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-white/15 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span className="font-medium">
                  {translateAuth('liveStatus.securityLabel', {
                    defaultValue: AUTH_LIVE_STATUS.SECURITY_LABEL,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
