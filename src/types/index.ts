// Type Definitions for Propel.AI

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
  available_from?: Date;
  website_url?: string;
  priority?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface PropertyImage {
  id?: number;
  property_id: number;
  image_url: string;
  cloudinary_id?: string;
  is_primary?: boolean;
  display_order?: number;
  created_at?: Date;
}

export interface FbGroup {
  id?: number;
  name: string;
  url: string;
  group_id?: string;
  members_count?: number;
  category?: 'קונים' | 'מוכרים' | 'כללי';
  target_cities?: string[];
  active_hours?: string;
  rules?: string;
  is_active?: boolean;
  last_posted_at?: Date;
  success_rate?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Post {
  id?: number;
  property_id: number;
  group_id: number;
  post_text: string;
  post_url?: string;
  fb_post_id?: string;
  scheduled_at?: Date;
  posted_at?: Date;
  status?: 'pending' | 'posted' | 'failed' | 'deleted';
  views_count?: number;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  error_message?: string;
  created_at?: Date;
}

export interface Lead {
  id?: number;
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
  created_at?: Date;
  updated_at?: Date;
}

export interface ContentTemplate {
  id?: number;
  property_type?: string;
  template_text: string;
  variables?: string[];
  tone?: 'אגרסיבי' | 'מקצועי' | 'ידידותי';
  is_active?: boolean;
  usage_count?: number;
  success_rate?: number;
  created_at?: Date;
}

export interface PostVariation {
  id?: number;
  property_id: number;
  variation_text: string;
  used_count?: number;
  last_used_at?: Date;
  created_at?: Date;
}

export interface SystemLog {
  id?: number;
  level: 'info' | 'warning' | 'error' | 'critical';
  module: string;
  message: string;
  metadata?: any;
  created_at?: Date;
}

export interface PerformanceMetrics {
  id?: number;
  date: Date;
  posts_published?: number;
  posts_failed?: number;
  total_views?: number;
  total_likes?: number;
  total_comments?: number;
  total_shares?: number;
  leads_generated?: number;
  hot_leads?: number;
  created_at?: Date;
}

export interface FbAccount {
  id?: number;
  email: string;
  name?: string;
  is_active?: boolean;
  last_used_at?: Date;
  posts_today?: number;
  is_blocked?: boolean;
  blocked_until?: Date;
  created_at?: Date;
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

export interface PostGenerationOptions {
  property: Property;
  tone?: 'אגרסיבי' | 'מקצועי' | 'ידידותי';
  length?: 'short' | 'medium' | 'long';
  include_emoji?: boolean;
  include_call_to_action?: boolean;
}
