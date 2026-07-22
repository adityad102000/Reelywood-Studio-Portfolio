import React, { useState } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Database, CheckCircle2, Copy, AlertCircle, ExternalLink, Code } from 'lucide-react';

interface SupabaseSettingsModalProps {
  onClose: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- Reelywood Supabase Schema
create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

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

alter table categories enable row level security;
alter table projects enable row level security;

create policy "Public view categories" on categories for select using (true);
create policy "Public view published" on projects for select using (published = true);
create policy "Auth manage categories" on categories for all using (auth.role() = 'authenticated');
create policy "Auth manage projects" on projects for all using (auth.role() = 'authenticated');
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
        <div className="p-3 rounded-2xl bg-[#D4FF00] text-black">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase text-white tracking-tight">
            SUPABASE BACKEND <span className="text-[#D4FF00]">GUIDE</span>
          </h3>
          <p className="text-xs text-neutral-400">
            Database setup & environment variable instructions.
          </p>
        </div>
      </div>

      {/* Connection Status Box */}
      <div className={`p-4 rounded-2xl border text-xs mb-6 ${
        isSupabaseConfigured()
          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
          : 'bg-amber-950/40 border-amber-800 text-amber-300'
      }`}>
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider mb-1">
          {isSupabaseConfigured() ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400" />
          )}
          <span>{isSupabaseConfigured() ? 'Connected to Supabase' : 'Running in Local Demo Mode'}</span>
        </div>
        <p className="text-neutral-300 font-light text-[11px] leading-relaxed">
          {isSupabaseConfigured()
            ? 'Your environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly set.'
            : 'To persist data in your own Supabase project, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables, then run the SQL script below in your Supabase SQL Editor.'}
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-4 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Setup Checklist:
        </h4>
        <ol className="space-y-2.5 text-xs text-neutral-300 font-light">
          <li className="flex items-start gap-2">
            <span className="font-mono text-[#D4FF00] font-bold">1.</span>
            <span>Create a project on <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#D4FF00] underline">Supabase.com</a>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-[#D4FF00] font-bold">2.</span>
            <span>Go to SQL Editor and run the schema script below (or use the included <code className="text-[#D4FF00]">schema.sql</code> file).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-[#D4FF00] font-bold">3.</span>
            <span>Create a public storage bucket named <code className="text-[#D4FF00]">project-media</code>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-[#D4FF00] font-bold">4.</span>
            <span>Add <code className="text-[#D4FF00]">VITE_SUPABASE_URL</code> and <code className="text-[#D4FF00]">VITE_SUPABASE_ANON_KEY</code> to your app's environment variables.</span>
          </li>
        </ol>
      </div>

      {/* SQL Snippet Preview with Copy Button */}
      <div className="relative bg-neutral-950 border border-neutral-800 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-neutral-400 uppercase">
            <Code className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span>schema.sql</span>
          </div>
          <button
            onClick={copySql}
            className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
          </button>
        </div>
        <pre className="text-[10px] font-mono text-neutral-400 overflow-x-auto max-h-40 leading-relaxed">
          {sqlCode}
        </pre>
      </div>

      <button
        onClick={onClose}
        className="btn-shimmer w-full py-3.5 rounded-full bg-[#D4FF00] text-black font-black text-xs uppercase tracking-widest"
      >
        Close Guide
      </button>
    </div>
  );
};
