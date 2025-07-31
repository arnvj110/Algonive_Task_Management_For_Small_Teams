import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const pages = {
    Dashboard: "/",
    Tasks: "/tasks",
    Notifications: "/notifications",
    Profile: "/profile",
    Team: "/team",
    invites: "/invites",
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-700 shadow-xl min-h-screen">
      <nav className="p-4 space-y-2">
        {Object.entries(pages).map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition-all duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-500 font-semibold dark:bg-gray-600 shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
