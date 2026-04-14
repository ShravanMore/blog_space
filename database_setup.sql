-- =============================================
-- BlogSpace Database Setup Script
-- Run this entire script in MySQL Workbench
-- =============================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS blog;

-- Step 2: Switch to the database
USE blog;

-- Step 3: Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    image    VARCHAR(255) DEFAULT NULL
);

-- Step 4: Create the 'posts' table
CREATE TABLE IF NOT EXISTS posts (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    title    VARCHAR(255) NOT NULL,
    `desc`   TEXT,
    img      VARCHAR(255) DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    date     DATETIME DEFAULT CURRENT_TIMESTAMP,
    uid      INT NOT NULL,
    FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 5: Verify tables were created
SHOW TABLES;
DESCRIBE users;
DESCRIBE posts;
