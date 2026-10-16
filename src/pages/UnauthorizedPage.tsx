import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { UNAUTHORIZED_PAGE_CONSTANTS } from './constants/UnauthorizedPage.constants';

export default function UnauthorizedPage() {
  const { user } = useAuthStore();
  const { t: translateSetting } = useTranslation('setting');

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6 shadow-sm">
        <ShieldAlert className="size-8" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {translateSetting('common.accessRestricted')}
      </h1>
      <p className="text-muted-foreground max-w-md mb-4 text-sm sm:text-base">
        Your current role (
        <span className="font-semibold text-foreground uppercase tracking-wide">
          {user?.role || UNAUTHORIZED_PAGE_CONSTANTS.DEFAULT_ROLE}
        </span>
        {') '}
        {translateSetting('common.accessRestrictedDesc')}
      </p>

      <div className="p-4 bg-muted/40 rounded-xl border border-border text-xs text-muted-foreground max-w-sm mb-6 text-left space-y-1">
        <p className="font-medium text-foreground">{translateSetting('common.needAccessTitle')}</p>
        <p>
          {translateSetting('common.contactAdmin')} ({user?.email}).
        </p>
      </div>

      <Link to={UNAUTHORIZED_PAGE_CONSTANTS.DASHBOARD_PATH}>
        <Button variant="default" className="flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <span>{translateSetting('common.backToDashboard')}</span>
        </Button>
      </Link>
    </div>
  );
}
