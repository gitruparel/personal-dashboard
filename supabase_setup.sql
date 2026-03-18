-- Create a table for user profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  streak integer default 0,
  neetcode_progress integer default 0,
  last_completed_date text,
  lectures_watched integer default 0
);
-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
create policy "Profiles are viewable by user." on profiles
  for select using (auth.uid() = id);
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create tasks table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  text text not null,
  completed boolean default false,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.tasks enable row level security;
create policy "Users can view their own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can insert their own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update their own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete their own tasks" on tasks for delete using (auth.uid() = user_id);

-- Create daily_activity table
create table public.daily_activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date text not null,
  activity_level integer default 1,
  unique(user_id, date)
);
alter table public.daily_activity enable row level security;
create policy "Users can view their own activity" on daily_activity for select using (auth.uid() = user_id);
create policy "Users can insert their own activity" on daily_activity for insert with check (auth.uid() = user_id);
create policy "Users can update their own activity" on daily_activity for update using (auth.uid() = user_id);
create policy "Users can delete their own activity" on daily_activity for delete using (auth.uid() = user_id);
