import { useState, useEffect } from "react";
import api from "../../config/api";
import { useTasks } from "../../contexts/TasksContext";
import { useMyTeam } from "../../hooks/useTeam";

const TaskForm = ({ onClose }) => {
  const {
    data: team,
    isLoading,
    error,
  } = useMyTeam();



  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [scaleIn, setScaleIn] = useState(false);

  const { createTask } = useTasks();

  useEffect(() => {
    setTimeout(() => setScaleIn(true), 10);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const fetchMembers = () => {

      setTeamMembers(team?.team?.members || []);
      setLoadingMembers(isLoading);
    };
    fetchMembers();
  }, [team, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({ title, description, status: "pending", dueDate, assignedTo, team: team?.team._id, priority: priority });
      onClose(); // close popup on success
    } catch (err) {
      console.error("Task creation failed:", err);
    }

    // Reset form (optional)
    setTitle("");
    setDescription("");

    setDueDate("");
    setAssignedTo("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 ">
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all duration-300 border border-blue-500 shadow-lg dark:shadow-blue-500 ${scaleIn ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Create Task
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
              Title
            </label>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Priority */}

          {/* Assign To */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
              Priority
            </label>

            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              
              {["Low","Medium", "High"].map((priorityOption) => (
                <option key={priorityOption} value={priorityOption}>
                  {priorityOption}
                </option>
              ))}
            </select>


          </div>

          {/* Due Date */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
              Due Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min={new Date().toISOString().split("T")[0]}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Assign To */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
              Assign To
            </label>
            {loadingMembers ? (
              <div className="text-gray-600 dark:text-gray-300">Loading team members...</div>
            ) : (
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
              >
                <option value="">Select a member</option>
                {teamMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.username || member.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default TaskForm;
