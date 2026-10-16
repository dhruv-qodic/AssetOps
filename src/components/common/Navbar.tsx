import { useTranslation } from 'react-i18next';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import UserDropdown from '@/components/common/UserDropdown';
import NotificationDropdown from '@/components/common/NotificationDropdown';
import ThemeDropdown from '@/components/common/ThemeDropdown';
import { useSidebar } from '@/components/ui/sidebar';

/**
 * @description: Navbar component for the top header containing sidebar toggles, title, notifications, and user profile
 * @return: React navbar header component
 */
function Navbar() {
  const { state, toggleSidebar, setOpenMobile } = useSidebar();
  const { t: translateDashboard } = useTranslation('dashboard');

  const isCollapsed = state === 'collapsed';

  return (
    <header className="sticky top-0 z-40 bg-navbar border-b border-navbar-border h-16 flex items-center justify-between px-6 shrink-0 select-none transition-colors shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button to trigger Sheet Drawer */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setOpenMobile((open) => !open)}
            className="p-2 rounded-lg hover:bg-primary/10 text-slate-700 dark:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle mobile menu drawer"
          >
            <Menu className="size-5" />
          </button>
        </div>

        {/* Desktop Sidebar Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center p-2 text-slate-600 hover:text-primary hover:bg-primary/10 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </button>

        <div className="hidden lg:block">
          <h1 className="text-xl font-bold tracking-tight text-navbar-foreground">
            {translateDashboard('subtitle')}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeDropdown />

        <div className="h-6 w-px bg-navbar-border shrink-0" aria-hidden="true" />

        <NotificationDropdown />

        <div className="h-6 w-px bg-navbar-border shrink-0" aria-hidden="true" />

        <UserDropdown />
      </div>
    </header>
  );
}

export default Navbar;
