import { useTasks } from "../contexts/TasksContext";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleSuccess } from "../components/ui/toastFun";
import TaskDiv from "../components/tasks/TaskDiv";

const Dashboard = () => {
  const { myTasks, loading } = useTasks();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showToast) {
      handleSuccess("Login Successful!");
      // Optional: clear the state after showing toast
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className=" flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-[85%] gap-4 p-4 ">
        {myTasks.length === 0 ? (
          <p>No tasks assigned to you.</p>
        ) : (
          myTasks.map((task) => 
          
          <TaskDiv key={task._id} task={task} />
        )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
