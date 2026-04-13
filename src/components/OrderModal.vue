<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore, type Order } from '@/stores/data';
import { X, Clock, CheckCircle, Archive, User, Phone, Calendar } from 'lucide-vue-next';

const props = defineProps<{
  order: Order;
}>();

const emit = defineEmits(['close']);
const store = useDataStore();

const orderItemsWithDetails = computed(() => {
  return props.order.items.map(item => {
    const product = store.products.find(p => p.id === item.productId);
    return {
      ...item,
      name: product?.name || 'Producto Desconocido',
      unit: product?.unit || '',
    };
  });
});

const updateStatus = (status: Order['status']) => {
  store.updateOrderStatus(props.order.id, status);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pendiente': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    case 'Completado': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    case 'Archivado': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="emit('close')"></div>
    
    <div class="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Detalle de Pedido</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">{{ order.id }}</p>
        </div>
        <button @click="emit('close')" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto flex-1 space-y-8">
        <!-- Customer Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Información del Cliente</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <User class="w-4 h-4" />
                </div>
                <span class="font-medium">{{ order.customerName }}</span>
              </div>
              <div v-if="order.phone" class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Phone class="w-4 h-4" />
                </div>
                <span>{{ order.phone }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Detalles de Entrega</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Calendar class="w-4 h-4" />
                </div>
                <span>{{ new Date(order.pickupDate).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Products List -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Productos</h3>
          <div class="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Producto</th>
                  <th class="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 text-right">Cantidad</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                <tr v-for="item in orderItemsWithDetails" :key="item.productId">
                  <td class="px-4 py-3 text-slate-900 dark:text-white font-medium">{{ item.name }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300 text-right">
                    {{ item.quantity }} <span class="text-xs text-slate-400">{{ item.unit }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer / Actions -->
      <div class="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-500 dark:text-slate-400">Estado actual:</span>
          <span :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border', getStatusColor(order.status)]">
            {{ order.status }}
          </span>
        </div>
        
        <div class="flex gap-2 w-full sm:w-auto">
          <button
            v-if="order.status !== 'Pendiente'"
            @click="updateStatus('Pendiente')"
            class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 transition-colors"
          >
            <Clock class="w-4 h-4" />
            Pendiente
          </button>
          <button
            v-if="order.status !== 'Completado'"
            @click="updateStatus('Completado')"
            class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <CheckCircle class="w-4 h-4" />
            Completado
          </button>
          <button
            v-if="order.status !== 'Archivado'"
            @click="updateStatus('Archivado')"
            class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          >
            <Archive class="w-4 h-4" />
            Archivar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
