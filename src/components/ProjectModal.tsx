import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { X, Calendar, Building, Sparkles, ArrowLeft, Images } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onBookSimilar: (title: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onBookSimilar }) => {
  if (!project) return null;

  const galleryList = project.gallery_urls && project.gallery_urls.length > 0
    ? project.gallery_urls
    : [project.media_url];

  const [activeMediaUrl, setActiveMediaUrl] = useState<string>(project.media_url || galleryList[0]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-8"
        >
          {/* Header Return Navigation & Close Buttons */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-full bg-black/70 backdrop-blur-md border border-neutral-700/80 text-white font-bold text-xs uppercase tracking-wider hover:bg-black hover:text-[#D4FF00] flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4FF00]" />
              <span className="hidden sm:inline">Back to Portfolio</span>
              <span className="sm:hidden">Back</span>
            </button>
            <button
              onClick={onClose}
              title="Close View"
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black hover:text-[#D4FF00] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Media Header Area */}
          <div className="relative w-full h-[280px] sm:h-[400px] bg-neutral-950 overflow-hidden">
            {project.media_type === 'video' && activeMediaUrl === project.media_url ? (
              <video
                src={activeMediaUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={activeMediaUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent pointer-events-none" />

            {/* Category Tag Overlay */}
            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
              <span className="px-3.5 py-1.5 rounded-full bg-[#D4FF00] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg">
                {project.category?.name || 'Showcase'}
              </span>
              {project.stats_highlight && (
                <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-neutral-700 text-[#D4FF00] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {project.stats_highlight}
                </span>
              )}
            </div>
          </div>

          {/* Gallery Thumbnails Carousel (If > 1 image stored) */}
          {galleryList.length > 1 && (
            <div className="px-6 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center gap-3 overflow-x-auto">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-neutral-400 shrink-0 pr-2 border-r border-neutral-800">
                <Images className="w-4 h-4 text-[#D4FF00]" />
                <span>Gallery ({galleryList.length}):</span>
              </div>
              <div className="flex items-center gap-2">
                {galleryList.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMediaUrl(url)}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeMediaUrl === url
                        ? 'border-[#D4FF00] scale-105 shadow-[0_0_10px_rgba(212,255,0,0.5)]'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Body Content Area */}
          <div className="p-6 sm:p-10">
            {/* Title & Meta Bar */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 pb-6 border-b border-neutral-800">
              <div>
                <h3 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-none mb-3">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-neutral-300 font-light text-base leading-relaxed max-w-2xl">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Client & Year Badges */}
              <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                {project.client_name && (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-800/80 text-xs font-semibold text-neutral-300">
                    <Building className="w-3.5 h-3.5 text-[#D4FF00]" />
                    <span>{project.client_name}</span>
                  </div>
                )}
                {project.year && (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-800/80 text-xs font-semibold text-neutral-300">
                    <Calendar className="w-3.5 h-3.5 text-[#D4FF00]" />
                    <span>{project.year}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Project Deliverables Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-800">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                  CORE OBJECTIVE
                </span>
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  VIRAL ATTENTION & REVENUE EXPANSION
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-800">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                  AGENCY ROLE
                </span>
                <p className="text-xs font-bold text-[#D4FF00] uppercase tracking-wider">
                  STRATEGY + AI PRODUCTION
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-800">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                  IMPACT METRIC
                </span>
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  {project.stats_highlight || 'EXPLOSIVE POPULARITY'}
                </p>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-800">
              <div className="text-xs text-neutral-400">
                Want a campaign built with this caliber of creative depth?
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-full bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-wider hover:text-white hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#D4FF00]" />
                  <span>Return to Vault</span>
                </button>
                <button
                  onClick={() => {
                    const title = project.title;
                    onClose();
                    onBookSimilar(title);
                  }}
                  className="btn-shimmer flex-1 sm:flex-none px-6 py-3 rounded-full bg-[#D4FF00] text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Commission Similar Work
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
