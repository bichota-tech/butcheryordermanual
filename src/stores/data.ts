import { defineStore } from 'pinia';
import { ref } from 'vue';

const API = 'http://localhost:3001/api';

export interface Product {
  id: string;
  category: string;
  name: string;
  unit: 'Kg' | 'Gramos' | 'Persona';
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  customerName: string;
  phone?: string | null;
  pickupDate: string;
  items: OrderItem[];
  status: 'Pendiente' | 'Completado' | 'Archivado';
  createdAt: string;
}

export const useDataStore = defineStore('data', () => {
  const products = ref<Product[]>([]);
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ── FETCH INITIAL DATA ──────────────────────────────────────────────
  const fetchInitialData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/orders`),
      ]);
      if (!productsRes.ok || !ordersRes.ok) throw new Error('Error al cargar datos');
      products.value = await productsRes.json();
      orders.value = await ordersRes.json();
    } catch (e: any) {
      error.value = e.message || 'Error de conexión con el servidor';
    } finally {
      loading.value = false;
    }
  };

  // ── PRODUCTS ────────────────────────────────────────────────────────
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Error al crear producto');
    const created: Product = await res.json();
    products.value.push(created);
  };

  const updateProduct = async (id: string, updated: Omit<Product, 'id'>) => {
    const res = await fetch(`${API}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    const saved: Product = await res.json();
    const idx = products.value.findIndex(p => p.id === id);
    if (idx !== -1) products.value[idx] = saved;
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`${API}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar producto');
    products.value = products.value.filter(p => p.id !== id);
  };

  // ── ORDERS ──────────────────────────────────────────────────────────
  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Error al crear pedido');
    const created: Order = await res.json();
    orders.value.unshift(created);
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const res = await fetch(`${API}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado del pedido');
    const updated: Order = await res.json();
    const idx = orders.value.findIndex(o => o.id === id);
    if (idx !== -1) orders.value[idx] = updated;
  };

  return {
    products,
    orders,
    loading,
    error,
    fetchInitialData,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
  };
});
