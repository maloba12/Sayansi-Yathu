-- Insert sample experiments
INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type) VALUES
('Simple Pendulum', 'physics', 'Study the motion of a simple pendulum', 'beginner', 'threejs'),
('Ohm\'s Law Circuit', 'physics', 'Verify Ohm\'s law using virtual circuits', 'intermediate', 'threejs'),
('Acid-Base Titration', 'chemistry', 'Perform acid-base titration experiment', 'intermediate', 'p5js'),
('Chemical Reactions', 'chemistry', 'Observe different types of chemical reactions', 'beginner', 'p5js'),
('Cell Structure', 'biology', 'Explore animal and plant cell structures', 'beginner', 'threejs'),
('DNA Replication', 'biology', 'Visualize DNA replication process', 'advanced', 'threejs');

-- Insert sample users
INSERT INTO users (name, email, password, role) VALUES
('Natasha Kalusa', 'NatashaK@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Mary Phiri', 'mary@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
('Mpundu Maloba', 'MpunduM@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample progress
INSERT INTO progress (user_id, experiment_id, completed_steps, total_steps, score) VALUES
(1, 1, 5, 5, 85.50),
(1, 2, 3, 5, 60.00),
(1, 4, 2, 3, 75.00);