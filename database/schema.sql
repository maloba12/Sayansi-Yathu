-- Create database
<<<<<<< HEAD
CREATE DATABASE IF NOT EXISTS sayansi_yesu;
USE sayansi_yesu;

-- Core users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    username VARCHAR(64) NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'senior_teacher', 'head_teacher', 'hod', 'admin') NOT NULL DEFAULT 'student',
    failed_attempts INT UNSIGNED NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(32) NOT NULL UNIQUE,
    grade_or_form VARCHAR(16) NOT NULL,
    class VARCHAR(32) NULL,
    stream VARCHAR(32) NULL,
    enrolled_year YEAR NOT NULL,
    school VARCHAR(191) NULL,
    date_of_birth DATE NULL,
    guardian_contact VARCHAR(64) NULL,
    linked_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_user FOREIGN KEY (linked_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Teachers table
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    school VARCHAR(191) NULL,
    linked_user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_teachers_user FOREIGN KEY (linked_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- HODs table
CREATE TABLE hods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    school VARCHAR(191) NULL,
    linked_user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hods_user FOREIGN KEY (linked_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admins / headteachers table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id VARCHAR(64) NOT NULL,
    school_name VARCHAR(191) NULL,
    linked_user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admins_user FOREIGN KEY (linked_user_id) REFERENCES users(id) ON DELETE CASCADE
);

=======
CREATE DATABASE IF NOT EXISTS sayansi_yathu;
USE sayansi_yathu;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
-- Experiments table
CREATE TABLE experiments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject ENUM('physics', 'chemistry', 'biology') NOT NULL,
    description TEXT,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
    simulation_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress tracking
CREATE TABLE progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    experiment_id INT NOT NULL,
    completed_steps INT DEFAULT 0,
    total_steps INT DEFAULT 0,
    score DECIMAL(5,2) DEFAULT 0.00,
    time_spent INT DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (experiment_id) REFERENCES experiments(id),
    UNIQUE KEY unique_user_experiment (user_id, experiment_id)
);

-- AI interaction logs
CREATE TABLE ai_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    experiment_id INT,
    question TEXT,
    response TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (experiment_id) REFERENCES experiments(id)
);

<<<<<<< HEAD
-- Security / audit logs
CREATE TABLE security_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    event_type VARCHAR(64) NOT NULL,
    ip_address VARCHAR(64) NULL,
    user_agent VARCHAR(255) NULL,
    details JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_security_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_student_id ON students(student_id);
CREATE INDEX idx_security_logs_event ON security_logs(event_type);
CREATE INDEX idx_security_logs_user ON security_logs(user_id);
=======
-- Create indexes
CREATE INDEX idx_user_email ON users(email);
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
CREATE INDEX idx_experiment_subject ON experiments(subject);
CREATE INDEX idx_progress_user ON progress(user_id);