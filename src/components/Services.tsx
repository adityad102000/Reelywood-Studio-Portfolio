import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_SERVICES } from '../data/mockData';
import { ServiceItem } from '../types';
import { Sparkles, TrendingUp, Cpu, Share2, Clapperboard, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface ServicesProps {
  onSelectServiceForContact: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForContact }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return Sparkles;
      case 'TrendingUp':
        return TrendingUp;
      case 'Cpu':
        return Cpu;
      case 'Share2':
        return Share2;
      case 'Clapperboard':
        return Clapperboard;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] relative border-t border-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#D4FF00] uppercase mb-3">
              <span className="w-1.5 h-1.5 bg-[#D4FF00] rounded-full" />
              01 // CAPABILITIES
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
              WHAT WE <span className="text-[#D4FF00]">DOMINATE</span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-neutral-400 font-light max-w-md text-sm sm:text-base">
            End-to-end creative superpowers engineered to turn attention into unstoppable brand momentum.
          </p>
        </div>

        {/* Services Grid (Staggered Animations) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_SERVICES.map((service, index) => {
            const IconComponent = getIcon(service.icon);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedService(service)}
                className="group relative bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-8 hover:border-[#D4FF00]/50 hover:bg-neutral-900 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Glow Accent Effect on Hover */}
                <div
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: service.accentColor }}
                />

                <div>
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/50 text-[#D4FF00] group-hover:scale-110 group-hover:bg-[#D4FF00] group-hover:text-black transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-500">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Service Title & Tagline */}
                  <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight mb-2 group-hover:text-[#D4FF00] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#D4FF00] mb-4">
                    {service.tagline}
                  </p>

                  {/* 1-2 Line Description */}
                  <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs font-bold tracking-wider uppercase text-neutral-300 group-hover:text-white">
                  <span>View Scope & Deliverables</span>
                  <ArrowRight className="w-4 h-4 text-[#D4FF00] transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Expanded Service Detail Drawer/Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4FF00]/10 text-[#D4FF00] text-xs font-extrabold uppercase tracking-widest mb-4">
                Service Deep Dive
              </div>

              <h3 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mb-2">
                {selectedService.title}
              </h3>
              <p className="text-sm font-bold uppercase tracking-wider text-[#D4FF00] mb-6">
                {selectedService.tagline}
              </p>

              <p className="text-neutral-300 text-base font-light leading-relaxed mb-8">
                {selectedService.description}
              </p>

              <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
                  Key Scope & Execution Capabilities:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-xs font-medium text-white">
                      <CheckCircle2 className="w-4 h-4 text-[#D4FF00] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-800">
                <button
                  onClick={() => {
                    const name = selectedService.title;
                    setSelectedService(null);
                    onSelectServiceForContact(name);
                  }}
                  className="flex-1 btn-shimmer py-3.5 px-6 rounded-full bg-[#D4FF00] text-black font-black text-xs uppercase tracking-widest text-center shadow-lg hover:scale-105 transition-transform"
                >
                  Book This Service
                </button>
                <button
                  onClick={() => setSelectedService(null)}
                  className="py-3.5 px-6 rounded-full bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest text-center hover:bg-neutral-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
