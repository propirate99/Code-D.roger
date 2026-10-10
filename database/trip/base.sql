CREATE DATABASE IF NOT EXISTS tripgenie
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE tripgenie;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS sync_queue;
DROP TABLE IF EXISTS booking_actions;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS availability_slots;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS providers;

SET FOREIGN_KEY_CHECKS = 1;