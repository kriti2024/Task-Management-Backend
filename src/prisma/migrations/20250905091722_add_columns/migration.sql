/*
  Warnings:

  - You are about to drop the column `details` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Activity" DROP COLUMN "details",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "endDate",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_code_key" ON "public"."Task"("code");
