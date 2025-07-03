'use client';

import CustomModal from '@/app/components/modals/Modal';
import AddTaskForm from '@/app/components/taskList/addTaskForm';
import TaskList from '@/app/components/taskList/taskList';
import { useEffect, useState } from 'react';

export default function TaskBoard() {
    const [tasks, setTasks] = useState([]);
    const [isShow, setIsShow] = useState(false);
    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/team/tasks');
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        }

        fetchData();
    }, []);


    if (!tasks)
        return <p>No tasks found</p>

    const seperateTasks = () => {
        return {
            assigned: tasks.filter(t => t.assignee),
            unassigned: tasks.filter(t => !t.assignee),
        };
    }

    const { assigned, unassigned } = seperateTasks()
    const handleCreatedTask = (createdTask) => {
        console.log('created task', createdTask)
        if (createdTask) {
            const updatedTasks = [createdTask, ...tasks]
            setTasks(updatedTasks);
            setIsShow(false);
        }
    }

    const handleDeleteTask = async (task) => {
        const res = await fetch('/api/team/tasks', {
            method: "DELETE",
            body: JSON.stringify(task),
            headers: { 'Content-Type': 'application/json' }
        })

        if (res.ok) {
            const updatedTasks = tasks.filter(t => t.id !== task.id);
            setTasks(updatedTasks);
        }
    }

    const handleTakeTask = async (task) => {
        console.log(task);
        const res = await fetch(`/api/team/tasks/${task.id}`);
        if (res.ok) {
            const res = await fetch('/api/team/tasks');
            const newData = await res.json();
            setTasks(newData);
        }
    }

    return (
        <div>
            <button className='bg-blue-400 rounded-xl px-2 py-1 mb-5 hover:bg-blue-500 cursor-pointer'
                onClick={() => setIsShow(true)}>Add Task</button>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <TaskList
                    title="Active tasks (assigned)"
                    tasks={assigned}
                    emptyText="No active assigned tasks"
                />

                <TaskList
                    title="Unassigned active tasks"
                    tasks={unassigned}
                    emptyText="No unassigned tasks"
                    onDelete={handleDeleteTask}
                    onTake={handleTakeTask}
                />
            </div>

            {
                isShow &&
                <CustomModal isOpen={isShow} onCancel={() => setIsShow(false)} title={"New Task"}>
                    <AddTaskForm onCancel={() => setIsShow(false)} onCreated={handleCreatedTask} />
                </CustomModal>
            }
        </div>
    );
}