-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "imagePath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportId" INTEGER NOT NULL,
    CONSTRAINT "Comment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportId" INTEGER NOT NULL,
    CONSTRAINT "ContactRequest_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imagePath" TEXT NOT NULL,
    "description" TEXT,
    "locationLat" REAL,
    "locationLng" REAL,
    "breed" TEXT,
    "age" TEXT,
    "animalType" TEXT,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REPORTED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Report" ("age", "animalType", "breed", "createdAt", "description", "id", "imagePath", "locationLat", "locationLng", "status", "tags") SELECT "age", "animalType", "breed", "createdAt", "description", "id", "imagePath", "locationLat", "locationLng", "status", "tags" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE TABLE "new_Vet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "hours" TEXT,
    "locationLat" REAL,
    "locationLng" REAL,
    "website" TEXT,
    "specialties" TEXT,
    "emergency" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Vet" ("address", "hours", "id", "locationLat", "locationLng", "name", "phone") SELECT "address", "hours", "id", "locationLat", "locationLng", "name", "phone" FROM "Vet";
DROP TABLE "Vet";
ALTER TABLE "new_Vet" RENAME TO "Vet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
