/**
 * Content Generator Module
 * מודול יצירת תוכן - אחראי על יצירת פוסטים מגוונים לפייסבוק
 */

import { query } from '../config/database';
import { log } from '../utils/logger';
import { Property, PostGenerationOptions, PostVariation } from '../types';

export class ContentGeneratorModule {
  private templates: Map<string, string[]> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  /**
   * אתחול תבניות בסיסיות
   */
  private initializeTemplates(): void {
    // תבניות לדירות
    this.templates.set('דירה', [
      '🏠 חדש בבלעדיות! דירת {rooms} חדרים ב{city}, {neighborhood}\\nמחיר: {price} ₪\\n{description}\\n\\n📞 להתעניינות - תגובה או הודעה פרטית!',
      '✨ מחפשים דירה ב{city}? אל תפספסו!\\n{rooms} חדרים | {area_sqm} מ״ר | {price} ₪\\n{description}\\n\\n💬 פרטים נוספים בהודעה פרטית!',
      '🔥 למכירה עכשיו! דירה מעולה ב{neighborhood}, {city}\\n{rooms} חדרים | {price} ₪\\n{description}\\n\\n📲 מעוניינים? שלחו הודעה!',
      '⭐ הזדמנות נדירה! דירה ב{city}\\nמפרט: {rooms} חדרים, {area_sqm} מ״ר\\nמחיר מעולה: {price} ₪\\n{description}\\n\\n✅ זמין לפינוי מיידי!',
      '🏡 חדש בשוק! דירת {rooms} חדרים מרווחת\\nמיקום: {neighborhood}, {city}\\n{price} ₪\\n{description}\\n\\n💡 למידע נוסף - תגיבו או שלחו הודעה!',
    ]);

    // תבניות לבתים פרטיים
    this.templates.set('בית פרטי', [
      '🏘️ בית פרטי מדהים ב{city}!\\n{area_sqm} מ״ר | {price} ₪\\n{description}\\n\\n📞 פרטים נוספים בהודעה!',
      '✨ בית חלומות ב{neighborhood}, {city}\\nשטח: {area_sqm} מ״ר\\nמחיר: {price} ₪\\n{description}\\n\\n💬 למעוניינים - צרו קשר!',
      '🌟 למכירה! בית פרטי מושקע ב{city}\\n{area_sqm} מ״ר בנוי\\n{price} ₪\\n{description}\\n\\n📲 להתעניינות - שלחו הודעה!',
      '🏡 הזדמנות נדירה! בית פרטי ב{neighborhood}\\n{area_sqm} מ״ר | {price} ₪\\n{description}\\n\\n✅ זמין לצפייה!',
    ]);

    // תבניות למגרשים
    this.templates.set('מגרש', [
      '🏗️ מגרש למכירה ב{city}!\\nשטח: {area_sqm} מ״ר\\nמחיר: {price} ₪\\n{description}\\n\\n📞 פרטים נוספים בפרטי!',
      '⭐ מגרש נהדר ב{neighborhood}, {city}\\n{area_sqm} מ״ר | {price} ₪\\n{description}\\n\\n💬 מעוניינים? צרו קשר!',
      '🌟 הזדמנות השקעה! מגרש ב{city}\\n{area_sqm} מ״ר\\n{price} ₪\\n{description}\\n\\n✅ מוכן לבנייה!',
    ]);

    // תבניות לנכסים מסחריים
    this.templates.set('נכס מסחרי', [
      '🏢 נכס מסחרי למכירה ב{city}!\\nשטח: {area_sqm} מ״ר\\nמחיר: {price} ₪\\n{description}\\n\\n📞 פרטים בהודעה פרטית!',
      '⭐ הזדמנות עסקית! נכס מסחרי ב{neighborhood}\\n{area_sqm} מ״ר | {price} ₪\\n{description}\\n\\n💬 למעוניינים - צרו קשר!',
    ]);
  }

