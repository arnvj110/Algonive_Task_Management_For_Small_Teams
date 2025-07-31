import { useAuth } from "../contexts/AuthContext";
import Navbar from "./ui/Navbar";
import Sidebar from "./ui/Sidebar";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      
      
        {/* Navbar */}
        <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-screen flex ">

        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 tasks-scrollbar bg-gray-100 dark:bg-gray-800 dark:text-white">
          {children}
        </main>
          </div>
        
        
      </div>
      
    </div>
  );
};

export default Layout;