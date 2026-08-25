import { Menu } from "lucide-react";

function Navbar() {
    return (
        <>
            <header className="bg-background border-b border-border h-16 flex items-center justify-between px-6">
                <div className="lg:hidden">
                    <button className="p-2 rounded-md hover:bg-sidebar-accent">
                        <Menu className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:block">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-sidebar overflow-hidden">
                            {/* Placeholder for user avatar */}
                            <img
                                src="https://api.dicebear.com/6.x/avataaars/svg?seed=Felix"
                                alt="Avatar"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-sm font-medium">Dhruv Faldu</div>
                            <div className="text-xs text-muted-foreground">Admin</div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
export default Navbar;