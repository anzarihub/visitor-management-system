/*
  Warnings:

  - You are about to drop the column `requirePasswordChangeAfterReset` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `sessionExpirationMins` on the `settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `settings` DROP COLUMN `requirePasswordChangeAfterReset`,
    DROP COLUMN `sessionExpirationMins`;
