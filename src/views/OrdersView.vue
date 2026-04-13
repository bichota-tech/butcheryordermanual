<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore, type Order } from '@/stores/data';
import { Search, Plus, Eye, CheckCircle, Clock, Archive, X } from 'lucide-vue-next';
import OrderModal from '@/components/OrderModal.vue';
import AddOrderModal from '@/components/AddOrderModal.vue';

const store = useDataStore();
const searchQuery = ref('');
const selectedOrder = ref<Order | null>(null);
const isAddModalOpen = ref(false);

const filteredOrders = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return store.orders.filter(order => {
    const matchName = order.customerName.toLowerCase().includes(query);
    const matchDate = order.pickupDate.includes(query);
    const matchProduct = order.items.some(item => {
      const product = store.products.find(p => p.id === item.productId);
      return product?.name.toLowerCase().includes(query);
    });
    return matchName || matchDate || matchProduct;
  });
});

const openOrderModal = (order: Order) => {
  selectedOrder.value = order;
};

const closeOrderModal = () => {
  selectedOrder.value = null;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pendiente': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Completado': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'Archivado': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Pendiente': return Clock;
    case 'Completado': return CheckCircle;
    case 'Archivado': return Archive;
    default: return Clock;
  }
};
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Pedidos</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Gestiona los pedidos de la carnicería</p>
      </div>
      <button @click="isAddModalOpen = true" class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
        <Plus class="w-5 h-5" />
        Añadir Pedido
      </button>
    </header>

    <!-- Search and Filter -->
    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, fecha o producto..."
          class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow"
        />
      </div>
    </div>

    <!-- Orders List -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">ID</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Cliente</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Fecha Recogida</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Estado</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-500 dark:text-slate-400">
                No se encontraron pedidos.
              </td>
            </tr>
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
              @click="openOrderModal(order)"
            >
              <td class="p-4 font-mono text-sm text-slate-500 dark:text-slate-400">{{ order.id }}</td>
              <td class="p-4 font-medium text-slate-900 dark:text-white">{{ order.customerName }}</td>
              <td class="p-4 text-slate-600 dark:text-slate-300">{{ new Date(order.pickupDate).toLocaleString() }}</td>
              <td class="p-4">
                <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', getStatusColor(order.status)]">
                  <component :is="getStatusIcon(order.status)" class="w-3.5 h-3.5" />
                  {{ order.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <button class="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Eye class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <transition name="fade">
      <OrderModal v-if="selectedOrder" :order="selectedOrder" @close="closeOrderModal" />
    </transition>

    <transition name="fade">
      <AddOrderModal v-if="isAddModalOpen" @close="isAddModalOpen = false" />
    </transition>
  </div>
</template>
