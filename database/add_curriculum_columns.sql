-- Migration: Add curriculum and grade_or_form columns to experiments table
-- Ticket: T3 — Curriculum Structure: New (Form 1) vs Old (Grades 10–12)

ALTER TABLE experiments 
  ADD COLUMN curriculum ENUM('new', 'old') NOT NULL DEFAULT 'new',
  ADD COLUMN grade_or_form VARCHAR(20) NOT NULL DEFAULT 'Form 1';

-- Tag all existing 36 experiments as New Curriculum / Form 1
UPDATE experiments SET curriculum = 'new', grade_or_form = 'Form 1';
