-- Create Exercises Library Table
CREATE TABLE IF NOT EXISTS public.exercises (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    muscle_group text NOT NULL,
    equipment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed some basic exercises (optional, but good for starting)
INSERT INTO public.exercises (name, muscle_group, equipment) VALUES
('Bench Press (Barbell)', 'Chest', 'Barbell'),
('Squat (Barbell)', 'Legs', 'Barbell'),
('Deadlift (Barbell)', 'Back', 'Barbell'),
('Overhead Press (Dumbbell)', 'Shoulders', 'Dumbbell'),
('Pull Up', 'Back', 'Bodyweight'),
('Push Up', 'Chest', 'Bodyweight')
ON CONFLICT DO NOTHING;

-- Create Routines Table
CREATE TABLE IF NOT EXISTS public.routines (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    name text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own routines" ON public.routines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own routines" ON public.routines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own routines" ON public.routines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own routines" ON public.routines FOR DELETE USING (auth.uid() = user_id);

-- Create Workout Sessions Table
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    routine_id uuid REFERENCES public.routines(id) ON DELETE SET NULL,
    name text NOT NULL,
    start_time timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    end_time timestamp with time zone,
    volume integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON public.workout_sessions FOR DELETE USING (auth.uid() = user_id);

-- Create Workout Sets Table
CREATE TABLE IF NOT EXISTS public.workout_sets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id uuid REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
    exercise_id uuid REFERENCES public.exercises(id) NOT NULL,
    set_number integer NOT NULL,
    reps integer,
    weight numeric,
    rpe numeric,
    is_warmup boolean DEFAULT false,
    completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
-- For sets, we link permissions through the session_id to user_id, but for simplicity we can allow auth.uid() to perform operations if they own the session.
-- A simpler approach for MVP is allowing authenticated users to manage sets and validating session ownership in the application layer or using a join in the policy.
CREATE POLICY "Users can view own sets" ON public.workout_sets FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workout_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own sets" ON public.workout_sets FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workout_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update own sets" ON public.workout_sets FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workout_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own sets" ON public.workout_sets FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workout_sessions WHERE id = session_id AND user_id = auth.uid())
);
