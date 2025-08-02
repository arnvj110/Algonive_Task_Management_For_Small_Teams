
import { useState, useEffect } from "react";
import { Menu, Home, CheckSquare, Bell, Users, Mail, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname);
  // Check screen size and update mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    setActiveItem(location.pathname);
  },[location.pathname])

  const pages = [
    { label: "Dashboard", path: "/", icon: Home },
    { label: "Tasks", path: "/tasks", icon: CheckSquare },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Team", path: "/team", icon: Users },
    { label: "Invites", path: "/invites", icon: Mail },
    { label: "Profile", path: "/profile", icon: User },
  ];

  // Handle navigation click
  const handleLinkClick = (path) => {
    setActiveItem(path);
    if (isMobile && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
  <div 
    className="fixed inset-0 backdrop-blur-sm bg-black/40 z-40 md:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}


      {/* Sidebar */}
      <aside 
        className={`
          ${isMobile ? 'fixed' : 'relative'} 
          ${isMobile ? 'z-50' : 'z-10'}
          bg-white dark:bg-gray-700 shadow-xl h-screen flex-shrink-0
          transition-all duration-300 ease-in-out
          ${sidebarOpen 
            ? 'w-64' 
            : isMobile 
              ? '-translate-x-full w-64' 
              : 'w-16 overflow-hidden'
          }
          ${isMobile ? 'top-0 left-0' : ''}
        `}
      >
        {/* Header */}
        
        {!isMobile && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-500 ">
            <button
              onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
              className={`w-full flex items-center rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer ${
                sidebarOpen ? 'px-3 py-2 justify-start' : 'px-0 py-2 justify-center'
              }`}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <div className={`flex items-center justify-center ${sidebarOpen ? 'w-5 h-5' : 'w-full'}`}>
                <Menu size={18} className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
              </div>
              {sidebarOpen && <span className="ml-3 text-sm whitespace-nowrap">Collapse</span>}
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar">
          {pages.map(({ label, path, icon: Icon }) => {
            const isActive = activeItem === path;
            return (
              <NavLink key={path} to={path} >
              <button
                key={path}
                onClick={() => handleLinkClick(path)}
                className={`w-full flex items-center rounded-lg transition-all duration-200 group relative text-left cursor-pointer ${
                  sidebarOpen 
                    ? 'px-3 py-3' 
                    : 'px-0 py-3 justify-center'
                } ${
                  isActive
                    ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold dark:from-purple-900 dark:to-blue-900 dark:text-purple-300 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-purple-700 dark:hover:text-purple-300"
                }`}
              >
                {/* Icon Container */}
                <div className={`flex items-center justify-center flex-shrink-0 ${sidebarOpen ? 'w-5 h-5' : 'w-full'}`}>
                  <Icon size={20} />
                </div>
                
                {/* Label - positioned relative to icon */}
                {sidebarOpen && (
                  <span className="ml-3 whitespace-nowrap transition-all duration-300 relative">
                    {label}
                  </span>
                )}

                
                
              </button>
              </NavLink>
            );
          })}
        </nav>

        
        
      </aside>
    </>
  );
};

export default Sidebar;