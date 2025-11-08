import express from "express";
import usuariosRoutes from "./usuarios.routes.js";
import empleadosRoutes from "./empleados.routes.js";
import productosRoutes from "./productos.routes.js";
import categoriasRoutes from "./categorias.routes.js";
import inventariosRoutes from "./inventario.routes.js";
import movimientosRoutes from "./movimientos_inventario.routes.js";
import comprasRoutes from "./compras.routes.js";
import detallesRoutes from "./detalles_compras.routes.js";
import facturasRoutes from "./facturas.routes.js";
import clientesRoutes from "./clientes.routes.js";

const router = express.Router();

router.use("/usuarios", usuariosRoutes);
router.use("/empleados", empleadosRoutes);
router.use("/productos", productosRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/inventarios", inventariosRoutes);
router.use("/movimientos", movimientosRoutes);
router.use("/compras", comprasRoutes);
router.use("/detalles", detallesRoutes);
router.use("/facturas", facturasRoutes);
router.use("/clientes", clientesRoutes);

export default router;
