/*
  Warnings:

  - A unique constraint covering the columns `[shortName]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[color]` on the table `departments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `departments_shortName_key` ON `departments`(`shortName`);

-- CreateIndex
CREATE UNIQUE INDEX `departments_color_key` ON `departments`(`color`);
