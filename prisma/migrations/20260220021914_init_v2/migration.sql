-- CreateTable
CREATE TABLE "Report" (
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
    "condition" TEXT,
    "collar" BOOLEAN NOT NULL DEFAULT false,
    "privacy" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ReportUpdate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL DEFAULT 'COMMENT',
    "text" TEXT NOT NULL,
    "imagePath" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportId" INTEGER NOT NULL,
    CONSTRAINT "ReportUpdate_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HelpOffer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "message" TEXT,
    "helpType" TEXT,
    "availability" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportId" INTEGER NOT NULL,
    CONSTRAINT "HelpOffer_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vet" (
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
