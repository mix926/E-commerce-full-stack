-- AlterTable
ALTER TABLE `Product` ADD COLUMN `colors` TEXT NULL,
    ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sizes` TEXT NULL;
