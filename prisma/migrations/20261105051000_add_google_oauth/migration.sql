-- AddColumn googleId to User
ALTER TABLE `User` ADD COLUMN `googleId` VARCHAR(191) UNIQUE;
