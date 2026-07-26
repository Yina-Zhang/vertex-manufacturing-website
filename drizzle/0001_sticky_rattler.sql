CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`customerType` varchar(32) NOT NULL,
	`country` varchar(128) NOT NULL,
	`processType` varchar(128) NOT NULL,
	`description` text,
	`filesJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
