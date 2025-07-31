import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { IoNotificationsOutline } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";
import { useNotifications } from "../../hooks/useNotifications";

const Navbar = () => {
  const { user, logout } = useAuth();

  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl">
      <div className="mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold text-[1.7rem]">
            Task Manager
          </Link>
        </div>

        <div className="flex items-center space-x-7">
          {/* Notification Icon */}
          <NavLink to="/notifications">
            <span className="relative inline-flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full shadow-xl hover:scale-110 transition-transform duration-200">
  <IoNotificationsOutline size={22} className="text-white" />
  {unreadCount > 0 && (
    <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-600 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</span>

          </NavLink>

            <NavLink to={'/profile'}>
          <span className="font-bold capitalize hover:underline">
              {user?.username}
              </span>
              </NavLink>
          <button
            onClick={logout}
            className="text-gray-600 bg-red-500 p-2 text-white rounded-md transition duration-300 ease-in-out cursor-pointer hover:scale-105 font-semibold shadow-xl"
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
