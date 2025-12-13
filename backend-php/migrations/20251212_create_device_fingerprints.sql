-- Migration: create device_fingerprints table
CREATE TABLE IF NOT EXISTS device_fingerprints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_hash VARCHAR(64) NOT NULL,
    user_agent VARCHAR(255) NULL,
    ip_address VARCHAR(64) NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_device_fingerprints_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_device_hash ON device_fingerprints(device_hash);
CREATE INDEX idx_device_user ON device_fingerprints(user_id);
