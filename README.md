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
| Express | ^4.21 | Servidor backend local (Próximamente) |
| better-sqlite3 | ^12.4 | Base de datos local SQLite (Próximamente) |
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

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Genera la build de producción en `/dist` |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Verifica tipos con `vue-tsc` |
| `npm run clean` | Elimina la carpeta `/dist` |

---

## 📁 Estructura del Proyecto

```
butcheryorders_manual/
├── src/
│   ├── components/         # Componentes reutilizables (modales, sidebar, gráficas)
│   │   ├── AddOrderModal.vue
│   │   ├── OrderModal.vue
│   │   ├── OrdersChart.vue
│   │   ├── ProductModal.vue
│   │   └── Sidebar.vue
│   ├── views/              # Páginas principales de la app
│   │   ├── DashboardView.vue
│   │   ├── OrdersView.vue
│   │   └── CatalogView.vue
│   ├── router/             # Configuración de Vue Router
│   ├── stores/             # Stores de Pinia (tema, pedidos, productos...)
│   ├── App.vue             # Componente raíz con layout principal
│   └── main.ts             # Punto de entrada
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 🔑 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto basándote en `.env.example`:

```env
APP_URL="http://localhost:3000"
```

> **Nota:** Nunca subas `.env.local` al repositorio. Está incluido en `.gitignore`.
