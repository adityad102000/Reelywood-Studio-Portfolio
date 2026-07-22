import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Shield, KeyRound, ArrowRight, CheckCircle2, AlertCircle, Database } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onOpenSettings: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onOpenSettings }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!isSupabaseConfigured() || !supabase) {
      setErrorMsg('Supabase environment variables are not configured. You can use Demo Mode below or set up your Supabase keys.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate with Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    // Store demo session in session storage
    sessionStorage.setItem('reelywood_admin_demo', 'true');
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#D4FF00] text-black flex items-center justify-center mx-auto mb-4 font-black shadow-[0_0_25px_rgba(212,255,0,0.3)]">
          <Shield className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-black uppercase text-white tracking-tight">
          REELYWOOD <span className="text-[#D4FF00]">ADMIN</span>
        </h3>
        <p className="text-xs text-neutral-400 font-light mt-1">
          Restricted access portal for managing portfolio projects & media.
        </p>
      </div>

      {/* Supabase Status Banner */}
      <div className={`p-3.5 rounded-2xl border text-xs mb-6 flex items-center justify-between ${
        isSupabaseConfigured()
          ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
          : 'bg-amber-950/40 border-amber-800/80 text-amber-300'
      }`}>
        <div className="flex items-center gap-2">
          {isSupabaseConfigured() ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>
            {isSupabaseConfigured()
              ? 'Supabase Backend Connected'
              : 'Supabase Credentials Not Set'}
          </span>
        </div>
        <button
          onClick={onOpenSettings}
          className="text-[10px] font-bold uppercase underline hover:text-white"
        >
          Setup Guide
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs mb-6 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSupabaseLogin} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Admin Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@reelywood.com"
            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#D4FF00] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#D4FF00] focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-shimmer w-full py-3.5 rounded-full bg-[#D4FF00] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-102 transition-transform shadow-[0_0_20px_rgba(212,255,0,0.25)]"
        >
          {loading ? (
            <span>Verifying Credentials...</span>
          ) : (
            <>
              <KeyRound className="w-4 h-4" />
              <span>Sign In with Supabase Auth</span>
            </>
          )}
        </button>
      </form>

      {/* Demo Mode / Interactive Testing Button */}
      <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
        <p className="text-[11px] text-neutral-400 mb-3">
          Testing in sandbox without Supabase credentials?
        </p>
        <button
          onClick={handleDemoBypass}
          className="w-full py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-[#D4FF00]" />
          <span>Enter Admin in Demo Mode</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      </div>
    </div>
  );
};
