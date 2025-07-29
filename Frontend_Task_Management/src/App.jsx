import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import { useEffect } from "react";
import { toast } from "react-toastify";

// ✅ Auth guard
const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Let the route render but show a loader inside the layout
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">Loading...</div>
      </Layout>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};


function App() {
   
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
