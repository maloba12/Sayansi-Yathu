-- Phase 2 Simulation Types Update
-- This migration wires the Phase 2 physics simulations correctly to the frontend.

UPDATE experiments 
SET simulation_type = 'linear_motion' 
WHERE title = 'Linear Motion Simulation';

UPDATE experiments 
SET simulation_type = 'free_fall' 
WHERE title = 'Free Fall and Gravitational Acceleration';

UPDATE experiments 
SET simulation_type = 'hookes_law' 
WHERE title = 'Hookes Law Simulation';

UPDATE experiments 
SET simulation_type = 'circuit' 
WHERE title = 'Ohm''s Law Circuit';
