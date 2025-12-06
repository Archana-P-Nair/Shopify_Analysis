const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { authenticateToken, JWT_SECRET } = require('./middleware/auth');

// ... (previous imports)

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(400).json({ error: 'User already exists' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Store Management Routes
app.post('/api/stores', authenticateToken, async (req, res) => {
    const { shopDomain, accessToken } = req.body;
    try {
        const tenant = await prisma.tenant.create({
            data: {
                shopDomain,
                accessToken,
                userId: req.user.id,
            },
        });
        res.json(tenant);
    } catch (error) {
        res.status(400).json({ error: 'Store already exists' });
    }
});

app.get('/api/stores', authenticateToken, async (req, res) => {
    try {
        const tenants = await prisma.tenant.findMany({
            where: { userId: req.user.id },
        });
        res.json(tenants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Middleware to resolve Tenant from Header (Modified for Auth)
app.use(async (req, res, next) => {
    // Skip for auth routes
    if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/stores')) return next();

    const shopDomain = req.headers['x-shop-domain'];
    if (!shopDomain) return res.status(400).json({ error: 'x-shop-domain header required' });

    try {
        const tenant = await prisma.tenant.findUnique({ where: { shopDomain } });
        if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

        req.tenant = tenant; // Attach full tenant object (with accessToken)
        req.tenantId = tenant.id;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Real Shopify Ingestion
app.post('/api/ingest', async (req, res) => {
    const { type } = req.body; // type: 'products' | 'orders' | 'customers'
    const tenant = req.tenant;

    if (!tenant.accessToken) {
        return res.status(400).json({ error: 'Shopify Access Token missing for this store' });
    }

    const shopifyClient = axios.create({
        baseURL: `https://${tenant.shopDomain}/admin/api/2023-10`,
        headers: {
            'X-Shopify-Access-Token': tenant.accessToken,
            'Content-Type': 'application/json',
        },
    });

    try {
        let fetchedData = [];
        if (type === 'products') {
            const response = await shopifyClient.get('/products.json');
            fetchedData = response.data.products;

            for (const item of fetchedData) {
                await prisma.product.upsert({
                    where: { shopifyId_tenantId: { shopifyId: String(item.id), tenantId: tenant.id } },
                    update: { title: item.title, price: parseFloat(item.variants[0]?.price || 0) },
                    create: {
                        shopifyId: String(item.id),
                        title: item.title,
                        price: parseFloat(item.variants[0]?.price || 0),
                        tenantId: tenant.id,
                    },
                });
            }
        } else if (type === 'orders') {
            const response = await shopifyClient.get('/orders.json?status=any');
            fetchedData = response.data.orders;

            for (const item of fetchedData) {
                let customerId = null;
                if (item.customer) {
                    const customer = await prisma.customer.upsert({
                        where: { shopifyId_tenantId: { shopifyId: String(item.customer.id), tenantId: tenant.id } },
                        update: {
                            email: item.customer.email,
                            firstName: item.customer.first_name,
                            lastName: item.customer.last_name,
                            totalSpent: parseFloat(item.customer.total_spent || 0)
                        },
                        create: {
                            shopifyId: String(item.customer.id),
                            email: item.customer.email,
                            firstName: item.customer.first_name,
                            lastName: item.customer.last_name,
                            totalSpent: parseFloat(item.customer.total_spent || 0),
                            tenant: { connect: { id: tenant.id } },
                        }
                    });
                    customerId = customer.id;
                }

                await prisma.order.upsert({
                    where: { shopifyId_tenantId: { shopifyId: String(item.id), tenantId: tenant.id } },
                    update: {
                        totalPrice: parseFloat(item.total_price),
                        customerId: customerId
                    },
                    create: {
                        shopifyId: String(item.id),
                        totalPrice: parseFloat(item.total_price),
                        currency: item.currency || 'USD',
                        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
                        tenantId: tenant.id,
                        customerId: customerId
                    },
                });
            }
        }

        res.json({ success: true, message: `Ingested ${fetchedData.length} ${type} from Shopify` });
    } catch (error) {
        console.error('Shopify API Error:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.errors || error.message;
        res.status(500).json({ error: `Shopify Error: ${JSON.stringify(errorMessage)}` });
    }
});

// Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
    const tenantId = req.tenantId;

    try {
        const totalCustomers = await prisma.customer.count({ where: { tenantId } });
        const totalOrders = await prisma.order.count({ where: { tenantId } });
        const totalRevenue = await prisma.order.aggregate({
            where: { tenantId },
            _sum: { totalPrice: true },
        });

        res.json({
            totalCustomers,
            totalOrders,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Orders Chart Data (Group by Date)
app.get('/api/dashboard/orders-trend', async (req, res) => {
    const tenantId = req.tenantId;

    try {
        // Prisma doesn't support date grouping natively in SQLite easily without raw query
        // For simplicity, we'll fetch orders and group in JS (fine for small dataset)
        const orders = await prisma.order.findMany({
            where: { tenantId },
            select: { createdAt: true, totalPrice: true },
            orderBy: { createdAt: 'asc' }
        });

        const grouped = orders.reduce((acc, order) => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!acc[date]) acc[date] = 0;
            acc[date] += 1;
            return acc;
        }, {});

        const chartData = Object.entries(grouped).map(([date, count]) => ({ date, count }));
        res.json(chartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export for Vercel
module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
