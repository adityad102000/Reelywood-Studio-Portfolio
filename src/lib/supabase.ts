import './fetchPolyfill';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Category, Project } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PROJECTS } from '../data/mockData';

const env = (import.meta as any).env || {};

export const getSupabaseCredentials = () => {
  const url =
    (typeof localStorage !== 'undefined' ? localStorage.getItem('supabase_url') : '') ||
    env.VITE_SUPABASE_URL ||
    '';
  const anonKey =
    (typeof localStorage !== 'undefined' ? localStorage.getItem('supabase_anon_key') : '') ||
    env.VITE_SUPABASE_ANON_KEY ||
    '';
  return { url, anonKey };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseCredentials();
  return (
    Boolean(url) &&
    Boolean(anonKey) &&
    !url.includes('your-project') &&
    !url.includes('MY_SUPABASE') &&
    url.startsWith('https://')
  );
};

export let supabase: SupabaseClient | null = null;

export const initSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseCredentials();
  if (isSupabaseConfigured()) {
    try {
      supabase = createClient(url, anonKey, {
        global: {
          fetch: (input, init) => window.fetch(input, init),
        },
      });
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      supabase = null;
    }
  } else {
    supabase = null;
  }
  return supabase;
};

initSupabaseClient();

export const saveSupabaseCredentials = (url: string, anonKey: string) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('supabase_url', url.trim());
    localStorage.setItem('supabase_anon_key', anonKey.trim());
  }
  return initSupabaseClient();
};

export const clearSupabaseCredentials = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
  }
  return initSupabaseClient();
};

