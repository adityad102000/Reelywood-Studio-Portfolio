import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Project } from '../../types';
import { AdminLogin } from './AdminLogin';
import { ProjectList } from './ProjectList';
import { ProjectForm } from './ProjectForm';
import { CategoryManager } from './CategoryManager';
import { SupabaseSettingsModal } from './SupabaseSettingsModal';
import { X, Shield, LayoutGrid, FolderPlus, Database, LogOut, ArrowLeft } from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectsChanged: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  onProjectsChanged,
}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'categories' | 'settings'>('projects');
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Check existing session
  useEffect(() => {
    const checkSession = async () => {
      // Check Supabase Auth
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setAuthenticated(true);
          return;
        }
      }
      // Check Demo Bypass Session
      if (sessionStorage.getItem('reelywood_admin_demo') === 'true') {
        setAuthenticated(true);
      }
    };

    if (isOpen) {
      checkSession();
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('reelywood_admin_demo');
    setAuthenticated(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[#0A0A0A] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-6 flex flex-col min-h-[600px]"
        >
          {/* Header Action Buttons (Return to Site & Close) */}
          <div className="absolute top-5 right-5 z-30 flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-bold uppercase tracking-wider text-[#D4FF00] hover:bg-[#D4FF00] hover:text-black flex items-center gap-2 transition-all shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Site</span>
            </button>
            <button
              onClick={onClose}
              title="Close Admin Portal"
              className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!authenticated ? (
            <div className="p-6 sm:p-12 my-auto">
              <div className="mb-6">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#D4FF00] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Portfolio</span>
                </button>
              </div>
              <AdminLogin
                onSuccess={() => {
                  setAuthenticated(true);
                  onProjectsChanged();
                }}
                onOpenSettings={() => setActiveTab('settings')}
              />
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Admin Top Navigation Header */}
              <div className="p-6 border-b border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-16 sm:pr-48">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#D4FF00] text-black">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <span>ADMIN PORTAL</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-[#D4FF00]">
                        v2.4
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-light">
                      Manage bento grid tiles, category taxonomy, and media assets.
                    </p>
                  </div>
                </div>

                {/* Navigation Tabs & Logout */}
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-bold uppercase tracking-wider text-[#D4FF00] hover:bg-[#D4FF00] hover:text-black flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Site</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      setFormMode('list');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      activeTab === 'projects'
                        ? 'bg-[#D4FF00] text-black'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Projects
                  </button>

                  <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      activeTab === 'categories'
                        ? 'bg-[#D4FF00] text-black'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    Categories
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      activeTab === 'settings'
                        ? 'bg-[#D4FF00] text-black'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    Setup Guide
                  </button>

                  <button
                    onClick={handleSignOut}
                    title="Sign Out"
                    className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Admin Main Body View */}
              <div className="p-6 sm:p-8 flex-1 bg-[#0A0A0A] overflow-y-auto">
                {activeTab === 'projects' && (
                  <>
                    {formMode === 'list' && (
                      <ProjectList
                        onAddNew={() => {
                          setSelectedProject(null);
                          setFormMode('add');
                        }}
                        onEdit={(project) => {
                          setSelectedProject(project);
                          setFormMode('edit');
                        }}
                      />
                    )}

                    {(formMode === 'add' || formMode === 'edit') && (
                      <ProjectForm
                        initialProject={selectedProject}
                        onSuccess={() => {
                          setFormMode('list');
                          setSelectedProject(null);
                          onProjectsChanged();
                        }}
                        onCancel={() => {
                          setFormMode('list');
                          setSelectedProject(null);
                        }}
                      />
                    )}
                  </>
                )}

                {activeTab === 'categories' && <CategoryManager />}

                {activeTab === 'settings' && (
                  <SupabaseSettingsModal onClose={() => setActiveTab('projects')} />
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
