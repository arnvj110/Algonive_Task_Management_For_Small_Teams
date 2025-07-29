// src/contexts/AuthContext.js
import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser, fetchCurrentUser } from "../api/auth";
import { useNavigate } from "react-router-dom";


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
      navigate("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }) => {
      
      return registerUser(username, email, password);
    },
    onSuccess: () => {
      navigate("/login");
    },
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
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
