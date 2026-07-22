import { Category, Project, ServiceItem, Testimonial } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Influencer Campaign' },
  { id: 'cat-2', name: 'AI Brand Identity' },
  { id: 'cat-3', name: 'Performance Marketing' },
  { id: 'cat-4', name: 'AI Video Production' },
  { id: 'cat-5', name: 'Social Experience' },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Influencer Campaigns',
    tagline: 'Culture-shifting creator partnerships',
    description: 'We orchestrate high-velocity creator networks that align with youth culture, generating billions of organic impressions with unmatched authenticity.',
    features: ['Roster Curation & Vetting', 'Contract & Rights Management', 'Multi-Platform Viral Seeding', 'Real-time ROI Tracking'],
    icon: 'Sparkles',
    accentColor: '#D4FF00', // Electric Lime
  },
  {
    id: 'srv-2',
    title: 'Performance Marketing',
    tagline: 'Hyper-targeted conversion engine',
    description: 'Data-driven paid social and programmatic execution engineered for direct-to-consumer exponential scaling and hyper-efficient CAC.',
    features: ['Paid Social Funnel Architecture', 'Dynamic Creative Optimization', 'Attribution Modeling', 'A/B Funnel Experimentation'],
    icon: 'TrendingUp',
    accentColor: '#3B82F6', // Cobalt
  },
  {
    id: 'srv-3',
    title: 'AI Brand Identity & Design Systems',
    tagline: 'Generative brand universes for tomorrow',
    description: 'Combining human creative design with proprietary AI model workflows to synthesize ultra-custom brand systems, logos, and digital asset engines.',
    features: ['Synthetic Visual Language', 'Dynamic Typography Systems', 'Prompt Engineering Architecture', 'Scalable Motion Guidelines'],
    icon: 'Cpu',
    accentColor: '#EC4899', // Magenta
  },
  {
    id: 'srv-4',
    title: 'Social Media Management',
    tagline: 'Always-on brand narrative',
    description: 'Turn scroll-passers into die-hard community advocates through high-frequency visual storytelling and real-time social listening.',
    features: ['Content Engine Production', 'Community Co-Creation', 'Trend Jacking Protocol', 'Cross-Channel Operations'],
    icon: 'Share2',
    accentColor: '#A855F7', // Violet
  },
  {
    id: 'srv-5',
    title: 'AI Video Production',
    tagline: 'Cinematic commercials at digital velocity',
    description: 'Hollywood-grade visual storytelling powered by generative neural video pipelines, photorealistic VFX, and custom spatial soundscapes.',
    features: ['AI Synthesized Cinematography', 'Neural Voiceover & Dubbing', 'Dynamic Motion Capture', 'Ultra-fast Post Pipelines'],
    icon: 'Clapperboard',
    accentColor: '#10B981', // Emerald
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'HYPERDRIVE / ELECTRIC CYBERTRUCK',
    description: 'Multi-channel viral campaign launching futuristic EV streetwear merchandise across TikTok & IG Reels with synthetic motion aesthetics.',
    category_id: 'cat-1',
    category: { id: 'cat-1', name: 'Influencer Campaign' },
    media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    tile_size: 'large',
    display_order: 1,
    published: true,
    client_name: 'HYPERDRIVE GEAR',
    year: '2025',
    stats_highlight: '142M Impressions',
  },
  {
    id: 'proj-2',
    title: 'NEURAL FLUIDITY',
    description: 'Full AI generative visual brand identity system for a Web3 streaming platform with real-time reactive shaders.',
    category_id: 'cat-2',
    category: { id: 'cat-2', name: 'AI Brand Identity' },
    media_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    tile_size: 'medium',
    display_order: 2,
    published: true,
    client_name: 'SYNTHSTREAM INC',
    year: '2025',
    stats_highlight: '+310% App Downloads',
  },
  {
    id: 'proj-3',
    title: 'SOLARIS MONOLITH',
    description: 'AI-generated 4K cinematic launch commercial featuring photorealistic alien landscapes and volumetric lighting.',
    category_id: 'cat-4',
    category: { id: 'cat-4', name: 'AI Video Production' },
    media_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    tile_size: 'small',
    display_order: 3,
    published: true,
    client_name: 'SOLARIS STUDIOS',
    year: '2024',
    stats_highlight: 'Cannes Lions Shortlist',
  },
  {
    id: 'proj-4',
    title: 'KINETIC VELOCITY',
    description: 'Performance social media blitz with custom dynamic ad copy generators delivering 4.2x ROAS in 14 days.',
    category_id: 'cat-3',
    category: { id: 'cat-3', name: 'Performance Marketing' },
    media_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    tile_size: 'small',
    display_order: 4,
    published: true,
    client_name: 'VELOCITY FIT',
    year: '2025',
    stats_highlight: '4.2x ROAS Scaling',
  },
  {
    id: 'proj-5',
    title: 'AURORA CHRONICLES',
    description: '30-day viral TikTok co-creation campaign with 45 macro-influencers generating 18k organic user remakes.',
    category_id: 'cat-5',
    category: { id: 'cat-5', name: 'Social Experience' },
    media_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    tile_size: 'medium',
    display_order: 5,
    published: true,
    client_name: 'AURORA BEAUTY',
    year: '2024',
    stats_highlight: '18K UGC Submissions',
  },
  {
    id: 'proj-6',
    title: 'CYBERPUNK ODE',
    description: 'Generative futuristic documentary short film created entirely using AI spatial audio and neural rendering.',
    category_id: 'cat-4',
    category: { id: 'cat-4', name: 'AI Video Production' },
    media_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    tile_size: 'large',
    display_order: 6,
    published: true,
    client_name: 'NEO-TOKYO MEDIA',
    year: '2025',
    stats_highlight: '1.2M Organic Shares',
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote: "Reelywood didn't just market our brand — they completely redefined how Gen-Z talks about us. Our viral campaign reached 140M+ views in under a week.",
    author: "Elena Rostova",
    role: "Global CMO",
    company: "HyperDrive Gear",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    highlightMetric: "142M+ Views",
    categoryTag: "Viral Impact"
  },
  {
    id: 'test-2',
    quote: "The speed and visual magic of their AI Brand System gave us a top-tier luxury identity in 10 days instead of 6 months. Absolute game-changers.",
    author: "Marcus Vance",
    role: "Founder & CEO",
    company: "SynthStream Inc",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    highlightMetric: "+310% Growth",
    categoryTag: "Brand Elevation"
  },
  {
    id: 'test-3',
    quote: "Working with Reelywood feels like stepping into 2030. Their AI video team produces cinematic quality commercials at 10x traditional speed.",
    author: "Sophia Chen",
    role: "VP of Creative",
    company: "Solaris Studios",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    highlightMetric: "4.2x ROAS",
    categoryTag: "AI Production"
  },
  {
    id: 'test-4',
    quote: "Unfiltered creativity combined with bulletproof performance data. They hit our quarterly sales target in the first 12 days of campaign launch.",
    author: "Devon Alistair",
    role: "Head of Growth",
    company: "Velocity Fit",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    highlightMetric: "12-Day Conversion",
    categoryTag: "Direct ROI"
  }
];
