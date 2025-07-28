import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold text-xl">
            TaskManager
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationBell />
          <span className="text-gray-700">{user?.username}</span>
          <button
            onClick={logout}
            className="text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;