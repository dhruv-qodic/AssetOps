import Navbar from '@/components/common/Navbar';
import Sidebar from '@/components/common/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

function Dashboardlayout() {
  return (
    <div className="flex h-screen min-h-screen w-full overflow-hidden bg-background text-foreground">
      <SidebarProvider className="flex h-full min-h-0 w-full">
        <Sidebar />

        <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
          <Navbar />

          <main className="flex min-w-0 min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-muted/20 focus:outline-none">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Dashboardlayout;
