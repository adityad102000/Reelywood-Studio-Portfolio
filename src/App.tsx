import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { ProjectsBentoGrid } from './components/ProjectsBentoGrid';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ContactModal } from './components/ContactModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { GlobalLoader } from './components/GlobalLoader';
import { Project } from './types';
import { fetchProjects } from './lib/supabase';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');
  const [preselectedProjectTitle, setPreselectedProjectTitle] = useState('');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load all projects for routing & modal lookups
  useEffect(() => {
    fetchProjects(true).then((data) => {
      setAllProjects(data);
    });
  }, [refreshKey]);

  // Sync state based on URL hash
  const syncRouteWithHash = useCallback(async () => {
    const hash = window.location.hash.replace(/^#\/?/, '');

    if (hash === 'admin') {
      setAdminOpen(true);
      setContactOpen(false);
      setSelectedProject(null);
    } else if (hash === 'contact') {
      setContactOpen(true);
      setAdminOpen(false);
      setSelectedProject(null);
    } else if (hash.startsWith('project-') || hash.startsWith('project/')) {
      const projectId = hash.replace(/^(project-|project\/)/, '');
      let found = allProjects.find((p) => String(p.id) === projectId);
      if (!found) {
        const fresh = await fetchProjects(true);
        setAllProjects(fresh);
        found = fresh.find((p) => String(p.id) === projectId);
      }
      if (found) {
        setSelectedProject(found);
        setAdminOpen(false);
        setContactOpen(false);
      } else {
        setSelectedProject(null);
      }
    } else {
      // Main site views (#home, #services, #projects, #testimonials or empty)
      setAdminOpen(false);
      setContactOpen(false);
      setSelectedProject(null);

      if (hash && ['home', 'services', 'projects', 'testimonials'].includes(hash)) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (!hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [allProjects]);

  useEffect(() => {
    syncRouteWithHash();
    window.addEventListener('hashchange', syncRouteWithHash);
    window.addEventListener('popstate', syncRouteWithHash);
    return () => {
      window.removeEventListener('hashchange', syncRouteWithHash);
      window.removeEventListener('popstate', syncRouteWithHash);
    };
  }, [syncRouteWithHash]);

  // Handle Return / Back navigation from modal views
  const handleReturnToSite = useCallback(() => {
    setAdminOpen(false);
    setContactOpen(false);
    setSelectedProject(null);

    if (window.location.hash !== '#home' && window.location.hash !== '') {
      window.location.hash = 'home';
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Global Keyboard Escape navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (adminOpen || contactOpen || selectedProject !== null)) {
        handleReturnToSite();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminOpen, contactOpen, selectedProject, handleReturnToSite]);

  // Open Contact Modal
  const handleOpenContact = (service = '', projectTitle = '') => {
    setPreselectedService(service);
    setPreselectedProjectTitle(projectTitle);
    window.location.hash = 'contact';
  };

  // Open Admin Portal
  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
  };

  // Open Project Modal
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    window.location.hash = `project-${project.id}`;
  };

  const scrollToProjects = () => {
    window.location.hash = 'projects';
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-['Urbanist',sans-serif] selection:bg-[#D4FF00] selection:text-black">
      {/* Global Page Transition Loader Overlay */}
      <AnimatePresence>
        {initialLoading && (
          <GlobalLoader
            isLoading={initialLoading}
            onComplete={() => setInitialLoading(false)}
          />
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <Navbar
        onOpenContact={() => handleOpenContact()}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Single-Page Sections */}
      <main>
        {/* Section 1: Home / Hero */}
        <Hero
          onOpenContact={() => handleOpenContact()}
          onExploreProjects={scrollToProjects}
        />

        {/* Section 2: Services */}
        <Services onSelectServiceForContact={(s) => handleOpenContact(s)} />

        {/* Section 3: Projects Bento Grid Vault */}
        <ProjectsBentoGrid onSelectProject={handleSelectProject} />

        {/* Section 4: Testimonials */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer
        onOpenContact={() => handleOpenContact()}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Interactive Lightbox / Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={handleReturnToSite}
        onBookSimilar={(title) => handleOpenContact('', title)}
      />

      <ContactModal
        isOpen={contactOpen}
        onClose={handleReturnToSite}
        preselectedService={preselectedService}
        preselectedProject={preselectedProjectTitle}
      />

      {/* Hidden Admin Portal */}
      <AdminPortal
        isOpen={adminOpen}
        onClose={handleReturnToSite}
        onProjectsChanged={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}
