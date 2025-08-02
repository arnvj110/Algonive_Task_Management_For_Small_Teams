import { useTasks } from "../contexts/TasksContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleSuccess } from "../components/ui/toastFun";
import TaskDiv from "../components/tasks/TaskDiv";

const Dashboard = () => {
  // ✅ Now directly get the tasks array, not the query object
  const { myTasks, loading, myTasksLoading, myTasksError } = useTasks();
  
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showToast) {
      handleSuccess("Login Successful!");
      // Optional: clear the state after showing toast
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // ✅ Handle loading state properly
  if (loading || myTasksLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg text-gray-600">Loading your tasks...</div>
      </div>
    );
  }

  // ✅ Handle error state
  if (myTasksError) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg text-red-600">Error loading tasks: {myTasksError.message}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-center w-[85%] mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="text-sm text-gray-500">
          {myTasks.length} task{myTasks.length !== 1 ? 's' : ''} total
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-[85%] gap-4 p-4 mb-20">
        {myTasks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No tasks assigned to you.</p>
            <p className="text-gray-400 text-sm mt-2">Tasks will appear here when they're assigned to you.</p>
          </div>
        ) : (
          myTasks.map((task, index) => (
            <div
              key={task._id}
              className="opacity-0 translate-y-4 animate-[appear_0.4s_ease-in-out_forwards]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TaskDiv task={task} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;