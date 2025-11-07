export interface Property {
  id?: number;
  property_type: 'מגרש' | 'דירה' | 'בית פרטי' | 'נכס מסחרי';
  city: string;
  neighborhood?: string;
  street?: string;
  price: number;
  rooms?: number;
  area_sqm?: number;
  description?: string;
  status?: 'active' | 'sold' | 'rented' | 'inactive';
  available_from?: string;
  website_url?: string;
  priority?: number;
  created_at?: string;
  updated_at?: string;
  images?: PropertyImage[];
}

export interface PropertyImage {
  id?: number;
  property_id: number;
  image_url: string;
  is_primary?: boolean;
  display_order?: number;
}

export interface DashboardStats {
  total_properties: number;
  active_properties: number;
  total_posts_today: number;
  total_leads_today: number;
  hot_leads_today: number;
  pending_posts: number;
  active_groups: number;
}

export interface Lead {
  id: number;
  post_id?: number;
  property_id?: number;
  fb_user_id?: string;
  fb_user_name?: string;
  fb_profile_url?: string;
  contact_type?: 'comment' | 'message' | 'reaction';
  message_text?: string;
  sentiment?: 'hot' | 'warm' | 'cold' | 'negative';
  score?: number;
  responded?: boolean;
  response_text?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  created_at?: string;
  updated_at?: string;
  city?: string;
  property_type?: string;
  price?: number;
}

export interface GroupPerformance {
  id: number;
  name: string;
  members_count: number;
  category: string;
  total_posts: number;
  total_likes: number;
  total_comments: number;
  total_leads: number;
  avg_likes_per_post: number;
}

export interface PropertyPerformance {
  id: number;
  property_type: string;
  city: string;
  neighborhood?: string;
  price: number;
  total_posts: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_leads: number;
  hot_leads: number;
}
