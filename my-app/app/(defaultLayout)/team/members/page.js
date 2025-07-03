'use client'

import AddUserForm from "@/app/components/members/addUserForm";
import MemberCard from "@/app/components/members/memberCard";
import CustomModal from "@/app/components/modals/Modal";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TeamMembers() {
    const [isShow, setIsShow] = useState(false)
    const { data: members, error, isLoading, mutate } = useSWR('/api/team/members', fetcher);
    if (isLoading) return <MembersSkeleton />
    if (error) return <p>Site got some errors</p>



    return (
        <div className="px-6 py-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-5 mb-6">
                <h1 className="text-2xl font-bold">Team Members</h1>
                <button className="rounded bg-blue-500 px-3 py-1 hover:bg-blue-300" onClick={() => setIsShow(true)}>Add member</button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {members?.length ? (
                    members.map((m) => (
                        <MemberCard key={m.id} m={m} onRemove={() => mutate(members.filter(member => member.id !== m.id))} />
                    ))
                ) : (
                    <p>No members have joined this team yet.</p>
                )}
            </div>
            {
                isShow && <CustomModal onCancel={() => setIsShow(false)} isOpen={isShow} title={'Add user'}>
                    <AddUserForm/>
                </CustomModal>
            }
        </div>
    );
}


function MembersSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-6" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-32 bg-gray-300 dark:bg-gray-700 rounded-2xl"
                    />
                ))}
            </div>
        </div>
    );
}