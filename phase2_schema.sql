-- Create Enum for Activity Types
DO $$ BEGIN
    CREATE TYPE activity_type_enum AS ENUM ('workout', 'learning', 'build', 'discipline', 'journal');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Activity Logs Table for granular event tracking
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type activity_type_enum NOT NULL,
    value integer DEFAULT 1,
    metadata jsonb
);

-- Set up RLS for activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activity logs" ON public.activity_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own activity logs" ON public.activity_logs FOR DELETE USING (auth.uid() = user_id);

-- Create Journal Entries Table
DO $$ BEGIN
    CREATE TYPE journal_type_enum AS ENUM ('daily', 'weekly_review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.journal_entries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type journal_type_enum NOT NULL,
    content jsonb NOT NULL
);

-- Set up RLS for journal_entries
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own journal entries" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal entries" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal entries" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal entries" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Update profiles table to include trajectory
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS trajectory text DEFAULT 'Plateauing';
