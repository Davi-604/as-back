-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `grouped` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_event` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventPeople` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_event` INTEGER NOT NULL,
    `id_group` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `matched` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventGroup` ADD CONSTRAINT `EventGroup_id_event_fkey` FOREIGN KEY (`id_event`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventPeople` ADD CONSTRAINT `EventPeople_id_event_fkey` FOREIGN KEY (`id_event`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventPeople` ADD CONSTRAINT `EventPeople_id_group_fkey` FOREIGN KEY (`id_group`) REFERENCES `EventGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
