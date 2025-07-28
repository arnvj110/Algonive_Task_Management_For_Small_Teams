import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-sm">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              Notifications
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;