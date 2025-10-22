-- CreateTable for BookTranslation
CREATE TABLE "BookTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookTranslation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables for User (add language field)
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "language" TEXT NOT NULL DEFAULT 'fa',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_User" ("id", "email", "name", "password", "bio", "avatar", "createdAt", "updatedAt")
SELECT "id", "email", "name", "password", "bio", "avatar", "createdAt", "updatedAt" FROM "User";

DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- RedefineTables for Post (add language field)
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'fa',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "images" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Post" ("id", "userId", "title", "content", "category", "images", "visibility", "createdAt", "updatedAt")
SELECT "id", "userId", "title", "content", "category", "images", "visibility", "createdAt", "updatedAt" FROM "Post";

DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";

CREATE INDEX "Post_userId_idx" ON "Post"("userId");
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");
CREATE INDEX "Post_language_idx" ON "Post"("language");

-- RedefineTables for Book (remove title and author, keep other fields)
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalPages" INTEGER NOT NULL,
    "currentPage" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'reading',
    "coverImage" TEXT,
    "genre" TEXT,
    "notes" TEXT,
    "rating" INTEGER,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Book" ("id", "userId", "totalPages", "currentPage", "status", "coverImage", "genre", "notes", "rating", "startedAt", "completedAt", "createdAt", "updatedAt")
SELECT "id", "userId", "totalPages", "currentPage", "status", "coverImage", "genre", "notes", "rating", "startedAt", "completedAt", "createdAt", "updatedAt" FROM "Book";

DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";

CREATE INDEX "Book_userId_idx" ON "Book"("userId");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex for BookTranslation
CREATE UNIQUE INDEX "BookTranslation_bookId_language_key" ON "BookTranslation"("bookId", "language");
CREATE INDEX "BookTranslation_bookId_idx" ON "BookTranslation"("bookId");
CREATE INDEX "BookTranslation_language_idx" ON "BookTranslation"("language");
