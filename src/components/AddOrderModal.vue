<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore, type OrderItem } from '@/stores/data';
import { X, Plus, Trash2, Search, CheckCircle } from 'lucide-vue-next';

const emit = defineEmits(['close']);
const store = useDataStore();

const customerName = ref('');
const phone = ref('');
const pickupDate = ref('');
const items = ref<{ productId: string; quantity: number; search: string; showDropdown: boolean }[]>([]);

const minDate = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const addItem = () => {
  items.value.push({ productId: '', quantity: 1, search: '', showDropdown: false });
};

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};

const getFilteredProducts = (search: string) => {
  if (!search) return store.products;
  const query = search.toLowerCase();
  return store.products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
};

const selectProduct = (index: number, product: any) => {
  items.value[index].productId = product.id;
  items.value[index].search = product.name;
  items.value[index].showDropdown = false;
};

const getUnit = (productId: string) => {
  const product = store.products.find(p => p.id === productId);
  return product ? product.unit : '';
};

const saveOrder = () => {
  if (!customerName.value || !pickupDate.value || items.value.length === 0) {
    alert('Por favor, completa los campos obligatorios y añade al menos un producto.');
    return;
  }

  const selectedDate = new Date(pickupDate.value + 'T00:00:00');
  const today = new Date(minDate.value + 'T00:00:00');
  
  if (selectedDate < today) {
    alert('No puedes seleccionar una fecha pasada.');
    return;
  }

  const validItems: OrderItem[] = items.value.filter(item => item.productId && item.quantity > 0).map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }));

  if (validItems.length === 0) {
    alert('Por favor, selecciona productos válidos.');
    return;
  }

  store.addOrder({
    customerName: customerName.value,
    phone: phone.value,
    pickupDate: pickupDate.value,
    items: validItems,
    status: 'Pendiente'
  });

  emit('close');
};

// Initialize with one empty item
addItem();
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="emit('close')"></div>
    
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-order-title"
      class="relative w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
    >
      <!-- Receipt Header -->
      <div class="bg-red-600 dark:bg-red-700 p-6 text-white flex items-center justify-between">
        <div>
          <h2 id="add-order-title" class="text-2xl font-bold font-serif tracking-wider uppercase">Talonario de Pedidos</h2>
          <p class="text-red-200 text-sm mt-1">Carnicería</p>
        </div>
        <button @click="emit('close')" aria-label="Cerrar modal" class="p-2 text-red-200 hover:text-white rounded-full hover:bg-red-500 dark:hover:bg-red-600 transition-colors">
          <X class="w-6 h-6" aria-hidden="true" />
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900">
        <div class="space-y-8">
          <!-- Customer Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div class="space-y-2">
              <label for="customerName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre del Cliente *</label>
              <input
                id="customerName"
                v-model="customerName"
                type="text"
                placeholder="Ej. Juan Pérez"
                autocomplete="name"
                required
                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow"
              />
            </div>
            <div class="space-y-2">
              <label for="phone" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Teléfono (Opcional)</label>
              <input
                id="phone"
                v-model="phone"
                type="tel"
                placeholder="+56 9 1234 5678"
                autocomplete="tel"
                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow"
              />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label for="pickupDate" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Fecha de Recogida *</label>
              <input
                id="pickupDate"
                v-model="pickupDate"
                type="date"
                :min="minDate"
                required
                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow"
              />
            </div>
          </div>

          <!-- Products Table -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-visible">
            <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Productos</h3>
              <button @click="addItem" class="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                <Plus class="w-4 h-4" />
                Añadir Fila
              </button>
            </div>
            
            <div class="p-4 overflow-visible">
              <div class="space-y-4">
                <div v-for="(item, index) in items" :key="index" class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div class="flex-1 relative w-full">
                    <div class="relative">
                      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                      <input
                        v-model="item.search"
                        @focus="item.showDropdown = true"
                        @input="item.showDropdown = true"
                        type="text"
                        :aria-label="`Buscar producto para la fila ${index + 1}`"
                        placeholder="Buscar producto..."
                        class="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow"
                      />
                    </div>
                    
                    <!-- Autocomplete Dropdown -->
                    <div v-if="item.showDropdown && getFilteredProducts(item.search).length > 0" class="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      <div
                        v-for="product in getFilteredProducts(item.search)"
                        :key="product.id"
                        @click="selectProduct(index, product)"
                        class="px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                      >
                        <div class="font-medium text-slate-900 dark:text-white">{{ product.name }}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">{{ product.category }} &bull; {{ product.unit }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-4 w-full sm:w-auto">
                    <div class="relative flex-1 sm:w-32">
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        placeholder="Cant."
                        class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow"
                      />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                        {{ getUnit(item.productId) }}
                      </span>
                    </div>
                    
                    <button
                      @click="removeItem(index)"
                      :aria-label="`Eliminar fila ${index + 1}`"
                      class="p-2.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-50 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <Trash2 class="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
        <button @click="emit('close')" class="px-6 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          Cancelar
        </button>
        <button @click="saveOrder" class="px-6 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors flex items-center gap-2">
          <CheckCircle class="w-5 h-5" />
          Guardar Pedido
        </button>
      </div>
    </div>
  </div>
</template>
