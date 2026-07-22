import './fetchPolyfill';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Category, Project } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PROJECTS } from '../data/mockData';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are set and not placeholder defaults
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project') &&
    !supabaseUrl.includes('MY_SUPABASE') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (input, init) => window.fetch(input, init),
      },
    })
  : null;

// Local Fallback Storage Keys for Demo / Unconfigured State
const LOCAL_STORAGE_PROJECTS_KEY = 'reelywood_local_projects';
const LOCAL_STORAGE_CATEGORIES_KEY = 'reelywood_local_categories';

// Initialize local storage fallback if needed
const getLocalProjects = (): Project[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return INITIAL_PROJECTS;
};

const saveLocalProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
};

const getLocalCategories = (): Category[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return INITIAL_CATEGORIES;
};

const saveLocalCategories = (categories: Category[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
};

// ==========================================
// DATA API FUNCTIONS (SUPABASE + FALLBACK)
// ==========================================

export async function fetchCategories(): Promise<Category[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      if (data && data.length > 0) return data as Category[];
    } catch (err) {
      console.warn('Supabase fetchCategories fallback:', err);
    }
  }
  return getLocalCategories();
}

export async function fetchProjects(includeUnpublished = false): Promise<Project[]> {
  if (supabase) {
    try {
      let query = supabase
        .from('projects')
        .select('*, category:categories(*)');

      if (!includeUnpublished) {
        query = query.eq('published', true);
      }

      const { data, error } = await query.order('display_order', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) return data as Project[];
    } catch (err) {
      console.warn('Supabase fetchProjects fallback:', err);
    }
  }

  // Fallback to local state
  const local = getLocalProjects();
  if (includeUnpublished) {
    return local;
  }
  return local.filter((p) => p.published);
}

export async function createCategory(name: string): Promise<Category> {
  const cleanName = name.trim();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: cleanName }])
        .select()
        .single();
      if (error) throw error;
      return data as Category;
    } catch (err) {
      console.warn('Supabase createCategory error:', err);
    }
  }

  // Local fallback
  const categories = getLocalCategories();
  const existing = categories.find((c) => c.name.toLowerCase() === cleanName.toLowerCase());
  if (existing) return existing;

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: cleanName,
    created_at: new Date().toISOString(),
  };
  const updated = [...categories, newCat];
  saveLocalCategories(updated);
  return newCat;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: project.title,
            description: project.description,
            category_id: project.category_id,
            media_url: project.media_url,
            media_type: project.media_type,
            tile_size: project.tile_size,
            display_order: project.display_order,
            published: project.published,
          },
        ])
        .select('*, category:categories(*)')
        .single();
      if (error) throw error;
      return data as Project;
    } catch (err) {
      console.warn('Supabase createProject error:', err);
    }
  }

  // Local fallback
  const projects = getLocalProjects();
  const categories = getLocalCategories();
  const category = categories.find((c) => c.id === project.category_id) || {
    id: project.category_id,
    name: 'General',
  };

  const newProj: Project = {
    ...project,
    id: `proj-${Date.now()}`,
    category,
    created_at: new Date().toISOString(),
  };

  const updated = [newProj, ...projects];
  saveLocalProjects(updated);
  return newProj;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  if (supabase) {
    try {
      // Omit joined object property
      const { category, ...cleanUpdates } = updates as any;
      const { data, error } = await supabase
        .from('projects')
        .update(cleanUpdates)
        .eq('id', id)
        .select('*, category:categories(*)')
        .single();
      if (error) throw error;
      return data as Project;
    } catch (err) {
      console.warn('Supabase updateProject error:', err);
    }
  }

  // Local fallback
  const projects = getLocalProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Project not found');

  const updatedProj = { ...projects[index], ...updates };
  projects[index] = updatedProj;
  saveLocalProjects(projects);
  return updatedProj;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteProject error:', err);
    }
  }

  // Local fallback
  const projects = getLocalProjects();
  const filtered = projects.filter((p) => p.id !== id);
  saveLocalProjects(filtered);
  return true;
}

export async function uploadMedia(file: File): Promise<string> {
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('project-media').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.warn('Supabase uploadMedia error:', err);
    }
  }

  // Fallback: convert file to Object URL or Data URL for testing
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export function subscribeProjects(callback: () => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('public:projects')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      () => {
        callback();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
