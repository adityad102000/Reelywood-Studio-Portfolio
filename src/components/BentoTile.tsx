import React, { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Project } from '../types';
import { Maximize2, Eye } from 'lucide-react';

interface BentoTileProps {
  project: Project;
  spanClass: string;
  index: number;
  onSelectProject: (project: Project) => void;
}

export const BentoTile: React.FC<BentoTileProps> = ({
  project,
  spanClass,
  index,
  onSelectProject,
}) => {
  // Motion values for magnetic displacement
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth springs for fluid magnetic return
  const springConfig = { stiffness: 250, damping: 20 };
  const magneticX = useSpring(rawX, springConfig);
  const magneticY = useSpring(rawY, springConfig);

  // Local state for cursor-following radial spotlight glow
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate slight pull toward mouse position (magnetic pull up to 12px)
    const pullX = (e.clientX - centerX) * 0.08;
    const pullY = (e.clientY - centerY) * 0.08;

    rawX.set(pullX);
    rawY.set(pullY);

    // Calculate cursor relative position for inner spotlight
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{
        scale: 1.025,
        y: -4,
      }}
      style={{
        x: magneticX,
        y: magneticY,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelectProject(project)}
      className={`group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800/80 hover:border-[#D4FF00] hover:shadow-[0_0_35px_rgba(212,255,0,0.3)] transition-all duration-300 cursor-pointer shadow-xl ${spanClass}`}
    >
      {/* Interactive Cursor Spotlight Radial Glow Overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(212, 255, 0, 0.18), transparent 80%)`,
          }}
        />
      )}

      {/* Tactile Glowing Border Outline Highlight */}
      <div className="absolute inset-0 z-20 rounded-3xl border border-[#D4FF00]/0 group-hover:border-[#D4FF00] transition-colors duration-300 pointer-events-none" />

      {/* Media Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {project.media_type === 'video' ? (
          <video
            src={project.media_url}
            muted
            loop
            playsInline
            autoPlay
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-75 group-hover:opacity-90"
          />
        ) : (
          <img
            src={project.media_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-75 group-hover:opacity-90"
          />
        )}
        {/* Gradient Mask for Visual Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 group-hover:via-black/20 transition-all duration-500" />
      </div>

      {/* Top Right Floating Category Pill & Zoom Icon */}
      <div className="absolute top-5 right-5 z-30 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-neutral-700/60 text-[#D4FF00] font-bold text-[10px] uppercase tracking-wider shadow-md">
          {project.category?.name || 'Campaign'}
        </span>
        <div className="p-2 rounded-full bg-[#D4FF00] text-black opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Maximalist Typography Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-30 flex flex-col justify-end">
        {project.stats_highlight && (
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#D4FF00] tracking-widest mb-2">
            <Eye className="w-3.5 h-3.5" />
            <span>{project.stats_highlight}</span>
          </div>
        )}

        {/* Giant Bold Project Title */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none group-hover:text-[#D4FF00] transition-colors duration-300 drop-shadow-md">
          {project.title}
        </h3>

        {/* Meta info row */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10 text-[11px] font-mono uppercase tracking-widest text-neutral-300">
          <span>{project.client_name || 'REELYWOOD STUDIOS'}</span>
          <span>•</span>
          <span>{project.year || '2025'}</span>
        </div>
      </div>
    </motion.div>
  );
};
