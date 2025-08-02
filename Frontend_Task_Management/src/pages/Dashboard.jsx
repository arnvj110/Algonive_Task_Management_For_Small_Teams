import { useTasks } from "../contexts/TasksContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleSuccess } from "../components/ui/toastFun";
import TaskDiv from "../components/tasks/TaskDiv";

const Dashboard = () => {
  const { myTasks, loading, myTasksLoading, myTasksError } = useTasks();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showToast) {
      handleSuccess("Login Successful!");
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // ✅ Handle loading state properly
  if (loading || myTasksLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg text-gray-600">Loading your dashboard...</div>
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

  // Calculate task statistics
  const completedTasks = myTasks.filter(task => task.status === 'completed' || task.completed);
  const overdueTasks = myTasks.filter(task => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== 'completed' && !task.completed;
  });
  const todayTasks = myTasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date().toDateString();
    return new Date(task.dueDate).toDateString() === today;
  });
  const highPriorityTasks = myTasks.filter(task => task.priority === 'high' && task.status !== 'completed' && !task.completed);

  return (
    <div className="flex flex-col items-center">
      {/* Dashboard Header with Quick Stats */}
      <div className="w-[85%] mb-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{myTasks.length}</div>
            <div className="text-sm text-blue-700">Total Tasks</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">{todayTasks.length}</div>
            <div className="text-sm text-yellow-700">Due Today</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
            <div className="text-sm text-red-700">Overdue</div>
          </div>
        </div>

        {/* Priority Alerts */}
        {(overdueTasks.length > 0 || highPriorityTasks.length > 0) && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Attention needed:</span>
                  {overdueTasks.length > 0 && ` ${overdueTasks.length} overdue task${overdueTasks.length !== 1 ? 's' : ''}`}
                  {overdueTasks.length > 0 && highPriorityTasks.length > 0 && ', '}
                  {highPriorityTasks.length > 0 && ` ${highPriorityTasks.length} high priority task${highPriorityTasks.length !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* My Tasks Section */}
      <div className="flex justify-between items-center w-[85%] mb-6">
        <h2 className="text-xl font-semibold">My Tasks</h2>
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