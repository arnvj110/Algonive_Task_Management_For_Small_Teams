import { useTasks } from "../contexts/TasksContext";
import TaskCard from "../components/tasks/TaskCard";

const Dashboard = () => {
  const { myTasks, loading } = useTasks();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myTasks.length === 0 ? (
          <p>No tasks assigned to you.</p>
        ) : (
          myTasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
};

export default Dashboard;
