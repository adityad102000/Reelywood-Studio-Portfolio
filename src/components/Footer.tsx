import React, { useState, useEffect } from 'react';
import { Shield, ArrowUp, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenContact }) => {
  const [times, setTimes] = useState({ la: '', ny: '', london: '' });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimes({
        la: now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit' }),
        ny: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }),
        london: now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }),
      });
    };
    updateTimes();
    const timer = setInterval(updateTimes, 10000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-neutral-800 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Top CTA Band */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-mono font-bold text-[#D4FF00] uppercase tracking-widest block mb-2">
              READY TO DOMINATE THE CULTURE?
            </span>
            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              LET'S MAKE <span className="text-[#D4FF00]">HISTORY</span>
            </h3>
          </div>
          <button
            onClick={onOpenContact}
            className="btn-shimmer px-8 py-4 rounded-full bg-[#D4FF00] text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shrink-0"
          >
            Get a Call
          </button>
        </div>

        {/* Middle Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-neutral-900">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5">
            <div className="text-3xl font-black tracking-tighter uppercase text-white mb-4">
              REELY<span className="text-[#D4FF00]">WOOD</span>
            </div>
            <p className="text-neutral-400 font-light text-sm max-w-sm mb-6 leading-relaxed">
              Synthesizing culture-shifting influencer campaigns, AI video production, and high-conversion brand identities.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#home"
                  onClick={(e) => e.preventDefault()}
                  className="p-3 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#D4FF00] hover:border-[#D4FF00]/50 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mb-4">
              SECTIONS
            </h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300">
              <li><a href="#home" className="hover:text-[#D4FF00] transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-[#D4FF00] transition-colors">Services</a></li>
              <li><a href="#projects" className="hover:text-[#D4FF00] transition-colors">Projects</a></li>
              <li><a href="#testimonials" className="hover:text-[#D4FF00] transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Agency Hub Clocks (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mb-4">
              AGENCY HUBS
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60 text-xs">
                <span className="font-bold text-white uppercase">LOS ANGELES</span>
                <span className="font-mono text-[#D4FF00]">{times.la || '11:55 AM'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60 text-xs">
                <span className="font-bold text-white uppercase">NEW YORK</span>
                <span className="font-mono text-[#D4FF00]">{times.ny || '02:55 PM'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60 text-xs">
                <span className="font-bold text-white uppercase">LONDON</span>
                <span className="font-mono text-[#D4FF00]">{times.london || '07:55 PM'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
          <div>
            © {new Date().getFullYear()} Reelywood Studio Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            {/* Hidden Admin Portal Trigger in Footer */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-[#D4FF00] transition-colors font-bold uppercase tracking-wider text-[11px]"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>

            {/* Scroll to top */}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
