import React, { useState } from 'react';
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  seedSupabaseFromMockData,
  fetchCategories,
  fetchProjects,
} from '../../lib/supabase';
import {
  Database,
  CheckCircle2,
  Copy,
  AlertCircle,
  Code,
  Key,
  Globe,
  Sparkles,
  RefreshCw,
  Trash2,
} from 'lucide-react';

interface SupabaseSettingsModalProps {
  onClose: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const currentCreds = getSupabaseCredentials();

  const [urlInput, setUrlInput] = useState(currentCreds.url);
  const [keyInput, setKeyInput] = useState(currentCreds.anonKey);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const sqlCode = `-- Reelywood Supabase Complete Schema
create extension if not exists "pgcrypto";

-- 1. Categories Table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- 2. Projects Table
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

-- 3. Row Level Security Policies
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

-- Create policies allowing full CRUD for app functionality
create policy "Public select categories" on categories for select using (true);
create policy "Public insert categories" on categories for insert with check (true);
create policy "Public update categories" on categories for update using (true);
create policy "Public delete categories" on categories for delete using (true);

create policy "Public select projects" on projects for select using (true);
create policy "Public insert projects" on projects for insert with check (true);
create policy "Public update projects" on projects for update using (true);
create policy "Public delete projects" on projects for delete using (true);

-- 4. Storage Bucket Setup for 'project-media'
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
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) {
      setSaveMsg('Please enter both Supabase URL and Anon Key.');
      return;
    }
    saveSupabaseCredentials(urlInput.trim(), keyInput.trim());
    setSaveMsg('Credentials saved successfully! Re-initializing connection...');
    setTestResult(null);
    setSeedResult(null);
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleClearCredentials = () => {
    clearSupabaseCredentials();
    setUrlInput('');
    setKeyInput('');
    setSaveMsg('Credentials cleared. Reverted to Local Demo Mode.');
    setTestResult(null);
    setSeedResult(null);
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const cats = await fetchCategories();
      const projs = await fetchProjects(true);
      setTestResult({
        success: true,
        msg: `Connection successful! Found ${cats.length} categories and ${projs.length} projects in Supabase database.`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        msg: `Connection error: ${err.message || 'Failed to query Supabase tables. Ensure SQL schema is executed.'}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const result = await seedSupabaseFromMockData();
      setSeedResult(`Success! Seeded ${result.categoriesCount} categories and ${result.projectsCount} projects into your Supabase database!`);
      // Refresh connection check
      handleTestConnection();
    } catch (err: any) {
      setSeedResult(`Seeding failed: ${err.message || 'Make sure your Supabase tables match the SQL schema above.'}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl space-y-6">
      {/* Modal Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
        <div className="p-3 rounded-2xl bg-[#D4FF00] text-black">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase text-white tracking-tight">
            SUPABASE BACKEND <span className="text-[#D4FF00]">SETTINGS</span>
          </h3>
          <p className="text-xs text-neutral-400">
            Configure live Supabase database connection & seed vault data.
          </p>
        </div>
      </div>

      {/* Connection Status Indicator */}
      <div
        className={`p-4 rounded-2xl border text-xs ${
          isSupabaseConfigured()
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            : 'bg-amber-950/40 border-amber-800 text-amber-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
            {isSupabaseConfigured() ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
            <span>
              {isSupabaseConfigured()
                ? 'Connected to Live Supabase Backend'
                : 'Running in Local Demo Mode'}
            </span>
          </div>

          {isSupabaseConfigured() && (
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 font-mono text-[10px] uppercase flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          )}
        </div>

        <p className="text-neutral-300 font-light text-[11px] leading-relaxed mt-1">
          {isSupabaseConfigured()
            ? 'Your application is connected to Supabase. Data will read and write directly to your cloud PostgreSQL database.'
            : 'Enter your Supabase URL and Anon Key below to persist all projects and categories in your cloud database.'}
        </p>

        {testResult && (
          <div
            className={`mt-2 p-2.5 rounded-xl border text-[11px] font-mono ${
              testResult.success
                ? 'bg-emerald-900/50 border-emerald-700 text-emerald-200'
                : 'bg-red-950/60 border-red-800 text-red-200'
            }`}
          >
            {testResult.msg}
          </div>
        )}
      </div>

      {/* Form: Live Credentials Input */}
      <form onSubmit={handleSaveCredentials} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#D4FF00]" />
          <span>Supabase Credentials</span>
        </h4>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
              Project URL (VITE_SUPABASE_URL)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:border-[#D4FF00] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
              Anon API Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:border-[#D4FF00] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {saveMsg && (
          <p className="text-xs text-[#D4FF00] font-mono">{saveMsg}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="btn-shimmer px-6 py-2.5 rounded-xl bg-[#D4FF00] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save & Connect
          </button>

          {isSupabaseConfigured() && (
            <button
              type="button"
              onClick={handleClearCredentials}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear / Disconnect
            </button>
          )}
        </div>
      </form>

      {/* 1-Click Seeder Action */}
      {isSupabaseConfigured() && (
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D4FF00]" />
                Seed Initial Data to Supabase
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Populate empty Supabase tables with initial portfolio projects & category taxonomy.
              </p>
            </div>

            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="px-5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-[#D4FF00] hover:text-[#D4FF00] text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Seeding Database...' : 'Seed Data Now'}
            </button>
          </div>

          {seedResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono ${
                seedResult.startsWith('Success')
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-red-950/60 border-red-800 text-red-300'
              }`}
            >
              {seedResult}
            </div>
          )}
        </div>
      )}

      {/* SQL Snippet Preview with Copy Button */}
      <div className="relative bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-neutral-400 uppercase">
            <Code className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span>SQL Editor Schema (Copy & Run in Supabase SQL Editor)</span>
          </div>
          <button
            onClick={copySql}
            className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? 'Copied!' : 'Copy SQL Script'}</span>
          </button>
        </div>
        <pre className="text-[10px] font-mono text-neutral-400 overflow-x-auto max-h-48 leading-relaxed">
          {sqlCode}
        </pre>
      </div>

      <button
        onClick={onClose}
        className="btn-shimmer w-full py-3.5 rounded-full bg-[#D4FF00] text-black font-black text-xs uppercase tracking-widest"
      >
        Close Settings
      </button>
    </div>
  );
};

