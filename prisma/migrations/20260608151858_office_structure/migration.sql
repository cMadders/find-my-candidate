/*
  Warnings:

  - You are about to drop the column `office` on the `Candidate` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Not_Available', 'STATE', 'COUNTY', 'FEDERAL');

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "office",
ADD COLUMN     "officeId" TEXT;

-- CreateTable
CREATE TABLE "Office" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "Level" NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;
