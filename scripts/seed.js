/**
 * Database Seed Script
 * סקריפט לטעינת נתוני דמו
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'propel_ai',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed sample Facebook groups
    console.log('📝 Seeding Facebook groups...');
    await pool.query(`
      INSERT INTO fb_groups (name, url, members_count, category, target_cities, is_active)
      VALUES
        ('נדל"ן נתניה', 'https://facebook.com/groups/netanya-realestate', 15000, 'כללי', ARRAY['נתניה'], true),
        ('דירות למכירה בשרון', 'https://facebook.com/groups/sharon-apartments', 8000, 'קונים', ARRAY['רעננה', 'הוד השרון', 'כפר סבא'], true),
        ('נדל"ן קדימה צורן', 'https://facebook.com/groups/kadima-realestate', 5000, 'כללי', ARRAY['קדימה צורן'], true),
        ('בתים פרטיים למכירה', 'https://facebook.com/groups/houses-for-sale', 12000, 'קונים', ARRAY['נתניה', 'רעננה', 'הרצליה'], true),
        ('נדל"ן אבן יהודה', 'https://facebook.com/groups/even-yehuda', 4000, 'כללי', ARRAY['אבן יהודה'], true)
      ON CONFLICT (url) DO NOTHING
    `);

    // Seed sample content templates
    console.log('📝 Seeding content templates...');
    await pool.query(`
      INSERT INTO content_templates (property_type, template_text, tone, is_active)
      VALUES
        ('דירה', '🏠 חדש! דירת {rooms} חדרים ב{city} במחיר מעולה!', 'אגרסיבי', true),
        ('דירה', '✨ דירה מושלמת ב{neighborhood} - {price} ₪', 'מקצועי', true),
        ('בית פרטי', '🏡 בית חלומות ב{city} - הזדמנות נדירה!', 'אגרסיבי', true),
        ('מגרש', '🏗️ מגרש מעולה לבנייה ב{city}', 'מקצועי', true)
      ON CONFLICT DO NOTHING
    `);

    // Seed sample property (optional)
    console.log('📝 Seeding sample property...');
    await pool.query(`
      INSERT INTO properties (property_type, city, neighborhood, price, rooms, area_sqm, description, status, priority)
      VALUES
        ('דירה', 'נתניה', 'קרית השרון', 1500000, 4, 100, 'דירה מרווחת ומוארת, משופצת לחלוטין', 'active', 7)
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Sample data inserted.');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
