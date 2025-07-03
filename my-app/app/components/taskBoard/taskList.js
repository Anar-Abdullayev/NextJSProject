'use client'

import { Droppable } from '@hello-pangea/dnd';
import TaskItem from './taskItem';

export default function TaskList({ columnId, title, tasks }) {
  return (
    <section className="flex-1">
      <h3 className="mb-4 text-center text-lg font-bold text-gray-700">
        {title}
      </h3>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[200px] rounded-xl border border-dashed p-4
              ${snapshot.isDraggingOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
          >
            {tasks.map((task, idx) => (
              <TaskItem key={task.id} task={task} index={idx} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && (
              <p className="text-center text-sm text-gray-400">No tasks</p>
            )}
          </div>
        )}
      </Droppable>
    </section>
  );
}
