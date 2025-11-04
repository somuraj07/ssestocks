/*
  Warnings:

  - You are about to drop the column `quantityId` on the `Takenitem` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Takenitem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Takenitem" DROP COLUMN "quantityId",
ADD COLUMN     "quantity" INTEGER NOT NULL;
