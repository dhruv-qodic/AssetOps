import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email, password);
    }

    return (
        <>
            <div className="flex item-cent justify-center m-5 p-5">
                <div className="border border-border rounded-lg p-6 w-100">
                    <h1 className="text-2xl font-bold mb-4">Login</h1>
                    <form className="space-y-4 " onSubmit={handleLogin}>
                        <Input value={email} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        <Input value={password} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        <Button type="submit">Login</Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginPage;
