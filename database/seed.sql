-- Insert sample experiments
INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type) VALUES
('Simple Pendulum', 'physics', 'Study the motion of a simple pendulum', 'beginner', 'threejs'),
('Ohm\'s Law Circuit', 'physics', 'Verify Ohm\'s law using virtual circuits', 'intermediate', 'threejs'),
('Acid-Base Titration', 'chemistry', 'Perform acid-base titration experiment', 'intermediate', 'p5js'),
('Chemical Reactions', 'chemistry', 'Observe different types of chemical reactions', 'beginner', 'p5js'),
('Cell Structure', 'biology', 'Explore animal and plant cell structures', 'beginner', 'threejs'),
('DNA Replication', 'biology', 'Visualize DNA replication process', 'advanced', 'threejs');

-- Insert sample users
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Natasha Kalusa', 'NatashaK@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
(2, 'Mary Phiri', 'mary@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
(3, 'Mpundu Maloba', 'MpunduM@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
(4, 'Chanda Bwalya', 'chanda@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
(5, 'Lubasi Musonda', 'lubasi@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
(6, 'Mutinta Moomba', 'mutinta@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');

-- Insert sample students (linking to users)
INSERT INTO students (student_id, grade_or_form, class, stream, enrolled_year, linked_user_id) VALUES
('S2024001', 'Form 1', 'A', 'Science', 2024, 1),
('S2024002', 'Form 1', 'A', 'Science', 2024, 4),
('S2024003', 'Form 1', 'B', 'Arts', 2024, 5),
('S2024004', 'Form 2', 'A', 'Science', 2024, 6);

-- Insert sample progress
INSERT INTO progress (user_id, experiment_id, completed_steps, total_steps, score) VALUES
(1, 1, 5, 5, 85.50),
(1, 2, 3, 5, 60.00),
(1, 4, 2, 3, 75.00),
(4, 1, 5, 5, 92.00),
(5, 1, 2, 5, 32.00),
(6, 1, 5, 5, 78.00);

-- Insert sample assignments
INSERT INTO assignments (teacher_id, experiment_id, title, description, grade_or_form, class, due_date) VALUES
(2, 1, 'Pendulum Basics', 'Complete the simple pendulum experiment and record results.', 'Form 1', 'A', '2024-05-15 23:59:59'),
(2, 2, 'Circuit Verification', 'Verify Ohm\'s Law for three different resistances.', 'Form 1', 'A', '2024-05-20 23:59:59'),
(2, 3, 'Titration Lab', 'Perform the titration experiment and submit the final concentration.', 'Form 1', 'B', '2024-05-22 23:59:59');-- Insert Form 1 Biology Experiments
INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type, curriculum, grade_or_form) VALUES
('Scientific Inquiry Method', 'biology', 'To apply the scientific inquiry method in carrying out scientific investigations.', 'beginner', 'threejs', 'new', 'Form 1'),
('Characteristics of Living Things', 'biology', 'To investigate the characteristics of living things.', 'beginner', 'threejs', 'new', 'Form 1'),
('Use of Microscopes', 'biology', 'To use different types of microscopes to examine specimens.', 'beginner', 'threejs', 'new', 'Form 1'),
('Basic Cell Structure', 'biology', 'To explore the basic cell structure.', 'beginner', 'threejs', 'new', 'Form 1'),
('Types of Cells (Eukaryotic vs Prokaryotic)', 'biology', 'To distinguish between eukaryotic and prokaryotic cells.', 'intermediate', 'threejs', 'new', 'Form 1'),
('Specialised Cells', 'biology', 'To relate adaptive features of specialised cells to their functions.', 'intermediate', 'threejs', 'new', 'Form 1'),
('Nutritional Deficiency Diseases and Disorders', 'biology', 'To investigate nutritional deficiency diseases and disorders in plants and human beings.', 'intermediate', 'threejs', 'new', 'Form 1'),
('Reproduction in Living Organisms', 'biology', 'To demonstrate understanding of how living organisms reproduce.', 'intermediate', 'threejs', 'new', 'Form 1'),
('Tropisms in Plants', 'biology', 'To explore tropisms in plants and their relevance.', 'advanced', 'threejs', 'new', 'Form 1'),
('Taxic Responses in Invertebrates', 'biology', 'To explore taxic responses in invertebrates and their relevance.', 'advanced', 'threejs', 'new', 'Form 1'),
('Features of Ecosystems', 'biology', 'To explore features of ecosystems in the local environment.', 'advanced', 'threejs', 'new', 'Form 1'),
('Soil Composition and Fertility', 'biology', 'To analyse soil composition and fertility.', 'advanced', 'threejs', 'new', 'Form 1');
