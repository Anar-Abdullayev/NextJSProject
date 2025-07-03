'use client';

import { ShowToast } from '@/lib/toastify';
import { useState } from 'react';

export default function AddUserForm() {
    const [username, setUsername] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;
        setSending(true);

        try {
            const res = await fetch('/api/team/members', {
                method: "POST",
                body: JSON.stringify(username),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            if (res.ok)
                setUsername('');
            else
                throw data;
        } catch (error) {
            ShowToast(error.error, 'red', 3000)
        }
        finally {
            setSending(false)
        }

    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
            />
            <button
                type="submit"
                disabled={!username.trim() || sending}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                   transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
                {sending ? 'Inviting…' : 'Invite'}
            </button>
        </form>
    );
}
