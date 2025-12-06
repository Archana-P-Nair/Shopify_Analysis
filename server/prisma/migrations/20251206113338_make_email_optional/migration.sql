-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyId" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "totalSpent" REAL NOT NULL DEFAULT 0.0,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Customer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Customer" ("createdAt", "email", "firstName", "id", "lastName", "shopifyId", "tenantId", "totalSpent") SELECT "createdAt", "email", "firstName", "id", "lastName", "shopifyId", "tenantId", "totalSpent" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_shopifyId_tenantId_key" ON "Customer"("shopifyId", "tenantId");
CREATE UNIQUE INDEX "Customer_email_tenantId_key" ON "Customer"("email", "tenantId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
