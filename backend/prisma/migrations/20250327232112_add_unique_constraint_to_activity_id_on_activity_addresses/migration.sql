/*
  Warnings:

  - A unique constraint covering the columns `[activityId]` on the table `activity_addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "activity_addresses_activityId_key" ON "activity_addresses"("activityId");
