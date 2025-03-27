import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/Activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/Activities/form/ActivityForm";
import ActivityDetails from "../../features/Activities/details/ActivityDetails";
import TestErrors from "../../features/Errors/TestErrors";
import NotFound from "../../features/Errors/NotFound";
import ServerError from "../../features/Errors/ServerError";
import LoginForm from "../../features/Users/LoginForm";
import ProfilePage from "../../features/Profiles/ProfilePage";

export const routes: RouteObject[] = [
  {
    /**
     * hierarchy of routes from top component
     * down to its children
     */
    path: "/",
    element: <App />,
    children: [
      { path: 'activities', element: <ActivityDashboard /> },
      { path: 'activities/:id', element: <ActivityDetails /> },
      { path: 'createActivity', element: <ActivityForm key="create" /> },
      { path: 'manage/:id', element: <ActivityForm key="manage" /> },
      { path: 'profiles/:username', element: <ProfilePage/> },
      { path: 'login', element: <LoginForm /> },
      { path: 'errors', element: <TestErrors /> },
      { path: 'not-found', element: <NotFound /> },
      { path: 'server-error', element: <ServerError /> },
      { path: '*', element: <Navigate replace to='/not-found' /> }
    ]
  }
]

export const router = createBrowserRouter(routes);