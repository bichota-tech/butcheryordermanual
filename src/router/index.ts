import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import OrdersView from '@/views/OrdersView.vue';
import CatalogView from '@/views/CatalogView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/pedidos',
      name: 'pedidos',
      component: OrdersView,
    },
    {
      path: '/catalogo',
      name: 'catalogo',
      component: CatalogView,
    },
  ],
});

export default router;
