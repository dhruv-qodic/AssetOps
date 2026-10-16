import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AuthErrorAlertProps {
  error: string | null;
}

export const AuthErrorAlert: React.FC<AuthErrorAlertProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in duration-200">
      <AlertCircle className="size-4 shrink-0 text-red-500" />
      <span>{error}</span>
    </div>
  );
};
