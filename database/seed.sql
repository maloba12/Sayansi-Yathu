-- Insert sample experiments
INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type) VALUES
('Simple Pendulum', 'physics', 'Study the motion of a simple pendulum', 'beginner', 'threejs'),
<<<<<<< HEAD
('Ohm''s Law Circuit', 'physics', 'Verify Ohm''s law using virtual circuits', 'intermediate', 'threejs'),
=======
('Ohm\'s Law Circuit', 'physics', 'Verify Ohm\'s law using virtual circuits', 'intermediate', 'threejs'),
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
('Acid-Base Titration', 'chemistry', 'Perform acid-base titration experiment', 'intermediate', 'p5js'),
('Chemical Reactions', 'chemistry', 'Observe different types of chemical reactions', 'beginner', 'p5js'),
('Cell Structure', 'biology', 'Explore animal and plant cell structures', 'beginner', 'threejs'),
('DNA Replication', 'biology', 'Visualize DNA replication process', 'advanced', 'threejs');

-- Insert sample users
<<<<<<< HEAD
-- Password hash below is the standard bcrypt hash for "password" (for dev/testing only)
INSERT INTO users (name, email, username, password, role) VALUES
('Natasha Kalusa', 'NatashaK@sayansi-yathu.com', 'natasha', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Mary Phiri', 'mary@sayansi-yathu.com', 'mary', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
('Mpundu Maloba', 'MpunduM@sayansi-yathu.com', 'mpundu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample student profile linked to user id 1
INSERT INTO students (student_id, grade_or_form, class, stream, enrolled_year, school, date_of_birth, guardian_contact, linked_user_id)
VALUES
('STU-2025-G10-001', 'G10', '10A', 'Science', 2025, 'Lusaka Secondary School', '2010-03-15', '+260977000001', 1);

-- Insert sample teacher profile linked to user id 2
INSERT INTO teachers (department, school, linked_user_id)
VALUES
('Science', 'Lusaka Secondary School', 2);

-- Insert sample admin/headteacher profile linked to user id 3
INSERT INTO admins (school_id, school_name, linked_user_id)
VALUES
('SCH-001', 'Lusaka Secondary School', 3);

-- Insert sample progress (linked to student user id 1)
=======
INSERT INTO users (name, email, password, role) VALUES
('Natasha Kalusa', 'NatashaK@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Mary Phiri', 'mary@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
('Mpundu Maloba', 'MpunduM@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample progress
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
INSERT INTO progress (user_id, experiment_id, completed_steps, total_steps, score) VALUES
(1, 1, 5, 5, 85.50),
(1, 2, 3, 5, 60.00),
(1, 4, 2, 3, 75.00);