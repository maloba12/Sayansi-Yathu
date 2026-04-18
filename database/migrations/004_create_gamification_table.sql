-- ============================================================
-- Gamification Table Migration
-- Run once against the sayansi_yathu database
-- ============================================================

CREATE TABLE IF NOT EXISTS gamification (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    user_id              INT NOT NULL,
    xp                   INT UNSIGNED NOT NULL DEFAULT 0,
    level                TINYINT UNSIGNED NOT NULL DEFAULT 1,
    streak               SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    badges               JSON NOT NULL DEFAULT ('[]'),
    experiments_completed INT UNSIGNED NOT NULL DEFAULT 0,
    updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                         ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_gamification_user (user_id),
    CONSTRAINT fk_gamification_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: seed existing users with starter rows (safe to run multiple times)
INSERT IGNORE INTO gamification (user_id, xp, level, streak, badges, experiments_completed)
SELECT id, 0, 1, 0, '[]', 0 FROM users;
