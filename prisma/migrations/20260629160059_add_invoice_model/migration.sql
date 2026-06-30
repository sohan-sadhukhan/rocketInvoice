-- CreateTable
CREATE TABLE "invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "clientId" TEXT,
    "clientName" TEXT NOT NULL,
    "clientAddress" TEXT NOT NULL,
    "clientContactInformation" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "globalDiscount" DECIMAL NOT NULL DEFAULT 0,
    "subtotal" DECIMAL NOT NULL,
    "itemDiscount" DECIMAL NOT NULL,
    "taxTotal" DECIMAL NOT NULL,
    "total" DECIMAL NOT NULL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "invoice_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoice_item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "price" DECIMAL NOT NULL,
    "discount" DECIMAL NOT NULL,
    "taxRate" DECIMAL NOT NULL,
    "lineTotal" DECIMAL NOT NULL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "invoice_item_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "invoice_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "invoice_businessId_idx" ON "invoice"("businessId");

-- CreateIndex
CREATE INDEX "invoice_clientId_idx" ON "invoice"("clientId");

-- CreateIndex
CREATE INDEX "invoice_item_invoiceId_idx" ON "invoice_item"("invoiceId");

-- CreateIndex
CREATE INDEX "invoice_item_productId_idx" ON "invoice_item"("productId");
