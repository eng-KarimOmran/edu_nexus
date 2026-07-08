-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentLink` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `walletProvider` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialMedia` (
    `id` VARCHAR(191) NOT NULL,
    `platform` ENUM('FACEBOOK', 'TIKTOK', 'INSTAGRAM', 'TWITTER', 'YOUTUBE', 'LINKEDIN', 'SNAPCHAT', 'WHATSAPP', 'GOOGLEMAP', 'GMAIL') NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AcademyPhone` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AcademyPhone_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Academy` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `logoId` VARCHAR(191) NULL,

    UNIQUE INDEX `Academy_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Image_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet` (
    `id` VARCHAR(191) NOT NULL,
    `walletType` ENUM('CLIENT', 'ACADEMY', 'JOB_PROFILE') NOT NULL,
    `clientId` VARCHAR(191) NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `jobProfileId` VARCHAR(191) NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `Wallet_clientId_key`(`clientId`),
    UNIQUE INDEX `Wallet_jobProfileId_academyId_key`(`jobProfileId`, `academyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlacklistedToken` (
    `id` VARCHAR(191) NOT NULL,
    `jti` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlacklistedToken_jti_key`(`jti`),
    INDEX `BlacklistedToken_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `source` ENUM('PLATFORM', 'OFFICE') NOT NULL DEFAULT 'OFFICE',
    `academyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Client_phone_academyId_key`(`phone`, `academyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `priceOriginal` DOUBLE NOT NULL,
    `priceDiscounted` DOUBLE NOT NULL,
    `requiredInitialDeposit` DOUBLE NOT NULL,
    `totalSessions` INTEGER NOT NULL,
    `sessionsBeforeFullPayment` INTEGER NOT NULL,
    `sessionDurationMinutes` INTEGER NOT NULL,
    `featuredReason` VARCHAR(191) NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Course_academyId_name_key`(`academyId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `subscriptionStatus` ENUM('PENDING_DEPOSIT', 'PENDING_FIRST_SESSION', 'GRACE_PERIOD', 'SUSPENDED', 'ACTIVE', 'CANCELED', 'COMPLETED') NOT NULL DEFAULT 'PENDING_DEPOSIT',
    `priceAtBooking` DOUBLE NOT NULL,
    `totalSessions` INTEGER NOT NULL,
    `sessionDurationMinutes` INTEGER NOT NULL,
    `requiredInitialDeposit` DOUBLE NOT NULL,
    `sessionsBeforeFullPayment` INTEGER NOT NULL,
    `trainingTypeAtRegistration` ENUM('MANUAL', 'AUTOMATIC') NOT NULL,
    `courseName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `walletClientId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `areaId` VARCHAR(191) NOT NULL,
    `payrollId` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NULL,

    INDEX `Subscription_clientId_idx`(`clientId`),
    INDEX `Subscription_academyId_idx`(`academyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobProfile` (
    `id` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `supportType` ENUM('MANUAL', 'AUTOMATIC', 'BOTH') NULL,
    `jobProfileType` ENUM('CAPTAIN', 'SECRETARY', 'MANAGER') NOT NULL,
    `baseSalary` DOUBLE NOT NULL DEFAULT 0,
    `lessonPrice` DOUBLE NOT NULL DEFAULT 0,
    `targetCount` INTEGER NOT NULL DEFAULT 0,
    `bonusAmount` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `JobProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `email` VARCHAR(191) NULL,
    `logoutAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isPasswordChanged` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_phone_key`(`phone`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseFeature` (
    `id` VARCHAR(191) NOT NULL,
    `feature` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `id` VARCHAR(191) NOT NULL,
    `modelName` VARCHAR(191) NOT NULL,
    `plateNumber` VARCHAR(191) NOT NULL,
    `gearType` ENUM('MANUAL', 'AUTOMATIC') NOT NULL,
    `carSessionPrice` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Car_plateNumber_key`(`plateNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `supportType` ENUM('MANUAL', 'AUTOMATIC', 'BOTH') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Area_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `lessonStatus` ENUM('SCHEDULED', 'COMPLETED', 'CANCELED', 'CANCELED_CHARGED') NOT NULL DEFAULT 'SCHEDULED',
    `transmission` ENUM('MANUAL', 'AUTOMATIC') NOT NULL,
    `sessionDurationMinutes` INTEGER NOT NULL,
    `expectedPaymentAmount` DOUBLE NULL,
    `carSessionPrice` DOUBLE NOT NULL,
    `captainLessonPrice` DOUBLE NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `subscriptionId` VARCHAR(191) NOT NULL,
    `carId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `jobProfileId` VARCHAR(191) NOT NULL,
    `areaId` VARCHAR(191) NOT NULL,
    `walletMovementId` VARCHAR(191) NULL,
    `payrollId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WalletMovement` (
    `id` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `transactionType` ENUM('SUBSCRIPTION_CREATED', 'CUSTOMER_PAYMENT', 'SUBSCRIPTION_CANCELLED', 'CUSTOMER_REFUND', 'EMPLOYEE_TRANSFER_TO_EMPLOYEE', 'ACADEMY_TRANSFER_TO_EMPLOYEE', 'EMPLOYEE_TRANSFER_TO_ACADEMY', 'MANUAL_ADJUSTMENT') NOT NULL,
    `paymentMethod` ENUM('MONETARY', 'ELECTRONIC', 'TRANSFER') NOT NULL DEFAULT 'TRANSFER',
    `amount` DECIMAL(12, 2) NOT NULL,
    `paymentProofImageId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subscriptionId` VARCHAR(191) NULL,
    `walletMovementStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    INDEX `WalletMovement_senderId_idx`(`senderId`),
    INDEX `WalletMovement_receiverId_idx`(`receiverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payroll` (
    `id` VARCHAR(191) NOT NULL,
    `academyId` VARCHAR(191) NOT NULL,
    `jobProfileId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `baseSalary` DOUBLE NOT NULL,
    `totalLessonsCount` INTEGER NOT NULL,
    `lessonsAmount` DOUBLE NOT NULL,
    `totalSubscriptionsCount` INTEGER NOT NULL,
    `subscriptionsAmount` DOUBLE NOT NULL,
    `earningsAmount` DOUBLE NOT NULL,
    `grossAmount` DOUBLE NOT NULL,
    `bonusAmount` DOUBLE NOT NULL DEFAULT 0,
    `deductions` DOUBLE NOT NULL DEFAULT 0,
    `netAmount` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AcademyOwners` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AcademyOwners_AB_unique`(`A`, `B`),
    INDEX `_AcademyOwners_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentLink` ADD CONSTRAINT `PaymentLink_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SocialMedia` ADD CONSTRAINT `SocialMedia_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AcademyPhone` ADD CONSTRAINT `AcademyPhone_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Academy` ADD CONSTRAINT `Academy_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_jobProfileId_fkey` FOREIGN KEY (`jobProfileId`) REFERENCES `JobProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_payrollId_fkey` FOREIGN KEY (`payrollId`) REFERENCES `Payroll`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `JobProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobProfile` ADD CONSTRAINT `JobProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseFeature` ADD CONSTRAINT `CourseFeature_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_jobProfileId_fkey` FOREIGN KEY (`jobProfileId`) REFERENCES `JobProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_walletMovementId_fkey` FOREIGN KEY (`walletMovementId`) REFERENCES `WalletMovement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_payrollId_fkey` FOREIGN KEY (`payrollId`) REFERENCES `Payroll`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WalletMovement` ADD CONSTRAINT `WalletMovement_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WalletMovement` ADD CONSTRAINT `WalletMovement_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WalletMovement` ADD CONSTRAINT `WalletMovement_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WalletMovement` ADD CONSTRAINT `WalletMovement_paymentProofImageId_fkey` FOREIGN KEY (`paymentProofImageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WalletMovement` ADD CONSTRAINT `WalletMovement_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payroll` ADD CONSTRAINT `Payroll_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payroll` ADD CONSTRAINT `Payroll_jobProfileId_fkey` FOREIGN KEY (`jobProfileId`) REFERENCES `JobProfile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AcademyOwners` ADD CONSTRAINT `_AcademyOwners_A_fkey` FOREIGN KEY (`A`) REFERENCES `Academy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AcademyOwners` ADD CONSTRAINT `_AcademyOwners_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
