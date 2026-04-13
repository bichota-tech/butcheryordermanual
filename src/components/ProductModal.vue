<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDataStore, type Product } from '@/stores/data';
import { X, Save } from 'lucide-vue-next';

const props = defineProps<{
  product: Product | null;
}>();

const emit = defineEmits(['close']);
const store = useDataStore();

const form = ref({
  category: '',
  name: '',
  unit: 'Kg' as 'Kg' | 'Gramos' | 'Persona',
});

const categories = [
  'Ternera',
  'Pollo',
  'Cerdo',
  'Mixtos',
  'Especiales'
];

onMounted(() => {
  if (props.product) {
    form.value = { ...props.product };
  }
});

const saveProduct = () => {
  if (!form.value.category || !form.value.name || !form.value.unit) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  if (props.product) {
    store.updateProduct(props.product.id, form.value);
  } else {
    store.addProduct(form.value);
  }

  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="emit('close')"></div>
    
    <div class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">
          {{ product ? 'Editar Producto' : 'Añadir Producto' }}
        </h2>
        <button @click="emit('close')" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6 space-y-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Categoría *</label>
          <select
            v-model="form.category"
            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow appearance-none"
          >
            <option value="" disabled>Selecciona una categoría</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre del Producto *</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Ej. Lomo Liso"
            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Unidad de Medida *</label>
          <div class="grid grid-cols-3 gap-3">
            <label
              v-for="unit in ['Kg', 'Gramos', 'Persona']"
              :key="unit"
              class="relative flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all"
              :class="[
                form.unit === unit
                  ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 font-medium'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50'
              ]"
            >
              <input type="radio" :value="unit" v-model="form.unit" class="sr-only" />
              <span class="text-sm">{{ unit }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
        <button @click="emit('close')" class="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          Cancelar
        </button>
        <button @click="saveProduct" class="px-5 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors flex items-center gap-2">
          <Save class="w-4 h-4" />
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>
