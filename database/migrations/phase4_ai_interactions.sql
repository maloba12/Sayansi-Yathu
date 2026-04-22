USE sayansi_yathu;

CREATE TABLE IF NOT EXISTS ai_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    experiment_id VARCHAR(100) NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
