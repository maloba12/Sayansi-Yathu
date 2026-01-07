-- Migration: align existing database with latest auth schema

-- 1) Ensure users table has the latest auth-related columns
ALTER TABLE users
    MODIFY COLUMN email VARCHAR(191) NOT NULL,
    ADD COLUMN IF NOT EXISTS username VARCHAR(64) NULL UNIQUE AFTER email,
    MODIFY COLUMN role ENUM('student', 'teacher', 'senior_teacher', 'head_teacher', 'hod', 'admin') NOT NULL DEFAULT 'student',
    ADD COLUMN IF NOT EXISTS failed_attempts INT UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS locked_until DATETIME NULL;

-- 2) Create students table if it does not exist
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(32) NOT NULL UNIQUE,
    grade_or_form VARCHAR(16) NOT NULL,
    class VARCHAR(32) NULL,
    stream VARCHAR(32) NULL,
    enrolled_year YEAR NOT NULL,
    school VARCHAR(191) NULL,
    date_of_birth DATE NULL,
    guardian_contact VARCHAR(64) NULL,
    linked_user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_user FOREIGN KEY (linked_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3) Create teachers table if it does not exist
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    school VARCHAR(191) NULL,
    linked_user_id INT UNSIGNED NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_teachers_user FOREIGN KEY (linked_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4) Create hods table if it does not exist
CREATE TABLE IF NOT EXISTS hods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    school VARCHAR(191) NULL,
    linked_user_id INT UNSIGNED NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hods_user FOREIGN KEY (linked_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5) Create admins table if it does not exist
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id VARCHAR(64) NOT NULL,
    school_name VARCHAR(191) NULL,
    linked_user_id INT UNSIGNED NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admins_user FOREIGN KEY (linked_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6) Create security_logs table if it does not exist
CREATE TABLE IF NOT EXISTS security_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NULL,
    event_type VARCHAR(64) NOT NULL,
    ip_address VARCHAR(64) NULL,
    user_agent VARCHAR(255) NULL,
    details JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_security_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7) Indexes to improve lookup performance
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_event ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_user ON security_logs(user_id);

