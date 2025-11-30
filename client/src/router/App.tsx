import { createBrowserRouter } from "react-router-dom";
import Layout from "@layout/Layout";
import Home from "@pages/home/Home";
import HomeEmployee from "@pages/home/HomeEmployee";
import Login from "@pages/login/Login";
import CreateProducts from "@pages/products/CreateProducts";
import ListProducts from "@pages/products/ListProducts";
import ListInventory from "@pages/inventory/ListInventory";
import CreateInputs from "@pages/inventory/CreateInputs";
import CreateCashier from "@pages/admin/CreateCashier";
import ListCashier from "@pages/admin/ListCashier";
import ListAllSales from "@pages/admin/ListAllSales";
import Sales from "@pages/Employees/Sales";
import NotFound from "@pages/notFound/NotFound";
import { ProtectedRoute } from "@components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "empleado",
        element: (
          <ProtectedRoute allowedRoles={["cajero"]}>
            <HomeEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: "ventas/crear",
        element: (
          <ProtectedRoute allowedRoles={["cajero"]}>
            <Sales />
          </ProtectedRoute>
        ),
      },
      {
        path: "productos",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "productos/crear",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventario",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventario/agregar",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateInputs />
          </ProtectedRoute>
        ),
      },
      {
        path: "cajeros",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListCashier />
          </ProtectedRoute>
        ),
      },
      {
        path: "cajeros/crear",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateCashier />
          </ProtectedRoute>
        ),
      },
      {
        path: "ventas",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListAllSales />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
