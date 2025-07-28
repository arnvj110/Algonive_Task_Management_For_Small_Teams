import { createContext, useContext, useState, useEffect } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await api.get("/api/auth/me");
          setUser(res.data);
        }
      } catch (err) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      // handle error, e.g., show toast
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.post("/api/auth/register", { username, email, password });
      navigate("/login");
    } catch (err) {
      console.error(err);
      // handle error
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
