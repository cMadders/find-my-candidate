/*
  Warnings:

  - A unique constraint covering the columns `[name,level,district]` on the table `Office` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Office_name_level_district_key" ON "Office"("name", "level", "district");
