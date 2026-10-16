import { ArrowLeft, Home, PackageSearch } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { NOT_FOUND_PAGE_CONSTANTS } from './constants/NotFoundPage.constants';

function NotFoundPage() {
  const navigate = useNavigate();
  const { t: translateSetting } = useTranslation('setting');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-2xl border border-[#18243c] bg-[#090f25] p-8 text-center shadow-2xl sm:p-12">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

          {/* Icon */}
          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
            <PackageSearch className="h-8 w-8 text-blue-400" />
          </div>

          {/* 404 */}
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
            {translateSetting('common.pageNotFoundOverline')}
          </p>

          <h1 className="text-6xl font-bold tracking-tight text-white sm:text-7xl">
            {NOT_FOUND_PAGE_CONSTANTS.STATUS_CODE}
          </h1>

          <h2 className="mt-4 text-xl font-semibold text-white/90">
            {translateSetting('common.pageNotFoundTitle')}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            {translateSetting('common.pageNotFoundDesc')}
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer rounded-md"
              onClick={() => {
                void navigate(-1);
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {translateSetting('common.goBack')}
            </Button>

            <Link to={NOT_FOUND_PAGE_CONSTANTS.DASHBOARD_PATH}>
              <Button
                type="button"
                className="w-full cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 sm:w-auto"
              >
                <Home className="mr-2 h-4 w-4" />
                {translateSetting('common.backToDashboard')}
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-white/5 pt-5">
            <p className="text-xs text-muted-foreground">{NOT_FOUND_PAGE_CONSTANTS.FOOTER_TEXT}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
