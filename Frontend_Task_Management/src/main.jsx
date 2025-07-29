import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import queryClient from "./config/queryClient";
import { AuthProvider } from "./contexts/AuthContext";

import App from "./App.jsx";
import "./index.css";
import { TasksProvider } from "./contexts/TasksContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter> {/* ✅ This must wrap AuthProvider */}
        <AuthProvider>
          <TasksProvider>
          <App />
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
