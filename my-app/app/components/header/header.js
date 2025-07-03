'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const projectName = 'Task Management'
    const [data, setData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const jsonData = JSON.parse(localStorage.getItem('MyData'));
        setData(jsonData);
    }, [])
    if (!data)
        return <p>Error</p>
    const handleLogout = async () => {
        await fetch('/api/logout', { method: "POST" });
        router.push("/login");
    };

    const inTeam = data.teamId

    const handleCreateTeam = async () => {
        const res = await fetch('/api/team', { method: 'POST' });
        if (res.ok) {
            const updatedData = { ...data, teamId: 1 };
            setData(updatedData);
        }
    };

    return (
        <header className="bg-white shadow-md">
            <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold tracking-tight text-indigo-600 select-none">
                        {projectName}
                    </span>
                    <ul className="ms-24 text-black flex gap-3">
                        <Link href={`/home`}>Home</Link>
                        { inTeam && <Link href={`/team/members`}>Manage team</Link>}
                    </ul>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="hidden sm:inline text-gray-600">Welcome,</span>
                    <span className="font-medium text-gray-900 truncate max-w-[140px] sm:max-w-none">
                        {data.name + ' ' + data.surname}
                    </span>

                    {!inTeam && (
                        <button
                            onClick={handleCreateTeam}
                            className="rounded-lg border border-indigo-600 px-3 py-1.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Create Team
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
                        className="cursor-pointer rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}