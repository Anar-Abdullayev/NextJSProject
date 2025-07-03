'use client';

export default function TaskList({
  title,
  tasks = [],
  emptyText = 'No tasks',
  onDelete,
  onTake
}) {

  const handleDelete = (task) => {
    if (onDelete)
      onDelete(task);
  }
  const handleTake = (task) =>{
    if (onTake)
      onTake(task);
  }
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>

      <div className="space-y-4">
        {tasks.length ? (
          tasks.map(task => {
            const isAssigned = Boolean(task.assignee);
            return (
              <article
                key={task.id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <header className="flex items-center justify-between">
                  <h3 className="font-medium">{task.title}</h3>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide
                      ${isAssigned
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-pink-100 text-pink-700'}`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                    {
                      !isAssigned && 
                      <div className="flex gap-2 items-center">
                        <button className="rounded-md text-white bg-red-500 px-2" onClick={(e) => handleDelete(task) }>Del</button>
                        <button className="rounded-md text-white bg-green-500 px-2" onClick={(e) => handleTake(task)}>Take</button>
                      </div>
                    }
                  </div>
                </header>

                {task.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {task.description}
                  </p>
                )}

                {isAssigned ? (
                  <footer className="mt-4 text-sm text-gray-500">
                    {task.assignee.name} {task.assignee.surname}
                  </footer>
                ) : task.dueDate ? (
                  <p className="mt-3 text-xs text-gray-400">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                ) : null}
              </article>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">{emptyText}</p>
        )}
      </div>
    </section>
  );
}