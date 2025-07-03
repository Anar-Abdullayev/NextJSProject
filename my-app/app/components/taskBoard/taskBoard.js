'use client'

import { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskList from './taskList';

const initialData = {
  TODO: [],
  IN_PROGRESS: [],
  DONE: [],
};

export default function TaskBoard() {
  const [columns, setColumns] = useState(initialData);
  useEffect(() => {
    async function fetchMyTasks() {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        let taskData = { TODO: [], IN_PROGRESS: [], DONE: [] };
        if (!data.error)
          data.forEach(element => {
            if (element.status === 'TODO')
              taskData.TODO.push(element);
            else if (element.status === 'IN_PROGRESS')
              taskData.IN_PROGRESS.push(element);
            else if (element.status === 'DONE')
              taskData.DONE.push(element);
          });
        setColumns(taskData);
      } catch (error) {
        console.log(error);
      }
    }

    fetchMyTasks();

  }, [])
  const handleDragEnd = (result) => {
    const { destination, source } = result;
    console.log('source', source, 'destination', destination)
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const startCol = columns[source.droppableId];
    const endCol = columns[destination.droppableId];

    if (startCol === endCol) {
      const newTasks = Array.from(startCol);
      const [moved] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, moved);

      setColumns((prev) => ({ ...prev, [source.droppableId]: newTasks }));
      return;
    }

    const startTasks = Array.from(startCol);
    let [moved] = startTasks.splice(source.index, 1);
    const endTasks = Array.from(endCol);
    const newStatus = destination.droppableId;
    moved.status = newStatus;

    fetch('/api/tasks', { method: "PUT", body: JSON.stringify(moved), headers: { 'Content-Type': 'application/json' } })
    endTasks.splice(destination.index, 0, moved);
    setColumns((prev) => ({
      ...prev,
      [source.droppableId]: startTasks,
      [destination.droppableId]: endTasks,
    }));
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-6 md:grid-cols-3">
        <TaskList columnId="TODO" title="Todo" tasks={columns.TODO} />
        <TaskList columnId="IN_PROGRESS" title="Under Review" tasks={columns.IN_PROGRESS} />
        <TaskList columnId="DONE" title="Completed" tasks={columns.DONE} />
      </div>
    </DragDropContext>
  );
}
