-- ============================
-- Reelywood Portfolio Complete Supabase Schema
-- ============================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Categories table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category_id uuid not null references categories(id) on delete cascade,
  media_url text not null,
  gallery_urls text[] default '{}',
  media_type text not null check (media_type in ('image', 'video')),
  tile_size text not null default 'small' check (tile_size in ('small', 'medium', 'large')),
  display_order integer not null default 0,
  published boolean not null default true,
  client_name text,
  year text,
  stats_highlight text,
  created_at timestamptz not null default now()
);

-- Add columns if table was created previously without them
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='projects' and column_name='gallery_urls') then
    alter table projects add column gallery_urls text[] default '{}';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='projects' and column_name='client_name') then
    alter table projects add column client_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='projects' and column_name='year') then
    alter table projects add column year text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='projects' and column_name='stats_highlight') then
    alter table projects add column stats_highlight text;
  end if;
end $$;

-- Indexes for common queries
create index if not exists idx_projects_category on projects(category_id);
create index if not exists idx_projects_published on projects(published);
create index if not exists idx_projects_display_order on projects(display_order);

-- ============================
-- Row Level Security (RLS) & Policies
-- ============================

alter table categories enable row level security;
alter table projects enable row level security;

-- Drop existing policies if present to prevent ERROR 42710 (policy already exists)
drop policy if exists "Public can view categories" on categories;
drop policy if exists "Public view categories" on categories;
drop policy if exists "Public select categories" on categories;
drop policy if exists "Public insert categories" on categories;
drop policy if exists "Public update categories" on categories;
drop policy if exists "Public delete categories" on categories;
drop policy if exists "Authenticated can manage categories" on categories;
drop policy if exists "Auth manage categories" on categories;

drop policy if exists "Public can view published projects" on projects;
drop policy if exists "Public view published" on projects;
drop policy if exists "Public select projects" on projects;
drop policy if exists "Public insert projects" on projects;
drop policy if exists "Public update projects" on projects;
drop policy if exists "Public delete projects" on projects;
drop policy if exists "Authenticated can manage projects" on projects;
drop policy if exists "Auth manage projects" on projects;

-- Create policies allowing full access for app functionality
create policy "Public select categories" on categories for select using (true);
create policy "Public insert categories" on categories for insert with check (true);
create policy "Public update categories" on categories for update using (true);
create policy "Public delete categories" on categories for delete using (true);

create policy "Public select projects" on projects for select using (true);
create policy "Public insert projects" on projects for insert with check (true);
create policy "Public update projects" on projects for update using (true);
create policy "Public delete projects" on projects for delete using (true);

-- ============================
-- Storage bucket for project media
-- ============================
insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view project media" on storage.objects;
drop policy if exists "Authenticated can upload project media" on storage.objects;
drop policy if exists "Authenticated can update project media" on storage.objects;
drop policy if exists "Authenticated can delete project media" on storage.objects;
drop policy if exists "Public media select" on storage.objects;
drop policy if exists "Public media insert" on storage.objects;
drop policy if exists "Public media update" on storage.objects;
drop policy if exists "Public media delete" on storage.objects;

create policy "Public media select" on storage.objects for select using (bucket_id = 'project-media');
create policy "Public media insert" on storage.objects for insert with check (bucket_id = 'project-media');
create policy "Public media update" on storage.objects for update using (bucket_id = 'project-media');
create policy "Public media delete" on storage.objects for delete using (bucket_id = 'project-media');

