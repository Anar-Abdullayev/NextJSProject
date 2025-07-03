'use client'

import { ShowToast } from "@/lib/toastify";

export default function MemberCard({ m, onRemove }) {
    const handleRemoveMember = async () => {
        try {
            const res = await fetch('/api/team/members', {
                method: "DELETE",
                body: JSON.stringify(m),
                headers: { 'Content-Type': 'application/json' }
            })
            if (!res.ok)
            {
                const data = await res.json();
                throw data;
            }
        } catch (error) {
            ShowToast(error.error, 'red', 3000);
        }
    }
    return (
        <article
            className="rounded-2xl shadow-md p-5 bg-white dark:bg-gray-900 transition hover:shadow-lg"
        >
            <header className="mb-2">
                <h2 className="text-xl font-semibold text-white leading-tight">
                    {m.name} {m.surname}
                </h2>
                <p className="text-gray-300">{m.username}</p>
            </header>
            <button className="text-white bg-red-500 px-2 py-1 rounded-2xl cursor-pointer hover:bg-red-700" onClick={handleRemoveMember}>Remove</button>
        </article>
    )
}