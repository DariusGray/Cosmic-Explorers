//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const pool = require("../services/db");

//////////////////////////////////////////////////////
// SQL STATEMENTS
// Drops and recreates tables for consistent local setup.
// Includes authentication-ready User schema (email + password_hash).
//////////////////////////////////////////////////////
const SQLSTATEMENT = `
-- Reset database
DROP TABLE IF EXISTS UserCompletion;
DROP TABLE IF EXISTS WellnessChallenge;
DROP TABLE IF EXISTS UserPlanet;
DROP TABLE IF EXISTS Planet;
DROP TABLE IF EXISTS User;

-- Create User table (authentication-ready)
CREATE TABLE User (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  points INT NOT NULL DEFAULT 0,
  latest_discovered_planet VARCHAR(100) NOT NULL DEFAULT 'Mercury Outpost – First Launch'
);

-- Create WellnessChallenge table
CREATE TABLE WellnessChallenge (
  challenge_id INT PRIMARY KEY AUTO_INCREMENT,
  creator_id INT NOT NULL,
  description TEXT NOT NULL,
  points INT NOT NULL
);

-- Create UserCompletion table
CREATE TABLE UserCompletion (
  completion_id INT PRIMARY KEY AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  details TEXT NOT NULL
);

-- Create Planet table
CREATE TABLE Planet (
  planet_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  unlock_points INT NOT NULL
);

-- Create UserPlanet table
CREATE TABLE UserPlanet (
  user_id INT NOT NULL,
  planet_id INT NOT NULL,
  unlocked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, planet_id)
);

-- Seed data
-- Seed users contain placeholder bcrypt hashes for schema seeding only.
INSERT INTO User (username, email, password_hash, points, latest_discovered_planet) VALUES
('Raphael', 'raphael@example.com', '$2b$10$PLACEHOLDER_HASH', 50, 'Mercury Outpost – First Launch'),
('Agartha', 'agartha@example.com', '$2b$10$PLACEHOLDER_HASH', 40, 'Mercury Outpost – First Launch'),
('Kom', 'kom@example.com', '$2b$10$PLACEHOLDER_HASH', 30, 'Mercury Outpost – First Launch'),
('Lucas', 'lucas@example.com', '$2b$10$PLACEHOLDER_HASH', 60, 'Lunar Base – Orbital Habitation Zone'),
('Yang Zheng', 'yangzheng@example.com', '$2b$10$PLACEHOLDER_HASH', 10, 'Mercury Outpost – First Launch'),
('Aditya', 'aditya@example.com', '$2b$10$PLACEHOLDER_HASH', 0, 'Mercury Outpost – First Launch'),
('Darius', 'darius@example.com', '$2b$10$PLACEHOLDER_HASH', 500, 'Jupiter Station – Deep Space Command');

-- Seed wellness challenges
INSERT INTO WellnessChallenge (creator_id, description, points) VALUES
(1, 'Recharge Protocol – Get at least 7 hours of quality sleep', 10),
(1, 'Gravity Test – Choose the stairs over the elevator today', 20),
(2, 'Signal Silence – Stay off your phone for one full hour', 10),
(2, 'Surface Exploration – Take a 15-minute walk outdoors', 10),
(2, 'Crew Connection – Have a face-to-face conversation with a friend', 20),
(3, 'System Cleanup – Organise your desk or personal space', 20),
(3, 'Support Mission – Help someone without being asked', 20);

-- Seed user completions
INSERT INTO UserCompletion (challenge_id, user_id, details) VALUES
(1, 1, 'Crew well-rested after full night sleep.'),
(1, 2, 'Woke up feeling refreshed and alert.'),
(2, 3, 'Took stairs instead of elevator.'),
(3, 2, 'Completed one-hour phone detox.'),
(3, 5, 'Went outdoors for a short walk.'),
(5, 4, 'Had meaningful face-to-face conversation.');

-- Seed planets
INSERT INTO Planet (name, unlock_points) VALUES
('Mercury Outpost – First Launch', 30),
('Asteroid Relay – Resource Checkpoint', 90),
('Neptune Observatory – Outer System Watchpost', 250),
('Jupiter Station – Deep Space Command', 500);
`;

//////////////////////////////////////////////////////
// EXECUTE INITIALIZATION
//////////////////////////////////////////////////////
pool.query(SQLSTATEMENT, (error) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
    console.log("Seed users contain placeholder password hashes; authentication tests should use registered accounts.");
  }
  process.exit();
});
