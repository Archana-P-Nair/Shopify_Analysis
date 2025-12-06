const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const shopDomain = 'demo-store.myshopify.com';

    
    const user = await prisma.user.upsert({
        where: { email: 'admin@xeno.com' },
        update: {},
        create: {
            email: 'admin@xeno.com',
            password: 'hashed_password_placeholder', 
        },
    });

    console.log('Created user:', user.id);

    
    const tenant = await prisma.tenant.upsert({
        where: { shopDomain },
        update: {},
        create: {
            shopDomain,
            accessToken: 'demo_token',
            userId: user.id,
        },
    });

    console.log('Created tenant:', tenant.id);

    
    const products = [
        { shopifyId: '101', title: 'Cool T-Shirt', price: 29.99 },
        { shopifyId: '102', title: 'Awesome Hoodie', price: 49.99 },
        { shopifyId: '103', title: 'Fancy Mug', price: 12.50 },
    ];

    for (const p of products) {
        await prisma.product.upsert({
            where: { shopifyId_tenantId: { shopifyId: p.shopifyId, tenantId: tenant.id } },
            update: {},
            create: { ...p, tenantId: tenant.id },
        });
    }

    
    const customers = [
        { shopifyId: '201', email: 'alice@example.com', firstName: 'Alice', lastName: 'Wonder', totalSpent: 150.00 },
        { shopifyId: '202', email: 'bob@example.com', firstName: 'Bob', lastName: 'Builder', totalSpent: 80.00 },
    ];

    for (const c of customers) {
        await prisma.customer.upsert({
            where: { shopifyId_tenantId: { shopifyId: c.shopifyId, tenantId: tenant.id } },
            update: {},
            create: { ...c, tenantId: tenant.id },
        });
    }

    
    const orders = [
        { shopifyId: '301', totalPrice: 29.99, createdAt: new Date('2023-10-01'), customerId: '201' },
        { shopifyId: '302', totalPrice: 49.99, createdAt: new Date('2023-10-02'), customerId: '201' },
        { shopifyId: '303', totalPrice: 12.50, createdAt: new Date('2023-10-03'), customerId: '202' },
        { shopifyId: '304', totalPrice: 100.00, createdAt: new Date('2023-10-05'), customerId: '201' },
    ];

    for (const o of orders) {
        const customer = await prisma.customer.findFirst({ where: { shopifyId: o.customerId, tenantId: tenant.id } });
        await prisma.order.upsert({
            where: { shopifyId_tenantId: { shopifyId: o.shopifyId, tenantId: tenant.id } },
            update: {},
            create: {
                shopifyId: o.shopifyId,
                totalPrice: o.totalPrice,
                createdAt: o.createdAt,
                tenantId: tenant.id,
                customerId: customer ? customer.id : null,
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
