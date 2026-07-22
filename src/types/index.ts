export type TileSize = 'small' | 'medium' | 'large';
export type MediaType = 'image' | 'video';

export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  category_id: string;
  category?: Category;
  media_url: string;
  gallery_urls?: string[];
  media_type: MediaType;
  tile_size: TileSize;
  display_order: number;
  published: boolean;
  created_at?: string;
  // Optional extra presentation attributes
  client_name?: string;
  year?: string;
  stats_highlight?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  icon: string;
  accentColor: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl: string;
  highlightMetric?: string;
  categoryTag?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  serviceInterest: string;
  budgetRange: string;
  message: string;
}
