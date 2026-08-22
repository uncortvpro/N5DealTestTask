-- CreateTable
CREATE TABLE `Sector` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Sector_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Region_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed the canonical taxonomy that used to be the Sector/Region enums.
-- This must run before the foreign keys below are added, since Asset and
-- BuyerSector/BuyerRegion rows already reference these exact key strings.
INSERT INTO `Sector` (`key`, `label`) VALUES
  ('TECHNOLOGY', 'Technology'),
  ('HEALTHCARE', 'Healthcare'),
  ('MANUFACTURING', 'Manufacturing'),
  ('FINANCIAL_SERVICES', 'Financial Services'),
  ('REAL_ESTATE', 'Real Estate'),
  ('ENERGY', 'Energy'),
  ('RETAIL', 'Retail'),
  ('OTHER', 'Other');

INSERT INTO `Region` (`key`, `label`) VALUES
  ('NORTH_AMERICA', 'North America'),
  ('EUROPE', 'Europe'),
  ('APAC', 'APAC'),
  ('LATAM', 'LATAM'),
  ('MEA', 'Middle East & Africa'),
  ('GLOBAL', 'Global');

-- AlterTable: enum -> plain string column (same values, now FK'd by key
-- instead of fixed at the DB-engine level).
ALTER TABLE `Asset` MODIFY `sector` VARCHAR(191) NOT NULL;
ALTER TABLE `Asset` MODIFY `region` VARCHAR(191) NOT NULL;
ALTER TABLE `BuyerSector` MODIFY `sector` VARCHAR(191) NOT NULL;
ALTER TABLE `BuyerRegion` MODIFY `region` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Asset` ADD CONSTRAINT `Asset_sector_fkey` FOREIGN KEY (`sector`) REFERENCES `Sector`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Asset` ADD CONSTRAINT `Asset_region_fkey` FOREIGN KEY (`region`) REFERENCES `Region`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `BuyerSector` ADD CONSTRAINT `BuyerSector_sector_fkey` FOREIGN KEY (`sector`) REFERENCES `Sector`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `BuyerRegion` ADD CONSTRAINT `BuyerRegion_region_fkey` FOREIGN KEY (`region`) REFERENCES `Region`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;
