/*
  Warnings:

  - You are about to alter the column `badgeNumber` on the `visits` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `visits` MODIFY `badgeNumber` INTEGER NOT NULL;
