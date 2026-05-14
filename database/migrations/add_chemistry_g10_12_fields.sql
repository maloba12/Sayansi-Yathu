-- Migration: Add Chemistry G10-12 extended fields
USE sayansi_yathu;

ALTER TABLE experiments
    ADD COLUMN IF NOT EXISTS topic VARCHAR(120) NULL AFTER subject,
    ADD COLUMN IF NOT EXISTS subject_area VARCHAR(120) NULL AFTER topic,
    ADD COLUMN IF NOT EXISTS experiment_code VARCHAR(24) NULL AFTER subject_area,
    ADD COLUMN IF NOT EXISTS estimated_duration INT UNSIGNED NOT NULL DEFAULT 30 AFTER experiment_code,
    ADD COLUMN IF NOT EXISTS apparatus TEXT NULL AFTER estimated_duration,
    ADD COLUMN IF NOT EXISTS expected_outcome TEXT NULL AFTER apparatus,
    ADD COLUMN IF NOT EXISTS theory_background TEXT NULL AFTER expected_outcome,
    ADD COLUMN IF NOT EXISTS safety_precautions TEXT NULL AFTER theory_background,
    ADD COLUMN IF NOT EXISTS viva_questions TEXT NULL AFTER safety_precautions,
    ADD COLUMN IF NOT EXISTS teacher_notes TEXT NULL AFTER viva_questions;

CREATE INDEX IF NOT EXISTS idx_experiment_code ON experiments(experiment_code);
CREATE INDEX IF NOT EXISTS idx_experiment_topic ON experiments(topic);

SELECT 'Migration complete: Chemistry G10-12 fields added.' AS status;
