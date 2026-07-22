import React from 'react';
import { motion } from 'motion/react';
import { Film, Sparkles } from 'lucide-react';

interface GlobalLoaderProps {
  isLoading: boolean;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0A] text-white select-none"
    >
      {/* Background ambient neon radial glow */}
      <div className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[#D4FF00]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated Cinema Icon */}
        <div className="relative mb-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-[#D4FF00] shadow-[0_0_30px_rgba(212,255,0,0.2)]">
            <Film className="w-8 h-8 sm:w-10 sm:h-10 animate-spin-slow" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 bg-[#D4FF00] text-black rounded-full">
            <Sparkles className="w-3 h-3 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white mb-2">
          REELYWOOD <span className="text-[#D4FF00]">STUDIOS</span>
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-8">
          INITIALIZING BENTO VAULT & MEDIA ASSETS...
        </p>

        {/* Progress Bar Container */}
        <div className="w-48 sm:w-64 h-1.5 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-[#D4FF00] rounded-full shadow-[0_0_10px_#D4FF00]"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
