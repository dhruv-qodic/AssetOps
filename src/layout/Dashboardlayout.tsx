import Navbar from '@/components/common/Navbar';
import Sidebar from '@/components/common/Sidebar';
import { Outlet } from 'react-router-dom';

function Dashboardlayout() {
  return (
    <div className="flex h-full w-full bg-background text-foreground overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 min-h-0 overflow-y-auto bg-muted/20 focus:outline-none flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboardlayout;
