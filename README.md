# Sistema de Gestión de una Carnicería

Aplicación web para la gestión integral de una carnicería: control de pedidos, catálogo de productos y panel de métricas.

---

## 🚀 Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Vue 3 | ^3.5 | Framework principal (Composition API)  |
| Vite | ^6.2 | Bundler y servidor de desarrollo |
| TypeScript | ~5.8 | Tipado estático |
| Tailwind CSS | ^4.1 | Estilos utilitarios |
| Pinia | ^3.0 | Gestión de estado global |
| Vue Router | ^5.0 | Enrutamiento SPA |
| Chart.js + vue-chartjs | ^4.5 / ^5.3 | Gráficas y métricas |
| Lucide Vue Next | ^0.577 | Iconografía |
| Express | ^4.21 | Servidor backend local (API REST) |
| Prisma ORM | ^6.19 | Manejo e interacción con BD |
| SQLite | - | Base de datos persistente transaccional |
| date-fns | ^4.1 | Manejo de fechas |

---

## 📦 Características Principales

- **Panel de Control (Dashboard):** Vista general con métricas, gráficas de pedidos y estadísticas clave del negocio.
- **Gestión de Pedidos:** Alta, edición y seguimiento de pedidos con modal detallado.
- **Catálogo de Productos:** Administración del catálogo de productos de la carnicería (precios, disponibilidad, categorías).
- **Modo Oscuro / Claro:** Cambio de tema persistente gestionado desde Pinia.
- **Diseño Responsive:** Navegación adaptada a móvil, tablet y escritorio con sidebar colapsable.

---

## ⚙️ Configuración y Ejecución Local

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior

### Pasos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**

   Copia el archivo de ejemplo y rellena los valores:
   ```bash
   cp .env.example .env.local
   ```

   | Variable | Descripción |
   |---|---|
   | `APP_URL` | URL base donde se sirve la aplicación |

3. **Iniciar el servidor y cliente:**
   ```bash
   npm run dev
   ```
   La aplicación se levantará en `http://localhost:3000` y la API en `http://localhost:3001`.

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia **simultáneamente** el cliente y el servidor backend |
| `npm run dev:client` | Inicia únicamente el servidor Vite (Frontend) |
| `npm run dev:server` | Inicia únicamente el servidor Express TypeScript (Backend) |
| `npm run build` | Genera la build de producción en `/dist` |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Verifica tipos con `vue-tsc` |

---

## 📁 Estructura del Proyecto

```text
butcheryorders_manual/
├── server/
│   └── index.ts            # Servidor API Express y endpoints REST
├── prisma/
│   ├── dev.db              # Base de datos SQLite (Persistente)
│   └── schema.prisma       # Esquema y modelos de la base de datos
├── src/
│   ├── components/         # Componentes reutilizables UI
│   ├── views/              # Vistas principales de la App
│   ├── router/             # Configuración de Vue Router
│   ├── stores/             # Acciones AJAX y peticiones al backend (Pinia)
│   ├── App.vue             # Componente raíz
│   └── main.ts             # Punto de entrada de Vue
├── .env                    # Entorno y cadena de conexión a BD
├── package.json            # Dependencias y scripts
└── vite.config.ts          # Configuración de compilación Vite
```

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto para conectarte a la base de datos:

```env
DATABASE_URL="file:./dev.db"
PORT="3001"
CORS_ORIGIN="http://localhost:3000"
```

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
