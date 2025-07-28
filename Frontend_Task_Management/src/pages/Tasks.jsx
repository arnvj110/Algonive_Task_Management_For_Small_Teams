import { useState } from "react";
import TaskForm from "../components/tasks/TaskForm";
import KanbanBoard from "../components/tasks/KanbanBoard";
import { useTasks } from "../contexts/TasksContext";

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const { teamTasks, loading, createTask } = useTasks();

  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Task
        </button>
      </div>

      {showForm && (
        <TaskForm onClose={() => setShowForm(false)} onSubmit={handleCreateTask} />
      )}

      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <KanbanBoard tasks={teamTasks} />
       
      )}
    </div>
  );
};

export default Tasks;
