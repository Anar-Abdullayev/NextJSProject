'use client'

import { ShowToast } from "@/lib/toastify";
import { useState, useEffect } from "react";

export default function AddTaskForm({ onCreated, onCancel }) {
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "TODO",
        dueDate: "",
        assigneeId: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("/api/team/members");
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                ShowToast(err, 'red', 3000)
                setError("Could not load users");
            } finally {
                setLoadingUsers(false);
            }
        }
        fetchUsers();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.title.trim()) {
            setError("Title is required");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                title: form.title.trim(),
                description: form.description.trim() || null,
                status: form.status,
                dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
                assigneeId: form.assigneeId ? Number(form.assigneeId) : null
            };
              const res = await fetch("/api/team/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              });
              if (!res.ok) throw new Error("Failed to create task");
              const created = await res.json();
              if (onCreated) onCreated(created);

            setForm({ title: "", description: "", status: "TODO", dueDate: "", assigneeId: "" });
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 bg-white shadow-xl rounded-2xl space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="title">Title<span className="text-red-500">*</span></label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                    >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="dueDate">Due Date</label>
                    <input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={form.dueDate}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="assigneeId">Assign To</label>
                {loadingUsers ? (
                    <p className="text-sm text-gray-500">Loading team members…</p>
                ) : (
                    <select
                        id="assigneeId"
                        name="assigneeId"
                        value={form.assigneeId}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                    >
                        <option value="">— Unassigned —</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>{`${u.name} ${u.surname}`}</option>
                        ))}
                    </select>
                )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end space-x-2">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border">Cancel</button>
                )}
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
                >
                    {submitting ? "Creating…" : "Create Task"}
                </button>
            </div>
        </form>
    );
}
