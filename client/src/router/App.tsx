import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import CreateProducts from "../pages/products/CreateProducts";
import ListProducts from "../pages/products/ListProducts";

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
    ],
  },
]);
