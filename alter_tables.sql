-- Update the profiles table to include the new Personal Operating System fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS momentum_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_season text,
ADD COLUMN IF NOT EXISTS timezone text;

-- (The other tables for goals, projects, workouts, etc. will be added in later phases)
