import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Building2,
  CheckCircle2,
  History,
  Layers,
  LayoutDashboard,
  LogOutIcon,
  Settings,
  ShieldCheck,
  UserCheck,
  Eye,
  X,
} from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { usePermission } from '@/hooks/usePermission';
import { Separator } from '../ui/separator';

const allNavItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Assets',
    path: '/assets',
    icon: Building2,
  },
  {
    name: 'Employees',
    path: '/employees',
    icon: UserCheck,
  },
  {
    name: 'Allocations',
    path: '/allocations',
    icon: CheckCircle2,
  },
  {
    name: 'History',
    path: '/history',
    icon: History,
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: BarChart,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];

/**
 * Reusable Tooltip component for collapsed sidebar items on hover.
 */
function SidebarTooltip({ label, show, children }: { label: string; show: boolean; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!show) return <>{children}</>;

  return (
    <div
      className="relative flex items-center justify-center w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="absolute left-full ml-3.5 px-3 py-1.5 bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 animate-in fade-in zoom-in-95 pointer-events-none flex items-center gap-1">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900 dark:border-r-zinc-100" />
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebarStore();
  const { canAccessRoute } = usePermission();

  // Close mobile sheet when location route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  // Handle ESC key for mobile sheet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, setMobileOpen]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Filter navigation items based on usePermission().canAccessRoute(path)
  const accessibleNavItems = allNavItems.filter((item) => canAccessRoute(item.path));

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <ShieldCheck className="size-3.5 text-purple-400" />;
      case 'MANAGER':
        return <UserCheck className="size-3.5 text-blue-400" />;
      case 'VIEWER':
        return <Eye className="size-3.5 text-emerald-400" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR (DIV Container replacing aside tag)                        */}
      {/* ========================================================================= */}
      <div
        className={`hidden lg:flex flex-col h-full shrink-0 select-none bg-sidebar border-r border-sidebar-border text-sidebar-foreground transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        <div className="flex flex-col h-full px-3 py-6">
          {/* Top Logo Header */}
          <div className="flex items-center justify-between mb-3 px-2">
            {!isCollapsed ? (
              <Link to="/" className="flex items-center gap-3 group min-w-0">
                <div className="bg-sidebar-primary p-2.5 rounded-xl text-sidebar-primary-foreground shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform shrink-0">
                  <Layers className="size-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xl font-bold tracking-tight block leading-none text-white truncate">
                    AssetOps
                  </span>
                  <span className="text-[11px] text-sidebar-foreground/70 font-medium flex items-center gap-1 mt-1 truncate">
                    {getRoleIcon()}
                    <span className="truncate">{user?.role || 'Guest'}</span>
                  </span>
                </div>
              </Link>
            ) : (
              <SidebarTooltip label="AssetOps Dashboard" show={isCollapsed}>
                <Link to="/" className="flex items-center justify-center mx-auto">
                  <div className="bg-sidebar-primary p-2.5 rounded-xl text-sidebar-primary-foreground shadow-md shadow-indigo-600/30">
                    <Layers className="size-5" />
                  </div>
                </Link>
              </SidebarTooltip>
            )}
          </div>

          <Separator className="mb-3 bg-sidebar-border" />

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1 overflow-y-auto pr-0.5 scrollbar-none">
            {accessibleNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              const navLinkElement = (
                <NavLink
                  to={item.path}
                  className={
                    active
                      ? `flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                      } rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-semibold transition-all shadow-md shadow-indigo-600/25`
                      : `flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                      } rounded-xl text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors font-medium`
                  }
                >
                  <Icon className="size-5 shrink-0" />
                  {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}
                </NavLink>
              );

              return (
                <SidebarTooltip key={item.path} label={item.name} show={isCollapsed}>
                  {navLinkElement}
                </SidebarTooltip>
              );
            })}
          </nav>

          {/* Footer with Logout */}
          <div className="pt-4 border-t border-sidebar-border mt-auto">
            <SidebarTooltip label="Logout" show={isCollapsed}>
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogout}
                className={`w-full ${isCollapsed ? 'justify-center px-0 py-3' : 'justify-start px-3 py-2.5 gap-3'
                  } flex items-center rounded-xl text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer`}
              >
                <LogOutIcon className="size-5 shrink-0" />
                {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
              </Button>
            </SidebarTooltip>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE RESPONSIVE SHEET (DRAWER)                                          */}
      {/* ========================================================================= */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sheet Content Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border shadow-2xl z-50 flex flex-col h-full text-sidebar-foreground animate-in slide-in-from-left duration-300">
            <div className="flex flex-col h-full px-4 py-6">
              {/* Sheet Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 group"
                >
                  <div className="bg-sidebar-primary p-2.5 rounded-xl text-sidebar-primary-foreground shadow-md shadow-indigo-600/30">
                    <Layers className="size-5" />
                  </div>
                  <div>
                    <span className="text-xl font-bold tracking-tight block leading-none text-white">
                      AssetOps
                    </span>
                    <span className="text-[11px] text-sidebar-foreground/70 font-medium flex items-center gap-1 mt-1">
                      {getRoleIcon()}
                      {user?.role || 'Guest'}
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent rounded-lg transition-colors cursor-pointer"
                  aria-label="Close mobile navigation"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Sheet Navigation Links */}
              <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                {accessibleNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={
                        active
                          ? 'flex items-center gap-3 px-3.5 py-3 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-semibold transition-all shadow-md shadow-indigo-600/25'
                          : 'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors font-medium'
                      }
                    >
                      <Icon className="size-5" />
                      <span className="text-sm">{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <Separator className="bg-sidebar-border" />

              {/* Sheet Footer Logout */}
              <div className="pt-4 ml-3 border-t border-sidebar-border mt-auto">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start flex items-center gap-3 px-5 py-4 rounded-xl text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <LogOutIcon className="size-5" />
                  <span className="text-sm font-medium">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
