import { useState } from "react";
import TaskForm from "../components/tasks/TaskForm";
import TaskDiv from "../components/tasks/TaskDiv";
import { useTasks } from "../contexts/TasksContext";

// Define status labels
const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed"
};

const Tasks = () => {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [showForm, setShowForm] = useState(false);
  const { teamTasks, loading, createTask } = useTasks();

  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
    setShowForm(false);
  };

  const filteredTasks = teamTasks.filter((task) => task.status === selectedStatus);

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex  sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Team Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all ease-in-out cursor-pointer hover:scale-105 shadow-xl text-sm sm:text-base"
        >
          Create Task
        </button>
      </div>

      {/* Task Form */}
      {showForm && (
        <TaskForm onClose={() => setShowForm(false)} onSubmit={handleCreateTask} />
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-500">Loading tasks...</div>
      ) : (
        <div className="flex flex-col">
          {/* Status Tabs */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
            {Object.keys(statusLabels).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full font-semibold transition cursor-pointer text-sm sm:text-base ${
                  selectedStatus === status
                    ? "bg-blue-600 text-white scale-110"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>

          {/* Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500 mt-4 w-full py-4">
              No tasks in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="opacity-0 translate-y-4 animate-[appear_0.4s_ease-in-out_forwards]"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <TaskDiv task={task} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
