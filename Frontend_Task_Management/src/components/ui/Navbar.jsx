import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { IoNotificationsOutline } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";
import { useNotifications } from "../../hooks/useNotifications";
import { Menu, X } from "lucide-react";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl">
      <div className="mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo and Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo or App Title */}
          <div>
            {(!isMobile || sidebarOpen) ? (
              <h2 className="text-xl font-bold text-white whitespace-nowrap">
                Task Manager
              </h2>
            ) : (
              <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TM</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <NavLink to="/notifications" className="relative">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full hover:scale-110 transition-transform duration-200">
              <IoNotificationsOutline size={22} className="text-white" />
            </span>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </NavLink>

          {/* Profile */}
          <NavLink to="/profile" className="font-bold capitalize hover:underline">
            {user?.username}
          </NavLink>

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:scale-105 transition-transform font-semibold  cursor-pointer"
          >
            Logout
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
