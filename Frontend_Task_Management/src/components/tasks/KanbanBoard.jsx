import React from "react";

const KanbanBoard = ({ tasks = [] }) => {
  // Group tasks by status
  const columns = {
    pending: [],
    inProgress: [],
    done: [],
  };

  tasks.forEach(task => {
    
    if (task.status === "in-progress") columns.inProgress.push(task);
    else if (task.status === "completed") columns.done.push(task);
    else columns.pending.push(task);
  });

  return (
    <div className="flex gap-4">
      {Object.entries(columns).map(([status, tasks]) => (
        <div key={status} className="bg-white p-4 rounded shadow flex-1">
          <h3 className="font-semibold mb-2 capitalize">{status.replace(/([A-Z])/g, ' $1')}</h3>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} className="mb-2 p-2 border rounded">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