// Local Fallback Storage Keys for Demo / Unconfigured State
const LOCAL_STORAGE_PROJECTS_KEY = 'reelywood_local_projects';
const LOCAL_STORAGE_CATEGORIES_KEY = 'reelywood_local_categories';

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
      if (!error && data && data.length > 0) {
        return data as Category[];
      }
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
      if (!error && data && data.length > 0) {
        return data as Project[];
      }
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
      if (!error && data) {
        const local = getLocalCategories();
        saveLocalCategories([...local, data as Category]);
        return data as Category;
      }
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
  const galleryUrls = project.gallery_urls && project.gallery_urls.length > 0
    ? project.gallery_urls
    : [project.media_url];

  if (supabase) {
    try {
      // 1. Resolve a valid Supabase category ID to satisfy FK constraint
      let validCategoryId: string | null = null;

      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(project.category_id)) {
        const { data: existingCat } = await supabase
          .from('categories')
          .select('id')
          .eq('id', project.category_id)
          .maybeSingle();
        if (existingCat?.id) {
          validCategoryId = existingCat.id;
        }
      }

      if (!validCategoryId) {
        const localCats = getLocalCategories();
        const localCat = localCats.find((c) => c.id === project.category_id);
        const catName = localCat?.name || (typeof project.category === 'object' ? project.category?.name : 'General');

        const { data: nameMatch } = await supabase
          .from('categories')
          .select('id')
          .ilike('name', catName)
          .maybeSingle();

        if (nameMatch?.id) {
          validCategoryId = nameMatch.id;
        } else {
          const { data: newCat } = await supabase
            .from('categories')
            .insert([{ name: catName }])
            .select('id')
            .maybeSingle();

          if (newCat?.id) {
            validCategoryId = newCat.id;
          } else {
            const { data: anyCat } = await supabase
              .from('categories')
              .select('id')
              .limit(1)
              .maybeSingle();

            if (anyCat?.id) {
              validCategoryId = anyCat.id;
            } else {
              const { data: defCat } = await supabase
                .from('categories')
                .insert([{ name: 'General' }])
                .select('id')
                .single();
              if (defCat?.id) {
                validCategoryId = defCat.id;
              }
            }
          }
        }
      }

      if (!validCategoryId) {
        throw new Error('Failed to resolve or create a valid Category in Supabase database.');
      }

      // 2. Prepare payloads
      const fullPayload: any = {
        title: project.title,
        description: project.description,
        category_id: validCategoryId,
        media_url: project.media_url,
        gallery_urls: galleryUrls,
        media_type: project.media_type,
        tile_size: project.tile_size,
        display_order: project.display_order,
        published: project.published,
        client_name: project.client_name,
        year: project.year,
        stats_highlight: project.stats_highlight,
      };

      const corePayload: any = {
        title: project.title,
        description: project.description,
        category_id: validCategoryId,
        media_url: project.media_url,
        media_type: project.media_type,
        tile_size: project.tile_size,
        display_order: project.display_order,
        published: project.published,
      };

      let resultData: any = null;

      // Attempt 1: Full payload + joined category select
      const res1 = await supabase
        .from('projects')
        .insert([fullPayload])
        .select('*, category:categories(*)')
        .maybeSingle();

      if (!res1.error && res1.data) {
        resultData = res1.data;
      } else {
        // Attempt 2: Full payload + simple select
        const res2 = await supabase
          .from('projects')
          .insert([fullPayload])
          .select('*')
          .maybeSingle();

        if (!res2.error && res2.data) {
          resultData = res2.data;
        } else {
          // Attempt 3: Core payload + joined category select
          const res3 = await supabase
            .from('projects')
            .insert([corePayload])
            .select('*, category:categories(*)')
            .maybeSingle();

          if (!res3.error && res3.data) {
            resultData = res3.data;
          } else {
            // Attempt 4: Core payload + simple select
            const res4 = await supabase
              .from('projects')
              .insert([corePayload])
              .select('*')
              .maybeSingle();

            if (!res4.error && res4.data) {
              resultData = res4.data;
            } else {
              console.warn('All Supabase insert attempts failed:', res4.error || res3.error || res2.error || res1.error);
            }
          }
        }
      }

      if (resultData) {
        if (!resultData.gallery_urls || resultData.gallery_urls.length === 0) {
          resultData.gallery_urls = galleryUrls;
        }

        if (!resultData.category) {
          const { data: catData } = await supabase
            .from('categories')
            .select('*')
            .eq('id', validCategoryId)
            .maybeSingle();
          resultData.category = catData || { id: validCategoryId, name: 'General' };
        }

        // Sync local storage cache
        const currentLocal = getLocalProjects();
        saveLocalProjects([resultData as Project, ...currentLocal]);

        return resultData as Project;
      }
    } catch (err) {
      console.warn('Supabase createProject exception, using fallback:', err);
    }
  }

  // Local fallback (guaranteed to succeed)
  const projects = getLocalProjects();
  const categories = getLocalCategories();
  const category = categories.find((c) => c.id === project.category_id) || {
    id: project.category_id,
    name: 'General',
  };

  const newProj: Project = {
    ...project,
    gallery_urls: galleryUrls,
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
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
        const { category, ...cleanUpdates } = updates as any;

        if (cleanUpdates.category_id) {
          let validCatId: string | null = null;
          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanUpdates.category_id)) {
            const { data: match } = await supabase
              .from('categories')
              .select('id')
              .eq('id', cleanUpdates.category_id)
              .maybeSingle();
            if (match?.id) validCatId = match.id;
          }

          if (!validCatId) {
            const localCats = getLocalCategories();
            const localCat = localCats.find((c) => c.id === cleanUpdates.category_id);
            if (localCat) {
              const { data: nameMatch } = await supabase
                .from('categories')
                .select('id')
                .ilike('name', localCat.name)
                .maybeSingle();
              if (nameMatch?.id) validCatId = nameMatch.id;
            }
          }

          if (validCatId) {
            cleanUpdates.category_id = validCatId;
          } else {
            delete cleanUpdates.category_id;
          }
        }

        let updatedData: any = null;

        // Attempt 1: Full updates + joined category select
        const res1 = await supabase
          .from('projects')
          .update(cleanUpdates)
          .eq('id', id)
          .select('*, category:categories(*)')
          .maybeSingle();

        if (!res1.error && res1.data) {
          updatedData = res1.data;
        } else {
          // Attempt 2: Full updates + simple select
          const res2 = await supabase
            .from('projects')
            .update(cleanUpdates)
            .eq('id', id)
            .select('*')
            .maybeSingle();

          if (!res2.error && res2.data) {
            updatedData = res2.data;
          } else {
            // Attempt 3: Core updates + simple select
            const coreUpdates = { ...cleanUpdates };
            delete coreUpdates.gallery_urls;
            delete coreUpdates.client_name;
            delete coreUpdates.year;
            delete coreUpdates.stats_highlight;

            const res3 = await supabase
              .from('projects')
              .update(coreUpdates)
              .eq('id', id)
              .select('*')
              .maybeSingle();

            if (!res3.error && res3.data) {
              updatedData = res3.data;
            }
          }
        }

        if (updatedData) {
          if (!updatedData.category && updatedData.category_id) {
            const { data: catData } = await supabase
              .from('categories')
              .select('*')
              .eq('id', updatedData.category_id)
              .maybeSingle();
            updatedData.category = catData;
          }

          const projects = getLocalProjects();
          const updatedLocal = projects.map((p) => (p.id === id ? (updatedData as Project) : p));
          saveLocalProjects(updatedLocal);
          return updatedData as Project;
        }
      }
    } catch (err) {
      console.warn('Supabase updateProject error:', err);
    }
  }

  // Local fallback
  const projects = getLocalProjects();
  const categories = getLocalCategories();
  const index = projects.findIndex((p) => p.id === id);

  if (index !== -1) {
    const p = projects[index];
    const cat = updates.category_id
      ? categories.find((c) => c.id === updates.category_id) || p.category
      : p.category;

    const updatedProj = { ...p, ...updates, category: cat };
    projects[index] = updatedProj;
    saveLocalProjects(projects);
    return updatedProj;
  }

  throw new Error('Project not found');
}

