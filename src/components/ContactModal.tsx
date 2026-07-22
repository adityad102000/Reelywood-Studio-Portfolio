import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, PhoneCall, ArrowLeft } from 'lucide-react';
import { ContactFormData } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  preselectedProject?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  preselectedService = '',
  preselectedProject = '',
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    serviceInterest: preselectedService || 'Influencer Campaigns',
    budgetRange: '$25k - $50k',
    message: preselectedProject ? `Interested in commissioning work similar to "${preselectedProject}".` : '',
  });

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, serviceInterest: preselectedService }));
    }
  }, [preselectedService]);

  useEffect(() => {
    if (preselectedProject) {
      setFormData((prev) => ({
        ...prev,
        message: `Interested in commissioning work similar to "${preselectedProject}".`,
      }));
    }
  }, [preselectedProject]);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl my-8"
        >
          {/* Header Return Navigation & Close Buttons */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <button
              onClick={resetAndClose}
              className="px-3.5 py-1.5 rounded-full bg-neutral-800 border border-neutral-700/60 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:border-[#D4FF00] flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4FF00]" />
              <span className="hidden sm:inline">Back to Site</span>
            </button>
            <button
              onClick={resetAndClose}
              title="Close View"
              className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-[#D4FF00] text-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,255,0,0.4)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black uppercase text-white tracking-tight mb-2">
                STRATEGY CALL CONFIRMED!
              </h3>
              <p className="text-neutral-300 font-light text-sm max-w-md mx-auto mb-8">
                Thank you, <span className="text-[#D4FF00] font-bold">{formData.name}</span>. A Reelywood partner will review your campaign brief and reach out via email within 4 hours.
              </p>
              <button
                onClick={resetAndClose}
                className="btn-shimmer px-8 py-3.5 rounded-full bg-[#D4FF00] text-black font-black text-xs uppercase tracking-widest"
              >
                Back to Site
              </button>
            </div>
          ) : (
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4FF00]/10 text-[#D4FF00] text-xs font-black uppercase tracking-widest mb-4">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>INITIATE STRATEGY BRIEF</span>
              </div>

              <h3 className="text-3xl font-black uppercase text-white tracking-tight mb-2">
                GET A <span className="text-[#D4FF00]">CALL</span>
              </h3>
              <p className="text-neutral-400 font-light text-xs sm:text-sm mb-8">
                Tell us about your brand vision, timeline, and goals. Let's create something unforgettable.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#D4FF00] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@brand.com"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#D4FF00] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Brand / Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Apex Labs"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#D4FF00] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Primary Service Focus
                    </label>
                    <select
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#D4FF00] focus:outline-none transition-colors"
                    >
                      <option value="Influencer Campaigns">Influencer Campaigns</option>
                      <option value="Performance Marketing">Performance Marketing</option>
                      <option value="AI Brand Identity">AI Brand Identity</option>
                      <option value="Social Media Management">Social Media Management</option>
                      <option value="AI Video Production">AI Video Production</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Estimated Campaign Budget
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['$10k - $25k', '$25k - $50k', '$50k+'].map((budget) => (
                      <button
                        type="button"
                        key={budget}
                        onClick={() => setFormData({ ...formData, budgetRange: budget })}
                        className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                          formData.budgetRange === budget
                            ? 'bg-[#D4FF00] text-black border border-[#D4FF00]'
                            : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Campaign Scope / Message
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your objectives, timelines, or key deliverables..."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#D4FF00] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-shimmer w-full py-4 rounded-full bg-[#D4FF00] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,255,0,0.3)] hover:scale-102 transition-transform"
                >
                  {submitting ? (
                    <span className="animate-pulse">Transmitting Brief...</span>
                  ) : (
                    <>
                      <span>Submit Strategy Brief</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
