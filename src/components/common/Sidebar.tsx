import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { usePermission } from '@/hooks/usePermission';
import { Separator } from '@/components/ui/separator';
import { useAssetStore } from '@/store/useAssetStore';
import AddAssetModal from '@/components/assets/AddAssetModal';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import AllocateAssetModal from '@/components/assets/AllocateAssetModal';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSkeleton,
  useSidebar,
} from '@/components/ui/sidebar';

import type { Permission } from '@/types/permissions';
import { EmployeeModal } from '@/components/employees/EmployeeModal';

type SidebarAction = 'add-asset' | 'edit-asset' | 'allocate-asset' | 'add-employee';

interface SidebarChild {
  name: string;
  path?: string;
  action?: SidebarAction;
  permission?: Permission;
}

interface SidebarItem {
  name: string;
  path: string;
  icon: LucideIcon;
  children?: SidebarChild[];
}

interface SidebarGroupType {
  label: string;
  items: SidebarItem[];
}

const sidebarGroups: SidebarGroupType[] = [
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
            permission: 'CREATE_ASSET',
          },
          {
            name: 'Allocate Asset',
            action: 'allocate-asset',
            permission: 'ALLOCATE_ASSET',
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
            permission: 'MANAGE_EMPLOYEES',
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
            permission: 'ALLOCATE_ASSET',
          },
          {
            name: 'Active Allocations',
            path: '/allocations/active',
            permission: 'ALLOCATE_ASSET',
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

export interface SidebarProps {
  isLoading?: boolean;
}

/**
 * @description: Application navigation sidebar supporting desktop collapsed/expanded modes, responsive mobile drawer, and role-based menu filtering
 * @param {SidebarProps} props: SidebarProps containing optional isLoading indicator
 * @return{JSX.Element}: React sidebar navigation element
 */
function Sidebar({ isLoading = false }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const openAddModal = useAssetStore((s) => s.openAddModal);
  const openAllocateModal = useAssetStore((s) => s.openAllocateModal);
  const openAddEmployeeModal = useEmployeeStore((s) => s.openAddModal);
  const { canAccessRoute, hasPermission } = usePermission();

  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const isCollapsed = isMobile ? false : state === 'collapsed';

  const { t: translateSidebar } = useTranslation('setting');
  const { t: translateAuth } = useTranslation('auth');

  const logoutLabel = translateSidebar('sidebar.logout', {
    defaultValue: translateSidebar('logout', { defaultValue: 'Logout' }),
  });

  const getGroupLabel = (label: string) => {
    switch (label) {
      case 'Main':
        return translateSidebar('sidebar.main');
      case 'Asset Management':
        return translateSidebar('sidebar.assetManagement');
      case 'Analytics':
        return translateSidebar('sidebar.analytics');
      case 'System':
        return translateSidebar('sidebar.system');
      default:
        return label;
    }
  };

  const getItemName = (name: string) => {
    switch (name) {
      case 'Dashboard':
        return translateSidebar('sidebar.dashboard');
      case 'Assets':
        return translateSidebar('sidebar.assets');
      case 'Employees':
        return translateSidebar('sidebar.employees');
      case 'Allocations':
        return translateSidebar('sidebar.allocations');
      case 'History':
        return translateSidebar('sidebar.history');
      case 'Reports':
        return translateSidebar('sidebar.reports');
      case 'Settings':
        return translateSidebar('sidebar.settings');
      default:
        return name;
    }
  };

  const getChildName = (name: string) => {
    switch (name) {
      case 'Add Asset':
        return translateSidebar('sidebar.addAsset');
      case 'Allocate Asset':
        return translateSidebar('sidebar.allocateAsset');
      case 'Add Employees':
      case 'Add Employee':
        return translateSidebar('sidebar.addEmployee');
      case 'New Allocation':
        return translateSidebar('sidebar.newAllocation');
      case 'Active Allocations':
        return translateSidebar('sidebar.activeAllocations');
      default:
        return name;
    }
  };

  const [desktopExpandedItems, setDesktopExpandedItems] = useState<Record<string, boolean>>({
    Assets: false,
    Employees: false,
    Allocations: false,
  });

  const [mobileExpandedItems, setMobileExpandedItems] = useState<Record<string, boolean>>({
    Assets: false,
    Employees: false,
    Allocations: false,
  });

  /**
   * @description: Close mobile sheet when location route changes
   */
  const prevPathnameRef = React.useRef(location.pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      setOpenMobile(false);
    }
  }, [location.pathname, setOpenMobile]);

  /**
   * @description: Handle ESC key for mobile sheet
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openMobile) {
        setOpenMobile(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openMobile, setOpenMobile]);

  /**
   * @description: Logs out the current user, closes mobile sidebar, and navigates to login
   * @return: void
   */
  const handleLogout = () => {
    logout();
    setOpenMobile(false);
    toast.success(translateAuth('toast.signedOut'));
    void navigate('/login');
  };

  /**
   * @description: Executes quick action modal triggers (e.g. Add Asset, Allocate Asset) if permitted
   * @param {SidebarAction} action: SidebarAction identifier
   * @param {Permission} permission: Permission required to perform the action
   * @return: void
   */
  const handleSubmenuAction = (action?: SidebarAction, permission?: Permission) => {
    if (!action) return;
    if (permission && !hasPermission(permission)) return;

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

  /**
   * @description: Checks whether a given navigation path matches the current active URL route
   * @param {string} path: Route URL path to compare against
   * @return {boolean}: Boolean true if path is currently active
   */
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  /**
   * @description: Toggles expansion state of accordion submenu items on desktop
   * @param {string} itemName: Name of the menu item to toggle
   * @return: void
   */
  const toggleDesktopItem = (itemName: string) => {
    setDesktopExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  /**
   * @description: Toggles expansion state of accordion submenu items on mobile drawer
   * @param {string} itemName: Name of the menu item to toggle
   * @return: void
   */
  const toggleMobileItem = (itemName: string) => {
    setMobileExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  /**
   * @description: Returns role-specific badge icon component based on current user role
   * @return: React element or null
   */
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

  if (isLoading) {
    return <SidebarSkeleton isCollapsed={isCollapsed} />;
  }

  return (
    <>
      <ShadcnSidebar collapsible="icon">
        {/* DESKTOP SIDEBAR CONTAINER */}
        <div className="hidden lg:flex flex-col h-full px-3 pt-6">
          {/* Top Logo Header */}
          <SidebarHeader className="p-0 mb-3 px-2">
            <div className="flex items-center justify-between">
              {!isCollapsed ? (
                <Link to="/" className="flex items-center gap-3 group min-w-0">
                  <div className="bg-sidebar-primary p-2.5 rounded-xl text-sidebar-primary-foreground shadow-md shadow-primary/30 group-hover:scale-105 transition-transform shrink-0">
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
                <SidebarMenuButton
                  tooltip="AssetOps Dashboard"
                  className="p-0 h-auto bg-transparent hover:bg-transparent"
                  render={
                    <Link to="/" className="flex items-center justify-center mx-auto">
                      <div className="bg-sidebar-primary p-2.5 rounded-xl text-sidebar-primary-foreground shadow-md shadow-primary/30">
                        <Layers className="size-5" />
                      </div>
                    </Link>
                  }
                />
              )}
            </div>
          </SidebarHeader>

          <Separator className="mb-3 bg-sidebar-border" />

          {/* DESKTOP NAVIGATION */}
          <SidebarContent className="space-y-4 flex-1 overflow-y-auto pr-0.5 scrollbar-none">
            {sidebarGroups.map((group) => {
              const accessibleItems = group.items.filter((item) => canAccessRoute(item.path));

              if (accessibleItems.length === 0) {
                return null;
              }

              return (
                <SidebarGroup key={group.label} className="p-0 space-y-1.5">
                  {/* Group Heading */}
                  {!isCollapsed && (
                    <SidebarGroupLabel className="px-3 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 h-auto">
                      {getGroupLabel(group.label)}
                    </SidebarGroupLabel>
                  )}

                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1.5">
                      {accessibleItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        const hasChildren =
                          'children' in item &&
                          Array.isArray(item.children) &&
                          item.children.length > 0;

                        const isExpanded = desktopExpandedItems[item.name] ?? false;

                        return (
                          <SidebarMenuItem
                            key={item.path}
                            className={isCollapsed ? 'flex justify-center w-full' : ''}
                          >
                            <SidebarMenuButton
                              isActive={active}
                              tooltip={getItemName(item.name)}
                              className={
                                active
                                  ? `p-0 h-auto bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground rounded-xl ${
                                      isCollapsed ? 'size-11 mx-auto justify-center' : ''
                                    }`
                                  : `p-0 h-auto bg-transparent hover:bg-sidebar-accent hover:text-white rounded-xl ${
                                      isCollapsed ? 'size-11 mx-auto justify-center' : ''
                                    }`
                              }
                              render={
                                <NavLink
                                  to={item.path}
                                  className={
                                    active
                                      ? `flex items-center ${
                                          isCollapsed
                                            ? 'justify-center size-11 p-0 mx-auto'
                                            : 'gap-3 px-3.5 py-3 w-full'
                                        } rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-semibold transition-all shadow-md shadow-sidebar-primary/25`
                                      : `flex items-center ${
                                          isCollapsed
                                            ? 'justify-center size-11 p-0 mx-auto'
                                            : 'gap-3 px-3.5 py-3 w-full'
                                        } rounded-xl text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent transition-all font-medium`
                                  }
                                >
                                  <Icon className="size-5 shrink-0" />

                                  {!isCollapsed && (
                                    <span className="text-sm truncate flex-1">
                                      {getItemName(item.name)}
                                    </span>
                                  )}
                                </NavLink>
                              }
                            />

                            {!isCollapsed && hasChildren && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleDesktopItem(item.name);
                                }}
                                className="absolute right-2.5 top-2.5 p-1 rounded-md hover:bg-white/10 cursor-pointer text-sidebar-foreground/70 hover:text-white z-10 transition-colors"
                                aria-label={
                                  isExpanded
                                    ? `Collapse ${getItemName(item.name)}`
                                    : `Expand ${getItemName(item.name)}`
                                }
                              >
                                {isExpanded ? (
                                  <ChevronDown className="size-4" />
                                ) : (
                                  <ChevronRight className="size-4" />
                                )}
                              </button>
                            )}

                            {/* SUBMENU - RBAC ENFORCED */}
                            {!isCollapsed && hasChildren && isExpanded && (
                              <SidebarMenuSub className="ml-8 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                                {item.children?.map((child: SidebarChild) => {
                                  const isAllowed = child.permission
                                    ? hasPermission(child.permission)
                                    : true;
                                  const isChildActive = child.path
                                    ? location.pathname === child.path
                                    : false;

                                  return (
                                    <SidebarMenuSubItem key={child.name}>
                                      <SidebarMenuSubButton
                                        type="button"
                                        isActive={isChildActive}
                                        disabled={!isAllowed}
                                        aria-disabled={!isAllowed}
                                        onClick={() => {
                                          if (!isAllowed) return;
                                          if (child.path) {
                                            void navigate(child.path);
                                          } else {
                                            handleSubmenuAction(child.action, child.permission);
                                          }
                                        }}
                                        className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                                          !isAllowed
                                            ? 'text-sidebar-foreground/30 opacity-50 cursor-not-allowed select-none'
                                            : isChildActive
                                              ? 'text-white bg-sidebar-accent font-semibold'
                                              : 'text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-accent cursor-pointer'
                                        }`}
                                      >
                                        <span>{getChildName(child.name)}</span>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            )}
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
          </SidebarContent>

          {/* Footer with Logout */}
          <SidebarFooter
            className={`pt-2 pb-2 border-t border-sidebar-border mt-auto ${
              isCollapsed ? 'flex items-center justify-center' : ''
            }`}
          >
            <SidebarMenuButton
              type="button"
              onClick={handleLogout}
              tooltip={logoutLabel}
              className={`h-auto w-full cursor-pointer rounded-xl text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10 transition-colors ${
                isCollapsed
                  ? 'justify-center size-11 p-0 mx-auto'
                  : 'justify-start gap-3 px-3.5 py-3'
              }`}
            >
              <LogOutIcon className="size-5 shrink-0" />

              {!isCollapsed && <span className="text-sm font-medium">{logoutLabel}</span>}
            </SidebarMenuButton>
          </SidebarFooter>
        </div>
      </ShadcnSidebar>

      {/* MOBILE RESPONSIVE DRAWER */}
      {openMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setOpenMobile(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border shadow-2xl z-50 flex flex-col h-full text-sidebar-foreground animate-in slide-in-from-left duration-300">
            <div className="flex flex-col h-full px-4 py-6">
              {/* Sheet Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                <Link
                  to="/"
                  onClick={() => setOpenMobile(false)}
                  className="flex items-center gap-3 group"
                >
                  <div className="bg-sidebar-primary p-2.5 rounded-xl text-sidebar-primary-foreground shadow-md shadow-primary/30">
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
                  onClick={() => setOpenMobile(false)}
                  className="p-2 text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent rounded-lg transition-colors cursor-pointer"
                  aria-label="Close mobile navigation"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* MOBILE NAVIGATION */}
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
                          {getGroupLabel(group.label)}
                        </span>
                      </div>

                      {accessibleItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        const hasChildren =
                          'children' in item &&
                          Array.isArray(item.children) &&
                          item.children.length > 0;

                        const isExpanded = mobileExpandedItems[item.name] ?? false;

                        return (
                          <div key={item.path}>
                            <div
                              className={
                                active
                                  ? 'flex items-center gap-3 px-3.5 py-3 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-semibold transition-all shadow-md shadow-sidebar-primary/25'
                                  : 'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent transition-colors font-medium'
                              }
                            >
                              {/* Existing navigation */}
                              <NavLink
                                to={item.path}
                                onClick={() => setOpenMobile(false)}
                                className="flex items-center gap-3 flex-1 min-w-0"
                              >
                                <Icon className="size-5 shrink-0" />

                                <span className="text-sm truncate">{getItemName(item.name)}</span>
                              </NavLink>

                              {/* Expand / Collapse */}
                              {hasChildren && (
                                <button
                                  type="button"
                                  onClick={() => toggleMobileItem(item.name)}
                                  className="p-1 rounded-md hover:bg-white/10 cursor-pointer shrink-0"
                                  aria-label={
                                    isExpanded
                                      ? `Collapse ${getItemName(item.name)}`
                                      : `Expand ${getItemName(item.name)}`
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

                            {/* MOBILE SUBMENU - RBAC ENFORCED */}
                            {hasChildren && isExpanded && (
                              <div className="ml-8 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                                {item.children?.map((child: SidebarChild) => {
                                  const isAllowed = child.permission
                                    ? hasPermission(child.permission)
                                    : true;

                                  return (
                                    <button
                                      key={child.name}
                                      type="button"
                                      disabled={!isAllowed}
                                      aria-disabled={!isAllowed}
                                      onClick={() => {
                                        if (!isAllowed) return;
                                        if (child.path) {
                                          void navigate(child.path);
                                        } else {
                                          handleSubmenuAction(child.action, child.permission);
                                        }
                                        setOpenMobile(false);
                                      }}
                                      className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                                        !isAllowed
                                          ? 'text-sidebar-foreground/30 opacity-50 cursor-not-allowed select-none'
                                          : child.path && location.pathname === child.path
                                            ? 'text-white bg-sidebar-accent font-semibold'
                                            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer'
                                      }`}
                                    >
                                      {getChildName(child.name)}
                                    </button>
                                  );
                                })}
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

                  <span className="text-sm font-medium">{logoutLabel}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddAssetModal />
      <EmployeeModal />
      <AllocateAssetModal />
    </>
  );
}

export { SidebarSkeleton };
export default Sidebar;
