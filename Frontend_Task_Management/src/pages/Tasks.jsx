import { useState } from "react";
import TaskForm from "../components/tasks/TaskForm";
import TaskDiv from "../components/tasks/TaskDiv";
import { useTasks } from "../contexts/TasksContext";

// Define status labels
const statusLabels = {
  pending: "Pending",
  inprogress: "In Progress",
  completed: "Completed"
};

const Tasks = () => {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [showForm, setShowForm] = useState(false);
  
  // ✅ Now directly get the tasks array, not the query object
  const { teamTasks, loading, teamTasksLoading, teamTasksError, createTask } = useTasks();

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating task:", error);
      // You can add error toast here
    }
  };

  // ✅ Filter tasks from the actual array
  const filteredTasks = teamTasks.filter((task) => task.status === selectedStatus);

  // ✅ Handle loading state properly
  if (loading || teamTasksLoading) {
    return (
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 max-w-screen-2xl mx-auto">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-lg text-gray-600">Loading team tasks...</div>
        </div>
      </div>
    );
  }

  // ✅ Handle error state
  if (teamTasksError) {
    return (
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 max-w-screen-2xl mx-auto">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-lg text-red-600">Error loading tasks: {teamTasksError.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Team Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {teamTasks.length} task{teamTasks.length !== 1 ? 's' : ''} total
          </p>
        </div>
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

      <div className="flex flex-col">
        {/* Status Tabs */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
          {Object.keys(statusLabels).map((status) => {
            const statusCount = teamTasks.filter(task => task.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full font-semibold transition cursor-pointer flex items-center text-sm sm:text-base relative  ${
                  selectedStatus === status
                    ? "bg-blue-600 text-white scale-110"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
                }`}
              >
                {statusLabels[status]}
                {statusCount > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs border border-blue-500 ${
                    selectedStatus === status 
                      ? "bg-white/20 text-white" 
                      : "bg-blue-100 text-blue-600 "
                  }`}>
                    {statusCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">
              No {statusLabels[selectedStatus].toLowerCase()} tasks found.
            </p>
            <p className="text-gray-400 text-sm">
              {selectedStatus === 'pending' 
                ? 'Create a new task to get started!' 
                : `Switch to another tab to see ${statusLabels[selectedStatus].toLowerCase()} tasks.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {filteredTasks.map((task, index) => (
              <div
                key={task._id}
                className="opacity-0 translate-y-4 animate-[appear_0.4s_ease-in-out_forwards]"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <TaskDiv task={task} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;