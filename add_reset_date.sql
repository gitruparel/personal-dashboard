-- Add last_reset_date to profiles to handle daily task resets
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_reset_date DATE;
