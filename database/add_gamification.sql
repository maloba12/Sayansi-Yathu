-- Create gamification table
CREATE TABLE IF NOT EXISTS gamification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    experiments_completed INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed some initial data for testing
INSERT INTO gamification (user_id, xp, level, experiments_completed)
SELECT id, 100, 1, 5 FROM users WHERE role = 'student' LIMIT 5
ON DUPLICATE KEY UPDATE user_id=user_id;
