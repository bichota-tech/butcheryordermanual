<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '@/stores/data';
import { TrendingUp, Users, ShoppingBag, Activity } from 'lucide-vue-next';
import OrdersChart from '@/components/OrdersChart.vue';

const store = useDataStore();

const totalOrders = computed(() => store.orders.length);
const pendingOrders = computed(() => store.orders.filter(o => o.status === 'Pendiente').length);
const completedOrders = computed(() => store.orders.filter(o => o.status === 'Completado').length);

const topProducts = computed(() => {
  const productCounts: Record<string, number> = {};
  
  store.orders.forEach(order => {
    order.items.forEach(item => {
      productCounts[item.productId] = (productCounts[item.productId] || 0) + item.quantity;
    });
  });

  return Object.entries(productCounts)
    .map(([id, count]) => {
      const product = store.products.find(p => p.id === id);
      return {
        id,
        name: product?.name || 'Desconocido',
        category: product?.category || 'N/A',
        count,
        unit: product?.unit || ''
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
});

const stats = computed(() => [
  { title: 'Total Pedidos', value: totalOrders.value, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { title: 'Pedidos Pendientes', value: pendingOrders.value, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { title: 'Pedidos Completados', value: completedOrders.value, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { title: 'Productos en Catálogo', value: store.products.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
]);
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Panel de Control</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">Resumen de la actividad de Carnicería Isidora</p>
    </header>

    <!-- 2 Columns Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Stats Grid (2x2) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 h-fit">
        <div v-for="stat in stats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.title }}</p>
              <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stat.value }}</p>
            </div>
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', stat.bg]">
              <component :is="stat.icon" :class="['w-6 h-6', stat.color]" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Top Products -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-full">
        <div class="p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Productos Estrella</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Basado en la cantidad total pedida</p>
        </div>
        <div class="p-6 flex-1">
          <div v-if="topProducts.length === 0" class="text-center py-8 text-slate-500 dark:text-slate-400 h-full flex items-center justify-center">
            No hay datos de ventas aún.
          </div>
          <div v-else class="space-y-4">
            <div v-for="(product, index) in topProducts" :key="product.id" class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="font-medium text-slate-900 dark:text-white">{{ product.name }}</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{{ product.category }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-slate-900 dark:text-white">{{ product.count }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ product.unit }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="p-6 border-b border-slate-100 dark:border-slate-700">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Pedidos por Fechas</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Evolución de los pedidos en el tiempo</p>
      </div>
      <div class="p-6">
        <OrdersChart />
      </div>
    </div>
  </div>
</template>
