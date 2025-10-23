---
applyTo: '**'
---

## Contexto del Proyecto

Este es un sistema de Punto de Venta (POS) para gestionar operaciones de un negocio de granizados (bebidas heladas), con facturación electrónica integrada.

**Stack Tecnológico:**
- Frontend: React.js
- Backend: Node.js con Express
- Base de Datos: PostgreSQL
- Metodología: Scrum/Agile

---

## REGLAS GENERALES DE INTERACCIÓN CON IA

### Cuándo GENERAR código:
- **SOLO** cuando el usuario lo solicite **EXPLÍCITAMENTE** con frases como:
  - "crea...", "genera...", "implementa...", "escribe el código..."
  - "añade...", "agrega...", "desarrolla..."
  - "modifica...", "edita...", "actualiza este archivo..."

### Cuándo NO generar código:
- Cuando el usuario pregunte: "¿cómo...?", "¿qué...?", "¿por qué...?"
- Cuando pida explicaciones, sugerencias o consejos
- Cuando solicite revisar o analizar código existente
- En estos casos: **EXPLICAR** el concepto, enfoque o solución **SIN** crear/editar archivos

---


### Frontend (React - `/client`)

#### Estructura de Carpetas:
```
client/
├── src/
│   ├── components/          # Componentes reutilizables UI
│   │   ├── common/         # Botones, inputs, modales genéricos
│   │   ├── layout/         # Header, Footer, Sidebar
│   │   └── forms/          # Componentes de formularios
│   ├── modules/            # Módulos por funcionalidad
│   │   ├── products/       # Gestión de productos
│   │   ├── sales/          # Punto de venta
│   │   ├── invoicing/      # Facturación electrónica
│   │   ├── inventory/      # Inventario
│   │   ├── customers/      # Clientes
│   │   ├── reports/        # Reportes
│   │   └── users/          # Gestión de usuarios
│   ├── hooks/              # Custom hooks
│   ├── contexts/           # Context providers
│   ├── services/           # Conectores API
│   ├── utils/              # Funciones auxiliares
│   ├── styles/             # Estilos globales
│   └── assets/             # Imágenes, iconos
```

#### Convenciones de Nomenclatura Frontend:
- **Componentes React**: `PascalCase` (ej: `ProductCard.jsx`, `InvoiceForm.jsx`)
- **Hooks personalizados**: `camelCase` con prefijo `use` (ej: `useProducts.js`, `useAuth.js`)
- **Archivos de utilidades**: `camelCase` (ej: `formatCurrency.js`, `validateForm.js`)
- **Servicios API**: `camelCase` con sufijo `Service` (ej: `productService.js`, `authService.js`)
- **Archivos de estilo**: `[ComponentName].module.css` (ej: `ProductCard.module.css`)
- **Archivos de prueba**: `[filename].test.js` (ej: `ProductCard.test.js`)
- **Contextos**: `PascalCase` con sufijo `Context` (ej: `AuthContext.jsx`, `CartContext.jsx`)

### Backend (Node.js/Express - `/backend`)

#### Estructura de Carpetas:
```
backend/
├── src/
│   ├── api/                # Rutas y controladores
│   │   ├── routes/         # Definición de rutas
│   │   └── controllers/    # Lógica de controladores
│   ├── modules/            # Lógica de negocio por módulo
│   │   ├── products/       # Módulo de productos
│   │   ├── sales/          # Módulo de ventas
│   │   ├── invoicing/      # Módulo de facturación
│   │   ├── inventory/      # Módulo de inventario
│   │   ├── customers/      # Módulo de clientes
│   │   ├── reports/        # Módulo de reportes
│   │   └── users/          # Módulo de usuarios
│   ├── models/             # Modelos de base de datos
│   ├── services/           # Servicios externos
│   ├── utils/              # Funciones auxiliares
│   ├── middleware/         # Middlewares personalizados
│   ├── config/             # Configuraciones
│   └── database/           # Conexión y migraciones DB
```

#### Convenciones de Nomenclatura Backend:
- **Archivos**: `kebab-case` (ej: `user-service.js`, `product-controller.js`)
- **Carpetas**: `kebab-case` (ej: `/user-management`, `/invoice-generation`)
- **Clases**: `PascalCase` (ej: `class ProductService`)
- **Funciones**: `camelCase` (ej: `getUserById`, `createInvoice`)
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `MAX_PRODUCTS`, `API_VERSION`)
- **Archivos de prueba**: `[filename].test.js` (ej: `user-service.test.js`)
- **Rutas**: Plural, kebab-case (ej: `/api/products`, `/api/sales`)

---

### Principios de Código Limpio:
1. **Componentes pequeños y enfocados**: Cada componente/módulo debe tener UNA responsabilidad
2. **Reutilización**: Crear componentes genéricos antes de duplicar código
3. **Separación de responsabilidades**: 
   - Lógica de negocio en servicios/módulos
   - Presentación en componentes
   - Estado global en contextos
4. **Nombres descriptivos**: Variables y funciones autoexplicativas

### Estructura de un Módulo (Ejemplo: Productos):

