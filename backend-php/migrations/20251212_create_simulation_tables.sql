-- Migration: Create Simulation Tables
-- Date: 2025-12-12
-- Description: Add tables for simulation framework (simulations, steps, progress)

-- Table: simulations
CREATE TABLE IF NOT EXISTS simulations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject ENUM('Biology', 'Chemistry', 'Physics') NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_subject (subject),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: simulation_steps
CREATE TABLE IF NOT EXISTS simulation_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    simulation_id INT NOT NULL,
    step_order INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    media_url VARCHAR(500),
    config_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (simulation_id) REFERENCES simulations(id) ON DELETE CASCADE,
    INDEX idx_simulation_order (simulation_id, step_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: student_progress
CREATE TABLE IF NOT EXISTS student_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    simulation_id INT NOT NULL,
    current_step INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    last_played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (simulation_id) REFERENCES simulations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_simulation (user_id, simulation_id),
    INDEX idx_user_progress (user_id, completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
