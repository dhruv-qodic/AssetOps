import { Button } from '@/components/ui/button';
import { Layers, ShieldCheck, UserCheck, Eye } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

function Dashboard() {
  const { user } = useAuthStore();

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <ShieldCheck className="size-3.5" />
            Administrator (Full Access)
          </span>
        );
      case 'MANAGER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <UserCheck className="size-3.5" />
            Manager (Ops & Assets)
          </span>
        );
      case 'VIEWER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Eye className="size-3.5" />
            Viewer (Read Only)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-md">
          <Layers className="size-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AssetOps Dashboard</h1>
          <p className="text-xs text-muted-foreground">Smart Asset Management Platform</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-muted-foreground text-center max-w-md text-sm">
          Welcome back, <strong className="text-foreground font-semibold">{user?.name || 'User'}</strong>! You are logged in with role:
        </p>
        {getRoleBadge()}
      </div>

      <div className="flex gap-3">
        <Button variant="default">Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </div>
  );
}

export default Dashboard;