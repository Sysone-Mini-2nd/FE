import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import ProjectManager from "./pages/ProjectManager";
import ProjectDetail from "./pages/ProjectDetail";
import GanttChart from "./pages/GanttChart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "projects",
        element: <ProjectManager />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetail />,
      },
      {
        path: "ganttchart",
        element: <GanttChart />,
      },
    ],
  },
]);

export default router;