**Frontend (`/client/src/modules/products/`):**
```
products/
├── components/           # Componentes específicos del módulo
│   ├── ProductCard.jsx
│   ├── ProductList.jsx
│   └── ProductForm.jsx
├── hooks/               # Hooks específicos del módulo
│   └── useProducts.js
├── services/            # Servicios API del módulo
│   └── productService.js
├── ProductsPage.jsx     # Página principal
└── index.js             # Exportaciones
```

**Backend (`/backend/src/modules/products/`):**
```
products/
├── product-controller.js    # Controlador HTTP
├── product-service.js       # Lógica de negocio
├── product-model.js         # Modelo de datos
├── product-validator.js     # Validaciones
└── product-routes.js        # Definición de rutas
```

---

### Para Funcionalidades de FRONTEND:

**Rutas a usar:**
- Componentes UI reutilizables → `/client/src/components/`
- Funcionalidad completa de módulo → `/client/src/modules/[nombre-modulo]/`
- Hooks personalizados → `/client/src/hooks/` o dentro del módulo específico
- Servicios API → `/client/src/services/` o dentro del módulo específico
- Utilidades → `/client/src/utils/`
- Contextos globales → `/client/src/contexts/`

**Ejemplos:**
- "Crear formulario de producto" → `/client/src/modules/products/components/ProductForm.jsx`
- "Crear botón reutilizable" → `/client/src/components/common/Button.jsx`
- "Hook para manejar carrito" → `/client/src/hooks/useCart.js`

### Para Funcionalidades de BACKEND:

**Rutas a usar:**
- Endpoints API → `/backend/src/api/routes/[nombre]-routes.js`
- Controladores → `/backend/src/api/controllers/[nombre]-controller.js`
- Lógica de negocio → `/backend/src/modules/[nombre]/[nombre]-service.js`
- Modelos de DB → `/backend/src/models/[nombre]-model.js`
- Middlewares → `/backend/src/middleware/[nombre]-middleware.js`
- Utilidades → `/backend/src/utils/`

**Ejemplos:**
- "Crear endpoint de productos" → `/backend/src/api/routes/product-routes.js`
- "Lógica de ventas" → `/backend/src/modules/sales/sales-service.js`
- "Middleware de autenticación" → `/backend/src/middleware/auth-middleware.js`

### Para Base de Datos:

**Rutas a usar:**
- Modelos → `/backend/src/models/`
- Migraciones → `/backend/src/database/migrations/`
- Seeds → `/backend/src/database/seeds/`
- Configuración → `/backend/src/config/database.js`

---

### Módulos Principales:

1. **Products (Productos)**
   - Gestión de granizados, sabores, tamaños
   - CRUD de productos
   - Precios y categorías

2. **Sales (Ventas/POS)**
   - Punto de venta
   - Carrito de compras
   - Procesamiento de transacciones
   - Métodos de pago

3. **Invoicing (Facturación)**
   - Generación de facturas electrónicas
   - Almacenamiento de facturas
   - Cumplimiento normativo

4. **Inventory (Inventario)**
   - Control de stock
   - Alertas de inventario bajo
   - Registro de entradas/salidas

5. **Customers (Clientes)**
   - Registro de clientes
   - Historial de compras
   - Información de facturación

6. **Users (Usuarios/Staff)**
   - Gestión de empleados
   - Roles y permisos
   - Autenticación

7. **Reports (Reportes)**
   - Reportes de ventas
   - Analytics de productos
   - Reportes financieros

---

## REGLAS DE SEGURIDAD

- Nunca exponer credenciales en el código
- Usar variables de entorno para configuraciones sensibles
- Validar todas las entradas de usuario
- Implementar autenticación y autorización apropiadas
- Sanitizar datos antes de consultas a DB

---

## CHECKLIST ANTES DE GENERAR CÓDIGO

Antes de crear/editar archivos, verificar:
1. ¿El usuario solicitó EXPLÍCITAMENTE generar código?
2. ¿Entiendo completamente el requisito?
3. ¿Sé en qué carpeta debe ir el archivo?
4. ¿El nombre del archivo sigue las convenciones?
5. ¿Estoy siguiendo la arquitectura de módulos?
6. ¿Puedo reutilizar componentes/servicios existentes?

Si alguna respuesta es "no", **preguntar primero** antes de generar código.

---

## FORMATO DE RESPUESTAS

### Cuando se pide explicación (NO generar código):
```
"Para implementar [funcionalidad], necesitarías:

1. Crear un componente en `/ruta/archivo.jsx`
2. Usar el hook X para manejar Y
3. Conectar con el servicio Z

¿Te gustaría que implemente esto?"
```

### Cuando se pide generar código:
```
"Voy a crear [funcionalidad] en:
- `/ruta/archivo1.jsx` - [propósito]
- `/ruta/archivo2.js` - [propósito]"

[Luego generar los archivos]
```

---

## WORKFLOW DE DESARROLLO

Este proyecto sigue metodología Scrum:
- Requirements rastreados en JIRA
- Desarrollo en sprints
- Code reviews obligatorios en PRs
- Testing automatizado en CI/CD

Al generar código, seguir las mejores prácticas de:
- Clean Code
- SOLID principles
- DRY (Don't Repeat Yourself)
- Componentización
- Testing

---

**Recuerda:** La claridad y mantenibilidad del código es más importante que la brevedad. Siempre prioriza código limpio, bien organizado y fácil de entender.

