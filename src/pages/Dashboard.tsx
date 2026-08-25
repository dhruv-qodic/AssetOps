import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

function Dashboard() {
    return (
        <>
            <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 gap-6">
                <div className="flex items-center gap-3">
                    <Layers className="size-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">AssetOps</h1>
                </div>
                <p className="text-muted-foreground text-center max-w-md">
                    shadcn is installed and configured successfully.
                </p>
                <div className="flex gap-3">
                    <Button variant="default">Get Started</Button>
                    <Button variant="outline">Learn More</Button>
                </div>
            </main>
        </>
    )
}

export default Dashboard;