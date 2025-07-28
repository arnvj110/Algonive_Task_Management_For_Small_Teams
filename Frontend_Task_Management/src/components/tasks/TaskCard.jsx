const TaskCard = ({ task }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            task.priority === "high"
              ? "bg-red-100 text-red-800"
              : task.priority === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {task.priority}
        </span>
      </div>
      <p className="text-gray-600 mt-2">{task.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            task.status === "completed"
              ? "bg-green-100 text-green-800"
              : task.status === "in-progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {task.status}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;