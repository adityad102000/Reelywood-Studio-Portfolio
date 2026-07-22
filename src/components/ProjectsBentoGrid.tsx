import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Category } from '../types';
import { fetchProjects, fetchCategories, subscribeProjects } from '../lib/supabase';
import { Sparkles, RefreshCw } from 'lucide-react';
import { BentoTile } from './BentoTile';

interface ProjectsBentoGridProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectsBentoGrid: React.FC<ProjectsBentoGridProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedProjects, fetchedCategories] = await Promise.all([
        fetchProjects(false), // Published only
        fetchCategories(),
      ]);
      setProjects(fetchedProjects);
      setCategories(fetchedCategories);
    } catch (e) {
      console.warn('Error loading portfolio data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to real-time changes if Supabase is connected
    const unsubscribe = subscribeProjects(() => {
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Filter projects by category
  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category_id === selectedCategory || p.category?.id === selectedCategory || p.category?.name === selectedCategory);

  // Helper function to resolve grid column/row spans based on tile_size
  const getBentoSpanClass = (size: string) => {
    switch (size) {
      case 'large':
        return 'col-span-1 md:col-span-2 row-span-2 min-h-[420px] md:min-h-[520px]';
      case 'medium':
        return 'col-span-1 md:col-span-2 row-span-1 min-h-[280px] md:min-h-[340px]';
      case 'small':
      default:
        return 'col-span-1 row-span-1 min-h-[280px] md:min-h-[340px]';
    }
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] relative border-t border-neutral-900 bg-noise">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#D4FF00] uppercase mb-3">
              <span className="w-1.5 h-1.5 bg-[#D4FF00] rounded-full" />
              02 // PORTFOLIO SHOWCASE
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
              THE <span className="text-[#D4FF00]">BENTO</span> VAULT
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={loadData}
              title="Refresh Portfolio"
              className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#D4FF00] hover:border-neutral-700 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4FF00]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#D4FF00] text-black shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            All Work ({projects.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#D4FF00] text-black shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Bento Grid Layout */}
        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px] md:auto-rows-[260px] animate-pulse">
            {/* Large Tile Skeleton */}
            <div className="col-span-1 md:col-span-2 row-span-2 min-h-[420px] md:min-h-[520px] bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="w-24 h-6 bg-neutral-800 rounded-full" />
                <div className="w-8 h-8 bg-neutral-800 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="w-20 h-4 bg-neutral-800 rounded" />
                <div className="w-3/4 h-8 bg-neutral-800 rounded" />
                <div className="w-1/2 h-4 bg-neutral-800 rounded" />
              </div>
            </div>

            {/* Medium Tile Skeleton */}
            <div className="col-span-1 row-span-1 min-h-[280px] md:min-h-[340px] bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="w-20 h-6 bg-neutral-800 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="w-2/3 h-6 bg-neutral-800 rounded" />
                <div className="w-1/3 h-4 bg-neutral-800 rounded" />
              </div>
            </div>

            {/* Small Tile Skeleton */}
            <div className="col-span-1 row-span-1 min-h-[280px] md:min-h-[340px] bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="w-20 h-6 bg-neutral-800 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="w-2/3 h-6 bg-neutral-800 rounded" />
                <div className="w-1/3 h-4 bg-neutral-800 rounded" />
              </div>
            </div>

            {/* Medium Tile Skeleton */}
            <div className="col-span-1 md:col-span-2 row-span-1 min-h-[280px] md:min-h-[340px] bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="w-28 h-6 bg-neutral-800 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="w-3/4 h-8 bg-neutral-800 rounded" />
                <div className="w-1/2 h-4 bg-neutral-800 rounded" />
              </div>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-dashed border-neutral-800">
            <Sparkles className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <p className="text-lg font-bold text-white uppercase tracking-wider mb-2">
              No Projects Found
            </p>
            <p className="text-sm text-neutral-400 font-light max-w-sm mx-auto">
              No published projects match this category filter. Try selecting another category or add new work via the Admin Portal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px] md:auto-rows-[260px]">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const spanClass = getBentoSpanClass(project.tile_size);
                return (
                  <BentoTile
                    key={project.id}
                    project={project}
                    spanClass={spanClass}
                    index={index}
                    onSelectProject={onSelectProject}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
