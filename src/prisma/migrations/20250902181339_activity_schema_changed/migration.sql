/*
  Warnings:

  - Changed the type of `afterState` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `beforeState` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Activity" DROP COLUMN "afterState",
ADD COLUMN     "afterState" JSONB NOT NULL,
DROP COLUMN "beforeState",
ADD COLUMN     "beforeState" JSONB NOT NULL;
