import { createBrowserRouter } from "react-router-dom";
import Layout from "@layout/Layout";
import Home from "@pages/home/Home";
import Login from "@pages/login/Login";
import CreateProducts from "@pages/products/CreateProducts";
import ListProducts from "@pages/products/ListProducts";
import ListInventory from "@pages/inventory/ListInventory";
import CreateInputs from "@pages/inventory/CreateInputs";
import CreateCashier from "@pages/admin/CreateCashier";
import ListCashier from "@pages/admin/ListCashier";
import NotFound from "@pages/notFound/NotFound";

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
        path: "productos",
        element: <ListProducts />,
      },
      {
        path: "productos/crear",
        element: <CreateProducts />,
      },
      {
        path: "inventario",
        element: <ListInventory />,
      },
      {
        path: "inventario/agregar",
        element: <CreateInputs />,
      },
      {
        path: "cajeros",
        element: <ListCashier />,
      },
      {
        path: "cajeros/crear",
        element: <CreateCashier />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
