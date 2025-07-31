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
      await createTask({ title, description, status:"pending", dueDate, assignedTo, team: team?.team._id });
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div
        className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all duration-300 ${
          scaleIn ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Create Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Title</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Due Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Assign To</label>
            {loadingMembers ? (
              <div>Loading team members...</div>
            ) : (
              <select
                className="w-full border rounded px-3 py-2"
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
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
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
