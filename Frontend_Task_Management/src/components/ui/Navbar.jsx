import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { IoNotificationsOutline } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";
import Notifications from "../../pages/Notifications";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl">
      <div className="mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold text-[1.7rem]">
            Task Manager
          </Link>
        </div>
        <div className="flex items-center space-x-7 relative" ref={dropdownRef}>
          {/* Notification Icon */}
          <span
            onClick={() => setShowDropdown((prev) => !prev)}
            className="hover:scale-110 shadow-xl rounded-full p-2 bg-blue-500 cursor-pointer relative"
          >
            <IoNotificationsOutline size={20} />
          </span>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div className="absolute right-16 top-10 w-64 ">
              <Notifications />
            </div>
          )}

          <span className="font-bold capitalize">{user?.username}</span>
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
