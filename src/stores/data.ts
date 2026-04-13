import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Product {
  id: string;
  category: string;
  name: string;
  unit: 'Kg' | 'Gramos' | 'Persona';
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone?: string;
  pickupDate: string;
  items: OrderItem[];
  status: 'Pendiente' | 'Completado' | 'Archivado';
  createdAt: string;
}

export const useDataStore = defineStore('data', () => {
  const products = ref<Product[]>([
    { id: '1', category: 'Ternera', name: 'Lomo Vetado', unit: 'Kg' },
    { id: '2', category: 'Pollo', name: 'Pechuga de Pollo', unit: 'Kg' },
    { id: '3', category: 'Cerdo', name: 'Costillar', unit: 'Kg' },
    { id: '4', category: 'Mixtos', name: 'Chorizo Parrillero', unit: 'Gramos' },
    { id: '5', category: 'Especiales', name: 'Parrillada Familiar', unit: 'Persona' },
  ]);

  const orders = ref<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'Juan Pérez',
      phone: '+56912345678',
      pickupDate: '2023-11-15T10:00',
      items: [
        { productId: '1', quantity: 2 },
        { productId: '3', quantity: 500 },
      ],
      status: 'Pendiente',
      createdAt: '2023-11-14T15:30',
    },
    {
      id: 'ORD-002',
      customerName: 'María González',
      pickupDate: '2023-11-16T12:00',
      items: [
        { productId: '4', quantity: 4 },
      ],
      status: 'Completado',
      createdAt: '2023-11-14T16:45',
    },
  ]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    products.value.push(newProduct);
  };

  const updateProduct = (id: string, updatedProduct: Omit<Product, 'id'>) => {
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      products.value[index] = { ...updatedProduct, id };
    }
  };

  const deleteProduct = (id: string) => {
    products.value = products.value.filter(p => p.id !== id);
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder = {
      ...order,
      id: `ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    orders.value.push(newOrder);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const order = orders.value.find(o => o.id === id);
    if (order) {
      order.status = status;
    }
  };

  return {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
  };
});
