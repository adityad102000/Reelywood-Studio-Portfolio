import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Layers, Grid, MessageSquareQuote, Menu, X, Shield, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact, onOpenAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'projects', label: 'Projects', icon: Grid },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  ];

  // Scroll detection for navbar background opacity & glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to set active section based on scroll position
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);

    if (window.location.hash !== `#${id}`) {
      window.location.hash = id;
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-neutral-800/80 py-3 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="group flex items-center gap-2 text-2xl font-black tracking-tighter uppercase text-white"
          >
            <span className="w-8 h-8 rounded-lg bg-[#D4FF00] text-black flex items-center justify-center font-black text-lg transition-transform group-hover:scale-110 group-hover:rotate-6">
              R
            </span>
            <span>
              REELY<span className="text-[#D4FF00]">WOOD</span>
            </span>
          </a>

          {/* Desktop Nav Items Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-900/80 border border-neutral-800/80 p-1.5 rounded-full backdrop-blur-md shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                    isActive ? 'text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute inset-0 bg-[#D4FF00] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Hidden Admin Toggle */}
            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#D4FF00] hover:border-[#D4FF00]/50 transition-all"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Shimmer CTA Button */}
            <button
              onClick={onOpenContact}
              className="btn-shimmer relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4FF00] text-black font-extrabold text-xs tracking-wider uppercase hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(212,255,0,0.3)]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Get a Call</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenContact}
              className="px-3.5 py-1.5 rounded-full bg-[#D4FF00] text-black font-extrabold text-xs tracking-wider uppercase"
            >
              Contact
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[65px] left-0 right-0 z-40 bg-[#0A0A0A]/95 border-b border-neutral-800 backdrop-blur-2xl md:hidden overflow-hidden"
          >
            <div className="p-5 flex flex-col gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-[#D4FF00] text-black'
                        : 'bg-neutral-900/60 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-[#D4FF00] p-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Portal</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
