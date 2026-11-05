-- CreateTable
CREATE TABLE `CategoryTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `categoryName` VARCHAR(191) NOT NULL,
    `lang` VARCHAR(191) NOT NULL,
    `translation` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CategoryTranslation_categoryName_idx`(`categoryName`),
    UNIQUE INDEX `CategoryTranslation_categoryName_lang_key`(`categoryName`, `lang`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `googleId` TO `User_googleId_key`;
