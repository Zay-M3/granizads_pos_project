import express from 'express';

// Importar rutas
import productosRoutes from './routes/productos.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import empleadosRoutes from './routes/empleados.routes.js';
import inventarioRoutes from './routes/inventario.routes.js';
import movimientosRoutes from './routes/movimientos_inventario.routes.js';
import comprasRoutes from './routes/compras.routes.js';
import detalleComprasRoutes from './routes/detalles_compras.routes.js';
import facturasRoutes from './routes/facturas.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

const app = express();
app.use(express.json());

// Prefijos de API
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/detalles-compras', detalleComprasRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('✅ API POS Granizados funcionando correctamente 🚀');
});

export default app;
