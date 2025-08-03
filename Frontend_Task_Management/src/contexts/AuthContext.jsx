
import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  loginUser, 
  registerUser, 
  fetchCurrentUser,
  updateUserProfile,
  deleteUserAccount
} from "../api/auth";
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
    mutationFn: ({ email, password }) => loginUser(email, password),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries(["user"]);
      handleSuccess("Login Successful!");
      navigate("/");
    },
    onError: (error) => {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  });

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }) => 
      registerUser(username, email, password),
    onSuccess: () => {
      navigate("/login", { state: { showToast: true } });
    },
    onError: (error) => {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  });

  const updateUserMutation = useMutation({
  mutationFn: (userData) => updateUserProfile(userData),
  onSuccess: (data) => {
    queryClient.invalidateQueries(["myTeam"]);
    queryClient.setQueryData(["user"], data);
    handleSuccess("Profile updated successfully!");
  },
  onError: (error) => {
    throw error; 
  }
});

  const deleteUserMutation = useMutation({
  mutationFn: () => deleteUserAccount(),
  onSuccess: () => {
    localStorage.removeItem("token");
    queryClient.removeQueries(["user"]);
    handleSuccess("Account deleted successfully");
    navigate("/register");
  },
  onError: (error) => {
    throw error; // Already formatted in the API function
  }
});

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading || 
                 loginMutation.isLoading || 
                 registerMutation.isLoading ||
                 updateUserMutation.isLoading ||
                 deleteUserMutation.isLoading,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        updateUser: updateUserMutation.mutateAsync,
        deleteUser: deleteUserMutation.mutateAsync,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);