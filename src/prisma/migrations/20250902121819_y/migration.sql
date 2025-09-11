/*
  Warnings:

  - Added the required column `afterState` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beforeState` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Activity" ADD COLUMN     "afterState" TEXT NOT NULL,
ADD COLUMN     "beforeState" TEXT NOT NULL;
