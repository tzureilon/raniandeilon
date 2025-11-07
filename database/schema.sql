-- Propel.AI Database Schema

-- Properties Table (נכסים)
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    property_type VARCHAR(50) NOT NULL, -- מגרש, דירה, בית פרטי, נכס מסחרי
    city VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100),
    street VARCHAR(200),
    price DECIMAL(12, 2) NOT NULL,
    rooms INTEGER,
    area_sqm DECIMAL(8, 2),
    description TEXT,
    status VARCHAR(20) DEFAULT 'active', -- active, sold, rented, inactive
    available_from DATE,
    website_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority INTEGER DEFAULT 5 -- 1-10, מעדיפות הפרסום
);

-- Property Images Table (תמונות נכס)
CREATE TABLE IF NOT EXISTS property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    cloudinary_id VARCHAR(200),
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facebook Groups Table (קבוצות פייסבוק)
CREATE TABLE IF NOT EXISTS fb_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(500) NOT NULL UNIQUE,
    group_id VARCHAR(100) UNIQUE,
    members_count INTEGER,
    category VARCHAR(100), -- קונים, מוכרים, כללי
    target_cities TEXT[], -- Array of cities
    active_hours VARCHAR(100), -- "08:00-22:00"
    rules TEXT,
    is_active BOOLEAN DEFAULT true,
    last_posted_at TIMESTAMP,
    success_rate DECIMAL(5, 2) DEFAULT 0, -- Success percentage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table (פוסטים שפורסמו)
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    group_id INTEGER NOT NULL REFERENCES fb_groups(id) ON DELETE CASCADE,
    post_text TEXT NOT NULL,
    post_url VARCHAR(500),
    fb_post_id VARCHAR(200),
    scheduled_at TIMESTAMP,
    posted_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- pending, posted, failed, deleted
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads Table (לידים)
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    fb_user_id VARCHAR(100),
    fb_user_name VARCHAR(200),
    fb_profile_url VARCHAR(500),
    contact_type VARCHAR(50), -- comment, message, reaction
    message_text TEXT,
    sentiment VARCHAR(20), -- hot, warm, cold, negative
    score INTEGER DEFAULT 0, -- 0-100
    responded BOOLEAN DEFAULT false,
    response_text TEXT,
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, converted, lost
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Templates Table (תבניות תוכן)
CREATE TABLE IF NOT EXISTS content_templates (
    id SERIAL PRIMARY KEY,
    property_type VARCHAR(50),
    template_text TEXT NOT NULL,
    variables TEXT[], -- Array of variable names
    tone VARCHAR(50), -- אגרסיבי, מקצועי, ידידותי
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post Variations Table (ניסוחים שונים לפוסט)
CREATE TABLE IF NOT EXISTS post_variations (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    variation_text TEXT NOT NULL,
    used_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Logs Table (לוגים)
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20), -- info, warning, error, critical
    module VARCHAR(100), -- שם המודול
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Metrics Table (מדדי ביצועים)
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    posts_published INTEGER DEFAULT 0,
    posts_failed INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    total_shares INTEGER DEFAULT 0,
    leads_generated INTEGER DEFAULT 0,
    hot_leads INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

-- Account Rotation Table (ניהול חשבונות לרוטציה)
CREATE TABLE IF NOT EXISTS fb_accounts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(200) NOT NULL,
    name VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP,
    posts_today INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT false,
    blocked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_posts_property_id ON posts(property_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_property_id ON leads(property_id);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_performance_metrics_date ON performance_metrics(date);
