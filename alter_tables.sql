alter table public.profiles 
  add column if not exists greeting_name text,
  add column if not exists tracker_name text default 'NeetCode 150',
  add column if not exists tracker_target integer default 150;

create policy "Users can delete their own activity" on daily_activity for delete using (auth.uid() = user_id);
