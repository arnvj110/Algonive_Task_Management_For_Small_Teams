import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Error from "../components/ui/Error";
import { handleSuccess } from "../components/ui/toastFun";

const Profile = () => {
  const { user, updateUser, deleteUser } = useAuth();
  

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateUser(formData);
      
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    setError("");
    setDeleting(true);
    try {
      await deleteUser();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="border-b dark:border-gray-700 px-6 pt-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-1 my-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-blue-500  text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-300 dark:hover:text-gray-500 hover:text-gray-700     cursor-pointer"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("danger")}
              className={`py-1 my-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "danger"
                  ? "border-blue-500  text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-300 dark:hover:text-gray-500 hover:text-gray-700     cursor-pointer"
              }`}
            >
              Danger Zone
            </button>
          </nav>
        </div>

        {activeTab === "profile" && (
          <form onSubmit={handleSubmit} className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h1>

            {error && <Error message={error} />}

            <div className="mb-4">
              <label htmlFor="username" className="block text-md font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md px-3 py-3 "
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-md font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md px-3 py-3 "
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all ease-in-out"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {activeTab === "danger" && (
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Deleting your account will permanently remove your data. This action cannot be undone.
            </p>

            {error && <Error message={error} />}

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer transition-all ease-in-out hover:scale-105"
            >
              {deleting ? "Deleting..." : "Delete My Account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
