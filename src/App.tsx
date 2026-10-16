import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from '@/components/ui/sonner';
import { useThemeStore } from '@/store/useThemeStore';

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
