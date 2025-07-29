// src/contexts/AuthContext.js
import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser, fetchCurrentUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../components/ui/toastFun";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.removeQueries({ queryKey: ["user"] });
    navigate("/login");
  };

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    enabled: !!token,
    retry: false,
    onError: (err) => {
      if (err?.response?.status === 401) {
        logout(); 
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => {
      
      return loginUser(email, password);
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries(["user"]);
      handleSuccess("Login Successful!");
      navigate("/", { state: { showToast: true } });
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }) => {
      
      return registerUser(username, email, password);
    },
    onSuccess: (data) => {
      
      handleSuccess("Registration Successful!");
      navigate("/login", { state: { showToast: true } });
    }
    
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
