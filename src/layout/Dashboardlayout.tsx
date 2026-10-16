import Navbar from '@/components/common/Navbar';
import Sidebar from '@/components/common/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SuspenseLoader } from '@/components/common/SuspenseLoader';
import { ErrorFallback } from '@/components/common/ErrorFallback';

/**
 * @description: Core application dashboard layout container integrating collapsible Sidebar, sticky Navbar, and error/suspense-wrapped main view outlet
 * @returns {JSX.Element} React dashboard layout element
 */
function Dashboardlayout() {
  return (
    <div className="flex h-screen min-h-screen w-full overflow-hidden bg-background text-foreground">
      <SidebarProvider className="flex h-full min-h-0 w-full">
        <Sidebar />

        <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
          <Navbar />

          <main className="flex min-w-0 min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-muted/20 focus:outline-none">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<SuspenseLoader message="Loading content..." />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Dashboardlayout;
