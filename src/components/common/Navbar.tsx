import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import UserDropdown from './UserDropdown';
import { useSidebarStore } from '@/store/useSidebarStore';

function Navbar() {
  const { isCollapsed, toggleMobile, toggleCollapse } = useSidebarStore();

  return (
    <header className="sticky top-0 z-40 bg-navbar border-b border-navbar-border h-16 flex items-center justify-between px-6 shrink-0 select-none transition-colors shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button to trigger Sheet Drawer */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={toggleMobile}
            className="p-2 rounded-lg hover:bg-blue-100/70 text-slate-700 dark:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle mobile menu drawer"
          >
            <Menu className="size-5" />
          </button>
        </div>

        {/* Desktop Sidebar Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden lg:flex items-center justify-center p-2 text-slate-600 hover:text-primary hover:bg-blue-100/70 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
          <h1 className="text-xl font-bold tracking-tight text-navbar-foreground">AssetOps Overview</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Avatar Dropdown with User Details and Login/Logout Buttons */}
        <UserDropdown />
      </div>
    </header>
  );
}

export default Navbar;