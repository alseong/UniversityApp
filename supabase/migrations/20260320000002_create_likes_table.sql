create table public.likes (
  user_id uuid references auth.users(id) on delete cascade not null,
  submission_id uuid references public.admissions_data(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (user_id, submission_id)
);

alter table public.likes enable row level security;

create policy "Anyone can read likes"
  on public.likes for select using (true);

create policy "Users can insert their own likes"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on public.likes for delete using (auth.uid() = user_id);
