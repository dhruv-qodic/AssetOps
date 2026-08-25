import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { Outlet } from "react-router-dom";

function Dashboardlayout() {
    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-muted/20 focus:outline-none">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default Dashboardlayout;


