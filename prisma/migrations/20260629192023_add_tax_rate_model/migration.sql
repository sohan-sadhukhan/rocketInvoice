-- CreateTable
CREATE TABLE "tax_rate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "percent" DECIMAL NOT NULL,
    "businessId" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tax_rate_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "tax_rate_businessId_idx" ON "tax_rate"("businessId");
