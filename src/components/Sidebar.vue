<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { LayoutDashboard, ShoppingCart, BookOpen, Moon, Sun } from 'lucide-vue-next';
import { useThemeStore } from '@/stores/theme';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);

const themeStore = useThemeStore();
const route = useRoute();

const navItems = [
  { name: 'Panel de Control', path: '/', icon: LayoutDashboard },
  { name: 'Pedidos', path: '/pedidos', icon: ShoppingCart },
  { name: 'Catálogo', path: '/catalogo', icon: BookOpen },
];
</script>

<template>
  <div>
    <!-- Sidebar Overlay -->
    <transition name="fade">
      <div v-if="isOpen" @click="emit('close')" class="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>
    </transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="h-full flex flex-col">
        <div class="p-6 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-red-600 dark:text-red-500">Carnicería</h1>
          <button @click="themeStore.toggleTheme" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors lg:flex hidden">
            <Sun v-if="themeStore.isDark" class="w-5 h-5 text-amber-500" />
            <Moon v-else class="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            :class="[
              route.path === item.path
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.name }}
          </RouterLink>
        </nav>

        <div class="p-4 border-t border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3 px-4 py-3">
            <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">
              A
            </div>
            <div>
              <p class="text-sm font-medium">Admin</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">admin@carniceria.cl</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
