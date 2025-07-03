'use client'

import { Draggable } from '@hello-pangea/dnd';

export default function TaskItem({ task, index }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition
            ${snapshot.isDragging ? 'ring-2 ring-indigo-400' : ''}`}
        >
          <h4 className="font-semibold text-gray-800">{task.title}</h4>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500">{task.description}</p>
          )}
        </div>
      )}
    </Draggable>
  );
}