  /**
   * יצירת וריאציות לנכס
   */
  async generateVariations(property: Property, count: number = 10): Promise<string[]> {
    try {
      log.info('content_generator', 'Generating variations', { propertyId: property.id, count });

      const variations: string[] = [];
      const templates = this.templates.get(property.property_type) || this.templates.get('דירה')!;

      // Check existing variations in DB
      const existingResult = await query(
        'SELECT variation_text FROM post_variations WHERE property_id = $1',
        [property.id]
      );
      const existingVariations = new Set(existingResult.rows.map((r) => r.variation_text));

      // Generate new variations
      for (let i = 0; i < count; i++) {
        const template = templates[i % templates.length];
        const variation = this.fillTemplate(template, property);

        // Avoid duplicates
        if (!existingVariations.has(variation)) {
          variations.push(variation);
        }
      }

      // Save variations to DB
      if (property.id) {
        for (const variation of variations) {
          await query(
            'INSERT INTO post_variations (property_id, variation_text) VALUES ($1, $2)',
            [property.id, variation]
          );
        }
      }

      log.info('content_generator', 'Variations generated', {
        propertyId: property.id,
        count: variations.length,
      });

      return variations;
    } catch (error) {
      log.error('content_generator', 'Failed to generate variations', { error, property });
      throw error;
    }
  }

  /**
   * מילוי תבנית עם נתוני נכס
   */
  private fillTemplate(template: string, property: Property): string {
    let text = template;

    // Replace placeholders
    text = text.replace(/{city}/g, property.city);
    text = text.replace(/{neighborhood}/g, property.neighborhood || property.city);
    text = text.replace(/{street}/g, property.street || '');
    text = text.replace(/{price}/g, this.formatPrice(property.price));
    text = text.replace(/{rooms}/g, property.rooms?.toString() || '');
    text = text.replace(/{area_sqm}/g, property.area_sqm?.toString() || '');
    text = text.replace(/{description}/g, this.truncateDescription(property.description || ''));

    return text;
  }

  /**
   * פורמט מחיר
   */
  private formatPrice(price: number): string {
    return new Intl.NumberFormat('he-IL').format(price);
  }

  /**
   * קיצור תיאור
   */
  private truncateDescription(description: string, maxLength: number = 100): string {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  }

  /**
   * קבלת וריאציה בשימוש נמוך
   */
  async getLeastUsedVariation(propertyId: number): Promise<string | null> {
    try {
      const result = await query(
        `SELECT variation_text FROM post_variations
         WHERE property_id = $1
         ORDER BY used_count ASC, RANDOM()
         LIMIT 1`,
        [propertyId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const variation = result.rows[0].variation_text;

      // Update usage count
      await query(
        `UPDATE post_variations
         SET used_count = used_count + 1, last_used_at = CURRENT_TIMESTAMP
         WHERE property_id = $1 AND variation_text = $2`,
        [propertyId, variation]
      );

      return variation;
    } catch (error) {
      log.error('content_generator', 'Failed to get least used variation', { error, propertyId });
      throw error;
    }
  }

  /**
   * יצירת פוסט מותאם אישית
   */
  async generateCustomPost(options: PostGenerationOptions): Promise<string> {
    try {
      const { property, tone, length, include_emoji, include_call_to_action } = options;

      let post = '';

      // Generate based on options
      const templates = this.templates.get(property.property_type) || this.templates.get('דירה')!;
      const template = templates[Math.floor(Math.random() * templates.length)];

      post = this.fillTemplate(template, property);

      // Add call to action if requested
      if (include_call_to_action) {
        post += '\\n\\n👉 מעוניינים? שלחו הודעה עכשיו!';
      }

      return post;
    } catch (error) {
      log.error('content_generator', 'Failed to generate custom post', { error, options });
      throw error;
    }
  }

  /**
   * ניתוח ביצועי תבניות
   */
  async analyzeTemplatePerformance(): Promise<any> {
    try {
      const result = await query(`
        SELECT
          pv.variation_text,
          COUNT(p.id) as usage_count,
          AVG(p.likes_count) as avg_likes,
          AVG(p.comments_count) as avg_comments
        FROM post_variations pv
        LEFT JOIN posts p ON p.post_text = pv.variation_text
        GROUP BY pv.variation_text
        ORDER BY avg_likes DESC
      `);

      return result.rows;
    } catch (error) {
      log.error('content_generator', 'Failed to analyze template performance', { error });
      throw error;
    }
  }
}

export default new ContentGeneratorModule();
