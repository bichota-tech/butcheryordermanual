import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// ── Allowed values (enum-like validation) ────────────────────────────
const VALID_UNITS = ['Kg', 'Gramos', 'Persona'] as const;
const VALID_STATUSES = ['Pendiente', 'Completado', 'Archivado'] as const;
type Unit = typeof VALID_UNITS[number];
type Status = typeof VALID_STATUSES[number];

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// ── Middleware ───────────────────────────────────────────────────────
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '50kb' })); // Limit payload size to prevent DoS

// ───────────────────────────── PRODUCTS ──────────────────────────────

// GET /api/products — list all products
app.get('/api/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST /api/products — create product
app.post('/api/products', async (req, res) => {
  const { category, name, unit } = req.body;

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return res.status(400).json({ error: 'El campo "categoría" es requerido y debe ser texto' });
  }
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'El campo "nombre" es requerido y debe ser texto' });
  }
  if (!VALID_UNITS.includes(unit as Unit)) {
    return res.status(400).json({ error: `El campo "unidad" debe ser uno de: ${VALID_UNITS.join(', ')}` });
  }

  try {
    const product = await prisma.product.create({
      data: { category: category.trim(), name: name.trim(), unit },
    });
    res.status(201).json(product);
  } catch {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/products/:id — update product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { category, name, unit } = req.body;

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return res.status(400).json({ error: 'El campo "categoría" es requerido y debe ser texto' });
  }
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'El campo "nombre" es requerido y debe ser texto' });
  }
  if (!VALID_UNITS.includes(unit as Unit)) {
    return res.status(400).json({ error: `El campo "unidad" debe ser uno de: ${VALID_UNITS.join(', ')}` });
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { category: category.trim(), name: name.trim(), unit },
    });
    res.json(product);
  } catch {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// DELETE /api/products/:id — delete product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch {
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
  } catch {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// POST /api/orders — create a new order with its items
app.post('/api/orders', async (req, res) => {
  const { customerName, phone, pickupDate, status, items } = req.body;

  if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
    return res.status(400).json({ error: 'El nombre del cliente es requerido' });
  }
  if (!pickupDate || typeof pickupDate !== 'string') {
    return res.status(400).json({ error: 'La fecha de recogida es requerida' });
  }
  if (!VALID_STATUSES.includes(status as Status)) {
    return res.status(400).json({ error: `El estado debe ser uno de: ${VALID_STATUSES.join(', ')}` });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El pedido debe incluir al menos un producto' });
  }
  for (const item of items) {
    if (!item.productId || typeof item.productId !== 'string') {
      return res.status(400).json({ error: 'Cada ítem debe tener un productId válido' });
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      return res.status(400).json({ error: 'La cantidad de cada ítem debe ser un número positivo' });
    }
  }

  try {
    const order = await prisma.order.create({
      data: {
        customerName: customerName.trim(),
        phone: phone?.trim() || null,
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
  } catch {
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

// PUT /api/orders/:id/status — update order status only
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status as Status)) {
    return res.status(400).json({ error: `El estado debe ser uno de: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } } },
    });
    res.json(order);
  } catch {
    res.status(404).json({ error: 'Pedido no encontrado' });
  }
});

// DELETE /api/orders/:id — delete order (and cascade items)
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.order.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Pedido no encontrado' });
  }
});

// ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  API server running at http://localhost:${PORT}`);
});
