-- AlterTable
ALTER TABLE "ContactRequest" ADD COLUMN "type" TEXT;

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condition" TEXT,
    "collar" BOOLEAN NOT NULL DEFAULT false,
    "privacy" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Report" ("age", "animalType", "breed", "createdAt", "description", "id", "imagePath", "locationLat", "locationLng", "status", "tags") SELECT "age", "animalType", "breed", "createdAt", "description", "id", "imagePath", "locationLat", "locationLng", "status", "tags" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
