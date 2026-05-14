-- Create Enum for Goal Timeframes
DO $$ BEGIN
    CREATE TYPE goal_timeframe_enum AS ENUM ('5_year', '1_year', 'quarterly', 'monthly', 'weekly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Enum for Goal Status
DO $$ BEGIN
    CREATE TYPE goal_status_enum AS ENUM ('not_started', 'in_progress', 'completed', 'dropped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    title text NOT NULL,
    description text,
    timeframe goal_timeframe_enum NOT NULL,
    status goal_status_enum DEFAULT 'not_started' NOT NULL,
    parent_goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at timestamp with time zone
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    name text NOT NULL,
    description text,
    status text DEFAULT 'active' NOT NULL,
    repository_url text,
    launch_date date,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Create Learning Topics Table
DO $$ BEGIN
    CREATE TYPE learning_type_enum AS ENUM ('book', 'course', 'dsa', 'concept');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.learning_topics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    title text NOT NULL,
    type learning_type_enum NOT NULL,
    status text DEFAULT 'queued' NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    target integer DEFAULT 100 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.learning_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own learning topics" ON public.learning_topics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learning topics" ON public.learning_topics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own learning topics" ON public.learning_topics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own learning topics" ON public.learning_topics FOR DELETE USING (auth.uid() = user_id);
