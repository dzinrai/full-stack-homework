-- CreateEnum
CREATE TYPE "Class" AS ENUM ('Math', 'Science', 'History');

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL,
    "class" "Class" NOT NULL,
    "grade" INTEGER NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);
