-- ============================
-- Reelywood Portfolio Schema
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
  media_type text not null check (media_type in ('image', 'video')),
  tile_size text not null default 'small' check (tile_size in ('small', 'medium', 'large')),
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_projects_category on projects(category_id);
create index if not exists idx_projects_published on projects(published);
create index if not exists idx_projects_display_order on projects(display_order);

-- ============================
-- Row Level Security
-- ============================

alter table categories enable row level security;
alter table projects enable row level security;

-- Public (anon) can read categories
create policy "Public can view categories"
  on categories for select
  using (true);

-- Public (anon) can read only published projects
create policy "Public can view published projects"
  on projects for select
  using (published = true);

-- Authenticated admin can do everything on categories
create policy "Authenticated can manage categories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Authenticated admin can do everything on projects
create policy "Authenticated can manage projects"
  on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================
-- Storage bucket for project media
-- ============================
insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

-- Public can read media
create policy "Public can view project media"
  on storage.objects for select
  using (bucket_id = 'project-media');

-- Authenticated can upload/manage media
create policy "Authenticated can upload project media"
  on storage.objects for insert
  with check (bucket_id = 'project-media' and auth.role() = 'authenticated');

create policy "Authenticated can update project media"
  on storage.objects for update
  using (bucket_id = 'project-media' and auth.role() = 'authenticated');

create policy "Authenticated can delete project media"
  on storage.objects for delete
  using (bucket_id = 'project-media' and auth.role() = 'authenticated');