export async function deleteProject(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
        await supabase.from('projects').delete().eq('id', id);
      }
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
      const fileExt = file.name.split('.').pop() || 'bin';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (!uploadError) {
        const { data } = supabase.storage.from('project-media').getPublicUrl(filePath);
        if (data?.publicUrl) return data.publicUrl;
      } else {
        console.warn('Supabase storage upload failed, using Data URL fallback:', uploadError.message);
      }
    } catch (err) {
      console.warn('Supabase storage exception, using Data URL fallback:', err);
    }
  }

  // Fallback to compressed base64 Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export async function uploadMultipleMedia(files: FileList | File[]): Promise<string[]> {
  const fileArray = Array.from(files);
  const uploadPromises = fileArray.map((file) => uploadMedia(file));
  return Promise.all(uploadPromises);
}

export async function seedSupabaseFromMockData(): Promise<{ categoriesCount: number; projectsCount: number }> {
  if (!supabase) throw new Error('Supabase client is not configured.');

  // 1. Seed categories
  const categoryNames = Array.from(new Set(INITIAL_CATEGORIES.map((c) => c.name)));
  const catInsertPayload = categoryNames.map((name) => ({ name }));

  const { error: catErr } = await supabase
    .from('categories')
    .upsert(catInsertPayload, { onConflict: 'name' });

  if (catErr) {
    // If upsert fails on constraint, attempt standard insert ignoring conflicts
    await supabase.from('categories').insert(catInsertPayload).select();
  }

  // Fetch updated categories to map category_id
  const { data: fetchedCats, error: fetchCatErr } = await supabase.from('categories').select('*');
  if (fetchCatErr) throw fetchCatErr;

  const categoryMap = new Map<string, string>();
  (fetchedCats || []).forEach((cat: any) => {
    categoryMap.set(cat.name.toLowerCase(), cat.id);
  });

  const defaultCatId = fetchedCats && fetchedCats.length > 0 ? fetchedCats[0].id : null;
  if (!defaultCatId) throw new Error('Could not resolve categories in Supabase.');

  // 2. Seed projects
  const projectsToSeed = INITIAL_PROJECTS.map((p) => {
    const matchedCatId = p.category?.name ? categoryMap.get(p.category.name.toLowerCase()) || defaultCatId : defaultCatId;
    return {
      title: p.title,
      description: p.description,
      category_id: matchedCatId,
      media_url: p.media_url,
      gallery_urls: p.gallery_urls && p.gallery_urls.length > 0 ? p.gallery_urls : [p.media_url],
      media_type: p.media_type,
      tile_size: p.tile_size,
      display_order: p.display_order,
      published: p.published,
      client_name: p.client_name,
      year: p.year,
      stats_highlight: p.stats_highlight,
    };
  });

  const { data: projData, error: projError } = await supabase
    .from('projects')
    .insert(projectsToSeed)
    .select();

  if (projError) throw projError;

  return {
    categoriesCount: fetchedCats ? fetchedCats.length : 0,
    projectsCount: projData ? projData.length : 0,
  };
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

