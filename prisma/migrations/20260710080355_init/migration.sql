/*
  Warnings:

  - You are about to drop the column `logoId` on the `academy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[academyId,platform]` on the table `SocialMedia` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `academy` DROP FOREIGN KEY `Academy_logoId_fkey`;

-- DropIndex
DROP INDEX `Academy_logoId_fkey` ON `academy`;

-- AlterTable
ALTER TABLE `academy` DROP COLUMN `logoId`,
    ADD COLUMN `profileTrackingUrl` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `AcademyRule` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,

    INDEX `AcademyRule_academyId_fkey`(`academyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `SocialMedia_academyId_platform_key` ON `SocialMedia`(`academyId`, `platform`);

-- AddForeignKey
ALTER TABLE `AcademyRule` ADD CONSTRAINT `AcademyRule_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
