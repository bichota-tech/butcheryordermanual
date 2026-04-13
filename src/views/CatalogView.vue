<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore, type Product } from '@/stores/data';
import { Search, Plus, Edit, Trash2 } from 'lucide-vue-next';
import ProductModal from '@/components/ProductModal.vue';

const store = useDataStore();
const searchQuery = ref('');
const selectedProduct = ref<Product | null>(null);
const isModalOpen = ref(false);

const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return store.products.filter(product => {
    return product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
  });
});

const openModal = (product?: Product) => {
  selectedProduct.value = product || null;
  isModalOpen.value = true;
};

const closeModal = () => {
  selectedProduct.value = null;
  isModalOpen.value = false;
};

const deleteProduct = (id: string) => {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    store.deleteProduct(id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Catálogo de Productos</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Gestiona los productos disponibles</p>
      </div>
      <button @click="openModal()" class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
        <Plus class="w-5 h-5" />
        Añadir Producto
      </button>
    </header>

    <!-- Search and Filter -->
    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre o categoría..."
          class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow"
        />
      </div>
    </div>

    <!-- Products List -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Categoría</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Producto</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Unidad de Medida</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-500 dark:text-slate-400">
                No se encontraron productos.
              </td>
            </tr>
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
            >
              <td class="p-4 text-slate-600 dark:text-slate-300">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                  {{ product.category }}
                </span>
              </td>
              <td class="p-4 font-medium text-slate-900 dark:text-white">{{ product.name }}</td>
              <td class="p-4 text-slate-600 dark:text-slate-300">{{ product.unit }}</td>
              <td class="p-4 text-right flex justify-end gap-2">
                <button @click="openModal(product)" class="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Edit class="w-5 h-5" />
                </button>
                <button @click="deleteProduct(product.id)" class="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <transition name="fade">
      <ProductModal v-if="isModalOpen" :product="selectedProduct" @close="closeModal" />
    </transition>
  </div>
</template>
