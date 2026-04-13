<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '@/stores/data';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bubble } from 'vue-chartjs';
import { useThemeStore } from '@/stores/theme';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const store = useDataStore();
const themeStore = useThemeStore();

const chartData = computed(() => {
  const categories = ['Ternera', 'Pollo', 'Cerdo', 'Mixtos', 'Especiales'];
  
  const dateMap = new Map<string, number>();
  store.orders.forEach(o => {
    const d = new Date(o.createdAt);
    d.setHours(0,0,0,0);
    dateMap.set(d.toLocaleDateString(), d.getTime());
  });
  
  let sortedDates = Array.from(dateMap.keys()).sort((a, b) => dateMap.get(a)! - dateMap.get(b)!);

  if (sortedDates.length === 0) {
    sortedDates = [new Date().toLocaleDateString()];
  }

  const dataPoints: any[] = [];

  sortedDates.forEach(date => {
    categories.forEach(category => {
      let orderCount = 0;
      store.orders.forEach(order => {
        if (new Date(order.createdAt).toLocaleDateString() === date) {
          const hasCategory = order.items.some(item => {
            const product = store.products.find(p => p.id === item.productId);
            return product && product.category === category;
          });
          if (hasCategory) orderCount++;
        }
      });

      if (orderCount > 0) {
        dataPoints.push({
          x: date,
          y: category,
          r: Math.min(orderCount * 6 + 12, 35), // Min radius 18, max 35
          quantity: orderCount
        });
      }
    });
  });

  const isDark = themeStore.isDark;

  return {
    labels: sortedDates,
    datasets: [
      {
        label: 'Pedidos',
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.9)' : 'rgba(220, 38, 38, 0.9)',
        borderColor: isDark ? '#fca5a5' : '#991b1b',
        borderWidth: 2,
        hoverBackgroundColor: isDark ? '#f87171' : '#ef4444',
        data: dataPoints,
      }
    ]
  };
});

const chartOptions = computed(() => {
  const isDark = themeStore.isDark;
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 10,
        left: 20,
        right: 20
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#475569',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.raw.quantity} pedidos de ${context.raw.y}`;
          }
        }
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold' as const,
          size: 13
        },
        formatter: function(value: any) {
          return value.quantity;
        }
      }
    },
    scales: {
      y: {
        type: 'category' as const,
        labels: ['Ternera', 'Pollo', 'Cerdo', 'Mixtos', 'Especiales'],
        offset: true,
        title: {
          display: true,
          text: 'Categorías (Productos)',
          color: textColor,
          font: {
            weight: 'bold' as const
          }
        },
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
        border: {
          display: false
        }
      },
      x: {
        type: 'category' as const,
        offset: true,
        title: {
          display: true,
          text: 'Fechas',
          color: textColor,
          font: {
            weight: 'bold' as const
          }
        },
        ticks: {
          color: textColor
        },
        grid: {
          color: gridColor,
          drawOnChartArea: true
        },
        border: {
          display: false
        }
      }
    }
  };
});
</script>

<template>
  <div class="h-[350px] w-full">
    <Bubble :data="chartData" :options="chartOptions" />
  </div>
</template>
