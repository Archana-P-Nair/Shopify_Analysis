-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopDomain" TEXT NOT NULL,
    "accessToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "totalSpent" REAL NOT NULL DEFAULT 0.0,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Customer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyId" TEXT NOT NULL,
    "totalPrice" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT NOT NULL,
    "customerId" TEXT,
    CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_shopDomain_key" ON "Tenant"("shopDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Product_shopifyId_tenantId_key" ON "Product"("shopifyId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_shopifyId_tenantId_key" ON "Customer"("shopifyId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_tenantId_key" ON "Customer"("email", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_shopifyId_tenantId_key" ON "Order"("shopifyId", "tenantId");
