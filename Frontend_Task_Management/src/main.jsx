import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";


import queryClient from "./config/queryClient";
import { AuthProvider } from "./contexts/AuthContext";

import App from "./App.jsx";
import "./index.css";
import { TasksProvider } from "./contexts/TasksContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    
    <QueryClientProvider client={queryClient}>
      <BrowserRouter> 
        <AuthProvider>
          <TasksProvider>
            <ThemeProvider>

              <App />
              <ToastContainer />
            </ThemeProvider>
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
      
    </QueryClientProvider>
  </StrictMode>
);
