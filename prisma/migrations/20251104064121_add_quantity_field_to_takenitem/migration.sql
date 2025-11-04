/*
  Warnings:

  - Changed the type of `quantityId` on the `Takenitem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Takenitem" DROP COLUMN "quantityId",
ADD COLUMN     "quantityId" INTEGER NOT NULL;
