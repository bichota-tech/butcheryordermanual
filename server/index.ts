import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ───────────────────────────── PRODUCTS ──────────────────────────────

// GET /api/products — list all products
app.get('/api/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST /api/products — create product
app.post('/api/products', async (req, res) => {
  const { category, name, unit } = req.body;
  if (!category || !name || !unit) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    const product = await prisma.product.create({ data: { category, name, unit } });
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/products/:id — update product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { category, name, unit } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { category, name, unit },
    });
    res.json(product);
  } catch (e) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// DELETE /api/products/:id — delete product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// ───────────────────────────── ORDERS ──────────────────────────────

// GET /api/orders — list all orders with items + product info
app.get('/api/orders', async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// POST /api/orders — create a new order with its items
app.post('/api/orders', async (req, res) => {
  const { customerName, phone, pickupDate, status, items } = req.body;
  if (!customerName || !pickupDate || !status || !items?.length) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    const order = await prisma.order.create({
      data: {
        customerName,
        phone: phone || null,
        pickupDate,
        status,
        items: {
          create: items.map((item: { productId: string; quantity: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

// PUT /api/orders/:id/status — update order status only
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Falta el campo status' });
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } } },
    });
    res.json(order);
  } catch (e) {
    res.status(404).json({ error: 'Pedido no encontrado' });
  }
});

// DELETE /api/orders/:id — delete order (and cascade items)
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.order.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ error: 'Pedido no encontrado' });
  }
});

// ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  API server running at http://localhost:${PORT}`);
});
