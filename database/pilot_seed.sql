-- Phase 5 Pilot Seed Data
-- 5 Schools (2 Urban, 3 Rural) for Zambia Digital Deployment

INSERT INTO schools (id, name, district, type) VALUES
(1, 'Kabulonga Boys Secondary', 'Lusaka', 'Urban'),
(2, 'Munali Girls Secondary', 'Lusaka', 'Urban'),
(3, 'Macha Day Secondary', 'Choma', 'Rural'),
(4, 'Chikankata High School', 'Mazabuka', 'Rural'),
(5, 'Lubwe Mission School', 'Samfya', 'Rural')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Pre-configure Teacher Accounts for Pilot
INSERT INTO users (id, name, email, role, password_hash, school_id) VALUES
(101, 'Teacher Phiri', 'phiri@kabulonga.edu.zm', 'teacher', 'pbkdf2:sha256:20000$mockhash', 1),
(102, 'Teacher Mwaba', 'mwaba@munali.edu.zm', 'teacher', 'pbkdf2:sha256:20000$mockhash', 2),
(103, 'Teacher Tembo', 'tembo@macha.edu.zm', 'teacher', 'pbkdf2:sha256:20000$mockhash', 3),
(104, 'Teacher Banda', 'banda@chikankata.edu.zm', 'teacher', 'pbkdf2:sha256:20000$mockhash', 4),
(105, 'Teacher Kalala', 'kalala@lubwe.edu.zm', 'teacher', 'pbkdf2:sha256:20000$mockhash', 5)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Pre-configure 2 Students per Rural school for baseline bandwidth tracking
INSERT INTO users (id, name, email, role, password_hash, school_id) VALUES
(201, 'Student M1', 'sm1@macha.edu.zm', 'student', 'pbkdf2:sha256:20000$mockhash', 3),
(202, 'Student M2', 'sm2@macha.edu.zm', 'student', 'pbkdf2:sha256:20000$mockhash', 3),
(203, 'Student C1', 'sc1@chikankata.edu.zm', 'student', 'pbkdf2:sha256:20000$mockhash', 4),
(204, 'Student C2', 'sc2@chikankata.edu.zm', 'student', 'pbkdf2:sha256:20000$mockhash', 4),
(205, 'Student L1', 'sl1@lubwe.edu.zm', 'student', 'pbkdf2:sha256:20000$mockhash', 5),
(206, 'Student L2', 'sl2@lubwe.edu.zm', 'student', 'pbkdf2:sha256:20000$mockhash', 5)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Sample Classes for Pilot
INSERT INTO classes (id, name, teacher_id) VALUES
(10, 'Form 3 M', 103),
(11, 'Form 4 C', 104),
(12, 'Form 2 L', 105)
ON DUPLICATE KEY UPDATE name=VALUES(name);
