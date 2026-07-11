/*
  Warnings:

  - You are about to drop the column `isCurrent` on the `business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN "currentBusinessId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contactInformation" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_business" ("address", "contactInformation", "createdAt", "deletedAt", "id", "name", "updatedAt", "userId") SELECT "address", "contactInformation", "createdAt", "deletedAt", "id", "name", "updatedAt", "userId" FROM "business";
DROP TABLE "business";
ALTER TABLE "new_business" RENAME TO "business";
CREATE INDEX "business_userId_idx" ON "business"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
