import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import ProjectManager from "./pages/ProjectManager";
import ProjectDetail from "./pages/ProjectDetail";
import ShareCalendar from "./pages/ShareCalendar";

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
        path: "sharecalendar",
        element: <ShareCalendar/>,
      },

    ],
  },
]);

export default router;
