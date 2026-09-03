import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export default function UnauthorizedPage() {
  const { user } = useAuthStore();

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6 shadow-sm">
        <ShieldAlert className="size-8" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-2">Access Restricted</h1>
      <p className="text-muted-foreground max-w-md mb-4 text-sm sm:text-base">
        Your current role (<span className="font-semibold text-foreground uppercase tracking-wide">{user?.role || 'User'}</span>) does not have permission to view or manage this module.
      </p>

      <div className="p-4 bg-muted/40 rounded-xl border border-border text-xs text-muted-foreground max-w-sm mb-6 text-left space-y-1">
        <p className="font-medium text-foreground">Need access?</p>
        <p>Please contact your System Administrator to request elevated permissions for your account ({user?.email}).</p>
      </div>

      <Link to="/">
        <Button variant="default" className="flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <span>Back to Dashboard</span>
        </Button>
      </Link>
    </div>
  );
}
