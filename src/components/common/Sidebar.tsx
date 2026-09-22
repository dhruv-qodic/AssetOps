import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  History,
  Layers,
  LayoutDashboard,
  LogOutIcon,
  Settings,
  ShieldCheck,
  UserCheck,
  Eye,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { usePermission } from '@/hooks/usePermission';
import { Separator } from '../ui/separator';
import { useAssetStore } from '@/store/useAssetStore';
import AddAssetModal from '../assets/AddAssetModal';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import AddEmployeeModal from '../employees/AddEmployeeModal';
import AllocateAssetModal from '../assets/AllocateAssetModal';

/**
 * ============================================================================
 * SIDEBAR NAVIGATION CONFIGURATION
 * ============================================================================
 *
 * Phase 1:
 * - Groups are only for UI organization.
 * - Submenu items are UI-only.
 * - Submenu items do NOT navigate anywhere yet.
 *
 * Existing main navigation paths are preserved.
 */

type SidebarAction = 'add-asset' | 'edit-asset' | 'allocate-asset' | 'add-employee';

interface SidebarChild {
  name: string;
  action?: SidebarAction;
}

interface SidebarItem {
  name: string;
  path: string;
  icon: LucideIcon;
  children?: SidebarChild[];
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: 'Main',
    items: [
      {
        name: 'Dashboard',
        path: '/',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Asset Management',
    items: [
      {
        name: 'Assets',
        path: '/assets',
        icon: Building2,
        children: [
          {
            name: 'Add Asset',
            action: 'add-asset',
          },
          {
            name: 'Allocate Asset',
            action: 'allocate-asset',
          },
        ],
      },
      {
        name: 'Employees',
        path: '/employees',
        icon: UserCheck,
        children: [
          {
            name: 'Add Employees',
            action: 'add-employee',
          },
        ],
      },
      {
        name: 'Allocations',
        path: '/allocations',
        icon: CheckCircle2,
        children: [
          {
            name: 'New Allocation',
            action: 'allocate-asset',
          },
          {
            name: 'Active Allocations',
            // to be implemented
          },
        ],
      },
    ],
  },
  {
    label: 'Analytics',
    items: [
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
    ],
  },
  {
    label: 'System',
    items: [
      {
        name: 'Settings',
        path: '/settings',
        icon: Settings,
      },
    ],
  },
];

/**
 * Reusable Tooltip component for collapsed sidebar items on hover.
 */
function SidebarTooltip({
  label,
  show,
  children,
}: {
  label: string;
  show: boolean;
  children: React.ReactNode;
}) {
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
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const openAddModal = useAssetStore((s) => s.openAddModal);
  const openAllocateModal = useAssetStore((s) => s.openAllocateModal);
  const openAddEmployeeModal = useEmployeeStore((s) => s.openAddModal);

  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const { canAccessRoute } = usePermission();

  /**
   * Phase 1:
   * Stores only which parent menu items are expanded.
   */
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Assets: false,
    Employees: false,
    Allocations: false,
  });

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
    void navigate('/login');
  };

  const handleSubmenuAction = (action?: SidebarAction) => {
    if (!action) return;

    switch (action) {
      case 'add-asset':
        openAddModal();
        break;

      case 'add-employee':
        openAddEmployeeModal();
        break;

      case 'allocate-asset':
        openAllocateModal();
        break;

      default:
        break;
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleItem = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

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
      {/* DESKTOP SIDEBAR */}
      <div
        className={`hidden lg:flex flex-col h-full shrink-0 select-none bg-sidebar border-r border-sidebar-border text-sidebar-foreground transition-all duration-300 relative ${
          isCollapsed ? 'w-20' : 'w-64'
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

          {/* ===================================================================== */}
          {/* DESKTOP NAVIGATION                                                    */}
          {/* ===================================================================== */}

          <nav className="space-y-4 flex-1 overflow-y-auto pr-0.5 scrollbar-none">
            {sidebarGroups.map((group) => {
              const accessibleItems = group.items.filter((item) => canAccessRoute(item.path));

              if (accessibleItems.length === 0) {
                return null;
              }

              return (
                <div key={group.label} className="space-y-1.5">
                  {/* Group Heading */}
                  {!isCollapsed && (
                    <div className="px-3 pt-1 pb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                        {group.label}
                      </span>
                    </div>
                  )}

                  {accessibleItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    const hasChildren =
                      'children' in item &&
                      Array.isArray(item.children) &&
                      item.children.length > 0;

                    const isExpanded = expandedItems[item.name] ?? false;

                    /**
                     * Parent navigation item.
                     *
                     * IMPORTANT:
                     * Existing main navigation still uses NavLink.
                     * Submenu items are only UI at this stage.
                     */
                    const navLinkElement = (
                      <NavLink
                        to={item.path}
                        className={
                          active
                            ? `flex items-center ${
                                isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                              } rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-semibold transition-all shadow-md shadow-indigo-600/25`
                            : `flex items-center ${
                                isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                              } rounded-xl text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors font-medium`
                        }
                      >
                        <Icon className="size-5 shrink-0" />

                        {!isCollapsed && (
                          <>
                            <span className="text-sm truncate flex-1">{item.name}</span>

                            {hasChildren && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleItem(item.name);
                                }}
                                className="p-0.5 rounded-md hover:bg-white/10 cursor-pointer"
                                aria-label={
                                  isExpanded ? `Collapse ${item.name}` : `Expand ${item.name}`
                                }
                              >
                                {isExpanded ? (
                                  <ChevronDown className="size-4" />
                                ) : (
                                  <ChevronRight className="size-4" />
                                )}
                              </button>
                            )}
                          </>
                        )}
                      </NavLink>
                    );

                    return (
                      <div key={item.path}>
                        <SidebarTooltip label={item.name} show={isCollapsed}>
                          {navLinkElement}
                        </SidebarTooltip>

                        {/* ===================================================== */}
                        {/* SUBMENU - UI ONLY                                      */}
                        {/* ===================================================== */}

                        {!isCollapsed && hasChildren && isExpanded && (
                          <div className="ml-8 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                            {item.children?.map((child: SidebarChild) => (
                              <button
                                key={child.name}
                                type="button"
                                onClick={() => handleSubmenuAction(child.action)}
                                className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left cursor-pointer"
                              >
                                <span>{child.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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
                className={`w-full ${
                  isCollapsed ? 'justify-center px-0 py-3' : 'justify-start px-3 py-2.5 gap-3'
                } flex items-center rounded-xl text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer`}
              >
                <LogOutIcon className="size-5 shrink-0" />

                {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
              </Button>
            </SidebarTooltip>
          </div>
        </div>
      </div>

      {/* MOBILE RESPONSIVE SHEET */}
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

              {/* =============================================================== */}
              {/* MOBILE NAVIGATION                                               */}
              {/* =============================================================== */}

              <nav className="space-y-4 flex-1 overflow-y-auto pr-1">
                {sidebarGroups.map((group) => {
                  const accessibleItems = group.items.filter((item) => canAccessRoute(item.path));

                  if (accessibleItems.length === 0) {
                    return null;
                  }

                  return (
                    <div key={group.label} className="space-y-1.5">
                      {/* Group Heading */}
                      <div className="px-3 pt-1 pb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                          {group.label}
                        </span>
                      </div>

                      {accessibleItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        const hasChildren =
                          'children' in item &&
                          Array.isArray(item.children) &&
                          item.children.length > 0;

                        const isExpanded = expandedItems[item.name] ?? false;

                        return (
                          <div key={item.path}>
                            <div
                              className={
                                active
                                  ? 'flex items-center gap-3 px-3.5 py-3 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-semibold transition-all shadow-md shadow-indigo-600/25'
                                  : 'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors font-medium'
                              }
                            >
                              {/* Existing navigation */}
                              <NavLink
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 flex-1 min-w-0"
                              >
                                <Icon className="size-5 shrink-0" />

                                <span className="text-sm truncate">{item.name}</span>
                              </NavLink>

                              {/* Expand / Collapse */}
                              {hasChildren && (
                                <button
                                  type="button"
                                  onClick={() => toggleItem(item.name)}
                                  className="p-1 rounded-md hover:bg-white/10 cursor-pointer shrink-0"
                                  aria-label={
                                    isExpanded ? `Collapse ${item.name}` : `Expand ${item.name}`
                                  }
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="size-4" />
                                  ) : (
                                    <ChevronRight className="size-4" />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* ================================================= */}
                            {/* MOBILE SUBMENU - UI ONLY                         */}
                            {/* ================================================= */}

                            {hasChildren && isExpanded && (
                              <div className="ml-8 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                                {item.children?.map((child: SidebarChild) => (
                                  <button
                                    key={child.name}
                                    type="button"
                                    onClick={() => {
                                      handleSubmenuAction(child.action);
                                      setMobileOpen(false);
                                    }}
                                    className="w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left cursor-pointer"
                                  >
                                    {child.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
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

      <AddAssetModal />
      <AddEmployeeModal />
      <AllocateAssetModal />
    </>
  );
}

export default Sidebar;
