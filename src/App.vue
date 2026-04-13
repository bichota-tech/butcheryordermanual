<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView, RouterLink, useRoute } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import { useThemeStore } from '@/stores/theme';
import { useDataStore } from '@/stores/data';
import { Menu, X, Moon, Sun, LayoutDashboard, ShoppingCart, BookOpen } from 'lucide-vue-next';

const themeStore = useThemeStore();
const dataStore = useDataStore();
const route = useRoute();
const isSidebarOpen = ref(false);
const isMobile = ref(window.innerWidth < 768);

const navItems = [
  { name: 'Panel de Control', path: '/', icon: LayoutDashboard },
  { name: 'Pedidos', path: '/pedidos', icon: ShoppingCart },
  { name: 'Catálogo', path: '/catalogo', icon: BookOpen },
];

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false;
  }
};

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  themeStore.initTheme();
  window.addEventListener('resize', handleResize);
  dataStore.fetchInitialData();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div :class="{ 'dark': themeStore.isDark }">
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex overflow-hidden transition-colors duration-300">
      <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" />
      
      <main 
        class="flex-1 h-screen overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-transform duration-300 ease-in-out flex flex-col lg:ml-64 lg:translate-x-0"
        :class="(isSidebarOpen && isMobile) ? 'translate-x-64' : 'translate-x-0'"
      >
        <!-- Mobile & Tablet Header -->
        <div class="lg:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 h-16 shrink-0">
          <h1 class="text-xl font-bold text-red-600 dark:text-red-500">Carnicería</h1>
          
          <!-- Tablet Navigation -->
          <nav class="hidden md:flex items-center gap-2">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
              :class="[
                route.path === item.path
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
              ]"
            >
              <component :is="item.icon" class="w-4 h-4" />
              {{ item.name }}
            </RouterLink>
          </nav>

          <div class="flex items-center gap-2 md:gap-4">
            <button @click="themeStore.toggleTheme" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Sun v-if="themeStore.isDark" class="w-5 h-5 text-amber-500" />
              <Moon v-else class="w-5 h-5 text-slate-600" />
            </button>
            <button @click="toggleSidebar" class="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Menu v-if="!isSidebarOpen" class="w-6 h-6" />
              <X v-else class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="container mx-auto px-4 py-8 md:px-8 flex-1">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
