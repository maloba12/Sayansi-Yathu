-- Phase 5: Privacy & Consent Module Setup
-- Allows MoE to track analytics anonymously via legal consent

ALTER TABLE users 
ADD COLUMN consent_status BOOLEAN DEFAULT FALSE COMMENT '1 if user accepted data tracking, 0 if denied or unprompted';

-- (Optional) If we need an explicit table for historical consent tracking logs
CREATE TABLE IF NOT EXISTS consent_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action ENUM('granted', 'revoked') NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
