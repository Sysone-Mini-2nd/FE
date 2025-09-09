import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectManager from "./pages/ProjectManager";
import ProjectDetail from "./pages/ProjectDetail";
import ShareCalendar from "./pages/ShareCalendar";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
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
