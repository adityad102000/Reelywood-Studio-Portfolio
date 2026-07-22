import React from 'react';
import { motion } from 'motion/react';
import { TextRotate } from './TextRotate';
import { ArrowUpRight, Play, Sparkles, Award, TrendingUp, Eye } from 'lucide-react';

interface HeroProps {
  onOpenContact: () => void;
  onExploreProjects: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact, onExploreProjects }) => {
  const rotatingWords = ['BOLD', 'LOUD', 'UNFORGETTABLE', 'ALIVE', 'VISIONARY'];

  const stats = [
    { value: '500M+', label: 'Organic Views', icon: Eye },
    { value: '120+', label: 'Viral Campaigns', icon: Sparkles },
    { value: '14', label: 'Industry Awards', icon: Award },
    { value: '4.2x', label: 'Average ROAS', icon: TrendingUp },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] overflow-hidden bg-noise"
    >
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4FF00]/10 rounded-full blur-[140px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative max-w-6xl mx-auto my-auto text-center flex flex-col items-center justify-center z-10 py-12">
        {/* Top Eyebrow Chip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-[#D4FF00] text-xs font-bold tracking-widest uppercase mb-8 shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-ping" />
          <span>REELYWOOD CREATIVE STUDIO</span>
        </motion.div>

        {/* Main Display Headline with TextRotate */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-white uppercase max-w-5xl mb-8"
        >
          We build brands <br className="hidden sm:inline" />
          that feel{' '}
          <TextRotate words={rotatingWords} className="min-w-[280px] sm:min-w-[420px] text-left" />
        </motion.h1>

        {/* One-Line Agency Positioning Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-2xl text-neutral-400 font-light max-w-3xl leading-relaxed mb-10"
        >
          A high-velocity creative agency synthesizing culture-shifting brand identity, AI video production, and viral influencer campaigns.
        </motion.p>

        {/* CTA Button Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          {/* Shimmer CTA Button */}
          <button
            onClick={onOpenContact}
            className="btn-shimmer group relative px-8 py-4 rounded-full bg-[#D4FF00] text-black font-black text-sm tracking-widest uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(212,255,0,0.4)] flex items-center gap-3"
          >
            <span>Get a Call</span>
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>

          {/* Secondary Explore Work Button */}
          <button
            onClick={onExploreProjects}
            className="group px-8 py-4 rounded-full bg-neutral-900 border border-neutral-800 text-white font-bold text-sm tracking-widest uppercase hover:border-neutral-600 hover:bg-neutral-800/80 transition-all flex items-center gap-3"
          >
            <Play className="w-4 h-4 text-[#D4FF00] fill-[#D4FF00]" />
            <span>Explore Projects</span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Ticker Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative max-w-6xl mx-auto w-full pt-8 border-t border-neutral-800/60 z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-[#D4FF00]" />
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {stat.value}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
