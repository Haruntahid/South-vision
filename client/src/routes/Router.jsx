import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import PatientInfo from "../pages/PatientInfo";
import Invoices from "../pages/Invoices";
import AddTests from "../pages/AddTests";
import Dashboard from "../pages/Dashboard";
import PatientDetails from "../pages/PatientDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/patient-info",
        element: <PatientInfo />,
      },
      {
        path: "/invoices",
        element: <Invoices />,
      },
      {
        path: "/add-tests",
        element: <AddTests />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/patient/:id",
        element: <PatientDetails />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
