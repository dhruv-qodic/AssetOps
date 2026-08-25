import {
  Building2,
  CheckCircle2,
  History,
  Layers,
  LayoutDashboard,
  LogOutIcon,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/button';

const navItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Employees',
    path: '/employees',
    icon: Users,
  },
  {
    name: 'Assets',
    path: '/assets',
    icon: Building2,
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
];

function Sidebar() {
  return (
    <>
      <aside className="w-64 border-r border-border bg-sidebar">
        <div className="h-full px-4 py-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="bg-primary p-2 rounded-lg">
              <Layers className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold">AssetOps</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  <Icon className="size-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <Button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
              <LogOutIcon className="size-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
