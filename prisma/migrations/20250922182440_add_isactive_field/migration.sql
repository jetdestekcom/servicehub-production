-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "bio" TEXT,
    "twoFactorSecret" TEXT,
    "twoFactorBackupCodes" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "notificationSettings" TEXT,
    "socialLinks" TEXT,
    "languages" TEXT,
    "skills" TEXT,
    "experience" TEXT,
    "education" TEXT,
    "certifications" TEXT,
    "portfolio" TEXT,
    "availability" TEXT,
    "workingHours" TEXT,
    "serviceRadius" INTEGER,
    "responseTime" INTEGER,
    "completionRate" REAL,
    "joinDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("availability", "bio", "certifications", "completionRate", "createdAt", "education", "email", "emailNotifications", "emailVerified", "experience", "id", "image", "isVerified", "joinDate", "languages", "lastActive", "location", "name", "notificationSettings", "password", "phone", "portfolio", "pushNotifications", "rating", "responseTime", "reviewCount", "role", "serviceRadius", "skills", "smsNotifications", "socialLinks", "twoFactorBackupCodes", "twoFactorEnabled", "twoFactorSecret", "updatedAt", "verifiedAt", "workingHours") SELECT "availability", "bio", "certifications", "completionRate", "createdAt", "education", "email", "emailNotifications", "emailVerified", "experience", "id", "image", "isVerified", "joinDate", "languages", "lastActive", "location", "name", "notificationSettings", "password", "phone", "portfolio", "pushNotifications", "rating", "responseTime", "reviewCount", "role", "serviceRadius", "skills", "smsNotifications", "socialLinks", "twoFactorBackupCodes", "twoFactorEnabled", "twoFactorSecret", "updatedAt", "verifiedAt", "workingHours" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
