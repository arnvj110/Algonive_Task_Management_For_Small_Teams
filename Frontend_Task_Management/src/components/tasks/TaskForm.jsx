import { useState, useEffect } from "react";
import api from "../../config/api";

const TaskForm = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    // Fetch team members from API
    const fetchMembers = async () => {
      try {
        const res = await api.get("/api/users/team"); // Adjust endpoint as needed
        
        setTeamMembers(res.data);
      } catch (err) {
        setTeamMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, status, dueDate, assignedTo });
    setTitle("");
    setDescription("");
    setStatus("pending");
    setDueDate("");
    setAssignedTo("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
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
            <label className="block mb-1 font-medium">Status</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Done</option>
            </select>
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