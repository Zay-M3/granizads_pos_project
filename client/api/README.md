# API Client Documentation

Este directorio contiene todos los archivos de API para conectar el frontend con el backend usando Axios.

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto `client/` con la siguiente configuración:

```env
VITE_API_URL=http://localhost:4000/api
```

### Instancia de Axios

El archivo `axios.config.ts` contiene la configuración base de Axios con:
- URL base del API
- Interceptores para agregar el token de autenticación
- Manejo automático de errores (ej: redirect a login si el token expira)
- Timeout de 10 segundos

## Estructura de APIs

### Autenticación (`auth.api.ts`)
```typescript
import { loginRequest } from '@api/auth.api';

const response = await loginRequest({
  email: 'user@example.com',
  password: 'password123'
});
```

### Usuarios (`usuarios.api.ts`)
```typescript
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '@api/usuarios.api';

// Obtener todos los usuarios
const usuarios = await getUsuarios();

// Crear usuario
await createUsuario({
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  password: 'password123',
  rol: 'cajero'
});
```

### Productos (`productos.api.ts`)
```typescript
import { getProductos, getProductosPorCategoria, buscarProductos } from '@api/productos.api';

// Obtener todos los productos
const productos = await getProductos();

// Buscar productos por categoría
const productosCategoria = await getProductosPorCategoria(1);

// Buscar productos por término
const resultados = await buscarProductos('pizza');
```

### Categorías (`categorias.api.ts`)
```typescript
import { getCategorias, createCategoria } from '@api/categorias.api';

const categorias = await getCategorias();
```

### Insumos (`insumos.api.ts`)
```typescript
import { getInsumos, getInsumosBajoStock, updateInsumo } from '@api/insumos.api';

// Obtener insumos con stock bajo
const insumosBajos = await getInsumosBajoStock();
```

### Ventas (`ventas.api.ts`)
```typescript
import { createVenta, getVentas, getEstadisticasVentas } from '@api/ventas.api';

// Crear nueva venta
await createVenta({
  id_empleado: 1,
  id_cliente: 5,
  total: 150.00,
  metodo_pago: 'efectivo',
  detalles: [
    {
      id_producto: 1,
      cantidad: 2,
      precio_unitario: 75.00
    }
  ]
});

// Obtener estadísticas
const stats = await getEstadisticasVentas();
```

### Facturas (`facturas.api.ts`)
```typescript
import { getFacturas, createFactura, marcarFacturaEnviada } from '@api/facturas.api';

// Marcar factura como enviada
await marcarFacturaEnviada(1);
```

### Empleados (`empleados.api.ts`)
```typescript
import { getEmpleados, updateEmpleado } from '@api/empleados.api';
```

### Clientes (`clientes.api.ts`)
```typescript
import { getClientes, createCliente } from '@api/clientes.api';
```

### Movimientos de Inventario (`movimientos.api.ts`)
```typescript
import { agregarStock, consumirStock, getMovimientos } from '@api/movimientos.api';

// Agregar stock
await agregarStock({
  id_insumo: 1,
  cantidad: 50,
  motivo: 'Compra de proveedor'
});

// Consumir stock
await consumirStock({
  id_insumo: 1,
  cantidad: 10,
  motivo: 'Producción de pizzas'
});
```

### Detalles de Compras (`detalles_compras.api.ts`)
```typescript
import { getDetallesCompra, createDetalleCompra } from '@api/detalles_compras.api';
```

## Uso en Componentes

### Ejemplo con React Query (Recomendado)

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProductos, createProducto } from '@api/productos.api';

function ProductosComponent() {
  // Consulta
  const { data, isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos
  });

  // Mutación
  const mutation = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      // Refrescar datos
    }
  });

  // ...
}
```

### Ejemplo con useState y useEffect

```typescript
import { useState, useEffect } from 'react';
import { getProductos } from '@api/productos.api';

function ProductosComponent() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // ...
}
```

## Manejo de Errores

Todas las funciones de API pueden lanzar errores. Es recomendable usar try-catch:

```typescript
try {
  const data = await getProductos();
  // Procesar datos
} catch (error) {
  if (error.response) {
    // Error de respuesta del servidor
    console.error('Error:', error.response.data.message);
  } else if (error.request) {
    // No se recibió respuesta
    console.error('No hay respuesta del servidor');
  } else {
    // Error en la configuración de la petición
    console.error('Error:', error.message);
  }
}
```

## Autenticación

El token se guarda automáticamente en `localStorage` después del login y se incluye en todas las peticiones subsiguientes mediante el interceptor de Axios.

```typescript
// En auth.api.ts o en tu componente de login
const response = await loginRequest({ email, password });
if (response.token) {
  localStorage.setItem('token', response.token);
}
```

## Notas Importantes

1. **CORS**: Asegúrate de que el backend tenga CORS configurado correctamente
2. **Token**: El token se incluye automáticamente en el header `Authorization` como `Bearer {token}`
3. **Timeout**: Las peticiones tienen un timeout de 10 segundos por defecto
4. **Errores 401**: Los errores 401 (No autorizado) redirigen automáticamente a `/login`

## Tipos TypeScript

Todos los tipos están exportados desde los archivos de API correspondientes. Puedes importarlos así:

```typescript
import type { Producto, Categoria, Usuario } from '@api/index';
```
