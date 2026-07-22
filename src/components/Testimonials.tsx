import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_TESTIMONIALS } from '../data/mockData';
import { Testimonial } from '../types';
import { Quote, ChevronLeft, ChevronRight, Star, Verified } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current: Testimonial = INITIAL_TESTIMONIALS[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % INITIAL_TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + INITIAL_TESTIMONIALS.length) % INITIAL_TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] relative border-t border-neutral-900 overflow-hidden">
      {/* Background Accent Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#D4FF00]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#D4FF00] uppercase mb-3">
              <span className="w-1.5 h-1.5 bg-[#D4FF00] rounded-full" />
              03 // PROOFS & REPUTATION
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
              WHAT LEADERS <span className="text-[#D4FF00]">SAY</span>
            </h2>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-white hover:bg-[#D4FF00] hover:text-black hover:border-[#D4FF00] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-bold text-neutral-400 px-2">
              0{activeIndex + 1} / 0{INITIAL_TESTIMONIALS.length}
            </span>
            <button
              onClick={handleNext}
              className="p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-white hover:bg-[#D4FF00] hover:text-black hover:border-[#D4FF00] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Unique Testimonial Spotlight Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Interactive Spotlight Card (7 cols) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: -20, rotate: -1 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: 20, rotate: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden"
              >
                {/* Large Decorative Quote Watermark */}
                <Quote className="absolute top-6 right-6 w-32 h-32 text-neutral-800/40 pointer-events-none" />

                {/* Metric Badge */}
                {current.highlightMetric && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4FF00]/10 border border-[#D4FF00]/30 text-[#D4FF00] font-black text-xs uppercase tracking-widest mb-8">
                    <Verified className="w-4 h-4" />
                    <span>Verified Result: {current.highlightMetric}</span>
                  </div>
                )}

                {/* Quote Text */}
                <blockquote className="text-xl sm:text-3xl font-medium text-white leading-relaxed mb-10 tracking-tight">
                  "{current.quote}"
                </blockquote>

                {/* Author Info Row */}
                <div className="flex items-center gap-4 pt-6 border-t border-neutral-800/80">
                  <img
                    src={current.avatarUrl}
                    alt={current.author}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4FF00]"
                  />
                  <div>
                    <h4 className="text-lg font-black uppercase text-white tracking-tight">
                      {current.author}
                    </h4>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#D4FF00]">
                      {current.role} • {current.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Staggered Quick Select Navigator Cards (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {INITIAL_TESTIMONIALS.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                    isActive
                      ? 'bg-neutral-900 border-[#D4FF00] scale-102 shadow-[0_0_20px_rgba(212,255,0,0.15)]'
                      : 'bg-neutral-950/60 border-neutral-800/60 opacity-60 hover:opacity-100 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={item.avatarUrl}
                    alt={item.author}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-white truncate">
                        {item.author}
                      </h5>
                      <div className="flex text-[#D4FF00]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#D4FF00]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 truncate">
                      {item.company}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client Brand Logos Ticker Marquee */}
        <div className="mt-20 pt-10 border-t border-neutral-900">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-neutral-500 mb-8">
            TRUSTED BY CULTURAL INNOVATORS WORLDWIDE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="text-xl font-black tracking-widest text-white uppercase">HYPERDRIVE</span>
            <span className="text-xl font-black tracking-widest text-white uppercase">SYNTHSTREAM</span>
            <span className="text-xl font-black tracking-widest text-white uppercase">SOLARIS</span>
            <span className="text-xl font-black tracking-widest text-white uppercase">VELOCITY</span>
            <span className="text-xl font-black tracking-widest text-white uppercase">AURORA</span>
          </div>
        </div>
      </div>
    </section>
  );
};
