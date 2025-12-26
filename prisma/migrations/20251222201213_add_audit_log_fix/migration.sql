/*
  Warnings:

  - You are about to drop the column `domain` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `User` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "userId" TEXT NOT NULL,
    "targetId" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STORE',
    "tier" TEXT NOT NULL DEFAULT 'BRONZE',
    "credits" INTEGER NOT NULL DEFAULT 0,
    "isGraceActive" BOOLEAN NOT NULL DEFAULT false,
    "gracePeriodUsed" BOOLEAN NOT NULL DEFAULT false,
    "graceStartedAt" DATETIME,
    "expiresAt" DATETIME,
    "resellerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_resellerId_fkey" FOREIGN KEY ("resellerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "credits", "email", "expiresAt", "gracePeriodUsed", "graceStartedAt", "id", "isGraceActive", "name", "password", "resellerId", "role", "tier", "updatedAt") SELECT "createdAt", "credits", "email", "expiresAt", "gracePeriodUsed", "graceStartedAt", "id", "isGraceActive", "name", "password", "resellerId", "role", "tier", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
