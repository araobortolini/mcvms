-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STORE',
    "permissions" TEXT DEFAULT '[]',
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
INSERT INTO "new_User" ("createdAt", "credits", "email", "expiresAt", "gracePeriodUsed", "graceStartedAt", "id", "isGraceActive", "name", "password", "permissions", "resellerId", "role", "tier", "updatedAt") SELECT "createdAt", "credits", "email", "expiresAt", "gracePeriodUsed", "graceStartedAt", "id", "isGraceActive", "name", "password", "permissions", "resellerId", "role", "tier", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
