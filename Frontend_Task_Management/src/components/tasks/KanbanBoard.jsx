import React, { useState } from "react";

const KanbanBoard = ({ tasks = [] }) => {
  const [selectedStatus, setSelectedStatus] = useState("pending");

  const statusLabels = {
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
  };

  // Group tasks by status
  const columns = {
    pending: [],
    inProgress: [],
    completed: [],
  };

  tasks.forEach(task => {
    if (task.status === "in-progress") columns.inProgress.push(task);
    else if (task.status === "completed") columns.completed.push(task);
    else columns.pending.push(task);
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Status Tabs */}
      <div className="flex justify-center gap-4">
        {Object.keys(columns).map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full font-semibold transition cursor-pointer  ${
              selectedStatus === status
                ? "bg-blue-600 text-white scale-110"
                : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
            }`}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Tasks under selected status */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded shadow-md max-w-2xl mx-auto w-full">
        <h3 className="text-xl font-bold mb-3">
          {statusLabels[selectedStatus]}
        </h3>
        {columns[selectedStatus].length === 0 ? (
          <p className="text-gray-500">No tasks</p>
        ) : (
          columns[selectedStatus].map(task => (
            <div
              key={task._id}
              className="mb-2 p-3 border rounded bg-gray-50 dark:bg-gray-800"
            >
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
