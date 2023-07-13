CREATE TABLE `favourites` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`schemaType` enum('character','episode','location') NOT NULL,
	`schemaId` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(`schemaId`,`schemaType`,`userId`)
);
