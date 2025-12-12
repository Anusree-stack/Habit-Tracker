-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Habit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "unit" TEXT,
    "target" REAL,
    "frequency" TEXT NOT NULL DEFAULT 'daily',
    "daysPerWeek" INTEGER NOT NULL DEFAULT 7,
    "icon" TEXT,
    "color" TEXT NOT NULL DEFAULT '#4fd1c5',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Habit" ("color", "createdAt", "daysPerWeek", "description", "frequency", "icon", "id", "name", "target", "type", "unit", "userId") SELECT "color", "createdAt", "daysPerWeek", "description", "frequency", "icon", "id", "name", "target", "type", "unit", "userId" FROM "Habit";
DROP TABLE "Habit";
ALTER TABLE "new_Habit" RENAME TO "Habit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
