import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TeamPage from "./pages/TeamPage";
import Invites from "./pages/Invites";

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

const RequireTeam = ({ children }) => {
  const { user } = useAuth();

  if (!user?.team) {
    return <Navigate to="/team" replace />;
  }

  return children;
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
          <Route path="/" element={
            <RequireTeam>

              <Dashboard />
            </RequireTeam>
            
            } />
          <Route path="/tasks" element={
            <RequireTeam>

              <Tasks />
            </RequireTeam>
            
            } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/invites" element={<Invites />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
