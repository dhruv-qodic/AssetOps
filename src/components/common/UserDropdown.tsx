import { useState, useRef, useEffect } from 'react';
import {
  LogOut,
  LogIn,
  ShieldCheck,
  UserCheck,
  Eye,
  Mail,
  Fingerprint,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function UserDropdown() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const handleLoginAsDifferent = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const getRoleConfig = () => {
    switch (user.role) {
      case 'ADMIN':
        return {
          title: 'Administrator',
          color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          badgeGradient: 'from-purple-600 to-indigo-600',
          icon: ShieldCheck,
          description: 'Full administrative control over all modules & settings',
          modules: ['Dashboard', 'Assets', 'Employees', 'Allocations', 'History', 'Reports', 'Settings'],
        };
      case 'MANAGER':
        return {
          title: 'Manager',
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          badgeGradient: 'from-blue-600 to-cyan-600',
          icon: UserCheck,
          description: 'Operational management of assets, employees & maintenance',
          modules: ['Dashboard', 'Assets', 'Employees', 'Allocations', 'History'],
        };
      case 'VIEWER':
        return {
          title: 'Viewer',
          color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          badgeGradient: 'from-emerald-600 to-teal-600',
          icon: Eye,
          description: 'Read-only access to view dashboard, assets & history logs',
          modules: ['Dashboard', 'Assets', 'History'],
        };
    }
  };

  const roleConfig = getRoleConfig();
  const RoleIcon = roleConfig.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-muted/60 transition-all cursor-pointer group text-left focus:outline-hidden"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        <div className="text-right hidden sm:block">
          <div className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {user.name}
          </div>
          <div className="mt-0.5">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.2 rounded-full border ${roleConfig.color}`}
            >
              <RoleIcon className="size-2.5" />
              {user.role}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="size-9 rounded-full bg-sidebar border border-border overflow-hidden ring-2 ring-primary/15 group-hover:ring-primary transition-all shadow-xs">
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
              }
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 border-2 border-background rounded-full" />
        </div>

        <ChevronDown
          className={`size-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200 hidden sm:block ${isOpen ? 'rotate-180 text-foreground' : ''
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-background border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
          {/* Header with Avatar & Details */}
          <div className="p-4 bg-muted/30 border-b border-border">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="size-12 rounded-xl bg-background border border-border overflow-hidden p-0.5 shadow-sm">
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                    }
                    alt={user.name}
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 border-2 border-background rounded-full" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-foreground truncate">{user.name}</h3>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
                <div className="mt-1.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleConfig.color}`}
                  >
                    <RoleIcon className="size-3" />
                    {roleConfig.title}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Details Section */}
          <div className="p-3.5 space-y-2.5 text-xs bg-background">
            <div className="flex items-center justify-between text-muted-foreground py-0.5">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="size-3.5" /> User ID
              </span>
              <span className="font-mono text-foreground font-medium text-[11px] bg-muted/60 px-1.5 py-0.5 rounded">
                {user.id}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground py-0.5">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500" /> Account Status
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                Active
              </span>
            </div>

            {/* Modules / Permissions */}
            <div className="pt-1">
              <span className="text-muted-foreground font-medium flex items-center gap-1 mb-1.5">
                <Sparkles className="size-3 text-amber-500" /> Role Permissions ({roleConfig.modules.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {roleConfig.modules.map((mod) => (
                  <span
                    key={mod}
                    className="px-2 py-0.5 bg-muted/60 text-foreground text-[10.5px] rounded-md font-medium border border-border/50"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions: Login & Logout Buttons */}
          <div className="p-2 bg-muted/20 border-t border-border space-y-1">
            <button
              type="button"
              onClick={handleLoginAsDifferent}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer text-left"
            >
              <LogIn className="size-4 text-primary" />
              <span>Login as Different User</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer text-left"
            >
              <LogOut className="size-4" />
              <span>Sign Out / Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
