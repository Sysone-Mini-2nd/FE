import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectManager from "./pages/ProjectManager";
import ProjectDetail from "./pages/ProjectDetail";
import ShareCalendar from "./pages/ShareCalendar";
import HumanResources from "./pages/HumanResources";
import PrivateRoute from "./components/common/loading/PrivateRoute";
import RoleProtectedRoute from "./components/common/loading/RoleProtectedRoute";

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
      {
        path: "hr",
        element: (
          <RoleProtectedRoute requiredRole="MASTER">
            <HumanResources/>
          </RoleProtectedRoute>
        ),
      },

    ],
  },
]);

export default router;
