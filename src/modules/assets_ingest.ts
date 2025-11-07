/**
 * Assets Ingest Module
 * מודול קליטת נכסים - אחראי על הוספה, עדכון ומחיקת נכסים
 */

import { query } from '../config/database';
import { log } from '../utils/logger';
import { Property, PropertyImage } from '../types';

export class AssetsIngestModule {
  /**
   * הוספת נכס חדש
   */
  async addProperty(property: Property, images?: string[]): Promise<number> {
    try {
      log.info('assets_ingest', 'Adding new property', { property });

      // Validate required fields
      this.validateProperty(property);

      // Insert property
      const result = await query(
        `INSERT INTO properties
         (property_type, city, neighborhood, street, price, rooms, area_sqm,
          description, status, available_from, website_url, priority)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [
          property.property_type,
          property.city,
          property.neighborhood,
          property.street,
          property.price,
          property.rooms,
          property.area_sqm,
          property.description,
          property.status || 'active',
          property.available_from,
          property.website_url,
          property.priority || 5,
        ]
      );

      const propertyId = result.rows[0].id;

      // Add images if provided
      if (images && images.length > 0) {
        await this.addPropertyImages(propertyId, images);
      }

      log.info('assets_ingest', 'Property added successfully', { propertyId });
      return propertyId;
    } catch (error) {
      log.error('assets_ingest', 'Failed to add property', { error, property });
      throw error;
    }
  }

  /**
   * הוספת תמונות לנכס
   */
  async addPropertyImages(propertyId: number, imageUrls: string[]): Promise<void> {
    try {
      for (let i = 0; i < imageUrls.length; i++) {
        await query(
          `INSERT INTO property_images (property_id, image_url, is_primary, display_order)
           VALUES ($1, $2, $3, $4)`,
          [propertyId, imageUrls[i], i === 0, i]
        );
      }
      log.info('assets_ingest', 'Images added to property', { propertyId, count: imageUrls.length });
    } catch (error) {
      log.error('assets_ingest', 'Failed to add property images', { error, propertyId });
      throw error;
    }
  }

  /**
   * עדכון נכס קיים
   */
  async updateProperty(id: number, updates: Partial<Property>): Promise<void> {
    try {
      const fields = Object.keys(updates);
      const values = Object.values(updates);

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

      await query(
        `UPDATE properties SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id, ...values]
      );

      log.info('assets_ingest', 'Property updated', { id, updates });
    } catch (error) {
      log.error('assets_ingest', 'Failed to update property', { error, id, updates });
      throw error;
    }
  }

  /**
   * שינוי סטטוס נכס
   */
  async updatePropertyStatus(id: number, status: 'active' | 'sold' | 'rented' | 'inactive'): Promise<void> {
    try {
      await query(
        `UPDATE properties SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [status, id]
      );
      log.info('assets_ingest', 'Property status updated', { id, status });
    } catch (error) {
      log.error('assets_ingest', 'Failed to update property status', { error, id, status });
      throw error;
    }
  }

  /**
   * קבלת נכס לפי ID
   */
  async getProperty(id: number): Promise<Property | null> {
    try {
      const result = await query('SELECT * FROM properties WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      log.error('assets_ingest', 'Failed to get property', { error, id });
      throw error;
    }
  }

  /**
   * קבלת כל הנכסים הפעילים
   */
  async getActiveProperties(): Promise<Property[]> {
    try {
      const result = await query(
        'SELECT * FROM properties WHERE status = $1 ORDER BY priority DESC, created_at DESC',
        ['active']
      );
      return result.rows;
    } catch (error) {
      log.error('assets_ingest', 'Failed to get active properties', { error });
      throw error;
    }
  }

  /**
   * קבלת תמונות נכס
   */
  async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    try {
      const result = await query(
        'SELECT * FROM property_images WHERE property_id = $1 ORDER BY display_order',
        [propertyId]
      );
      return result.rows;
    } catch (error) {
      log.error('assets_ingest', 'Failed to get property images', { error, propertyId });
      throw error;
    }
  }

  /**
   * מחיקת נכס
   */
  async deleteProperty(id: number): Promise<void> {
    try {
      await query('DELETE FROM properties WHERE id = $1', [id]);
      log.info('assets_ingest', 'Property deleted', { id });
    } catch (error) {
      log.error('assets_ingest', 'Failed to delete property', { error, id });
      throw error;
    }
  }

  /**
   * ולידציה לנכס
   */
  private validateProperty(property: Property): void {
    if (!property.property_type) {
      throw new Error('Property type is required');
    }
    if (!property.city) {
      throw new Error('City is required');
    }
    if (!property.price || property.price <= 0) {
      throw new Error('Valid price is required');
    }
  }

  /**
   * קבלת סטטיסטיקות נכסים
   */
  async getPropertyStats(): Promise<any> {
    try {
      const result = await query(`
        SELECT
          status,
          COUNT(*) as count,
          AVG(price) as avg_price
        FROM properties
        GROUP BY status
      `);
      return result.rows;
    } catch (error) {
      log.error('assets_ingest', 'Failed to get property stats', { error });
      throw error;
    }
  }
}

export default new AssetsIngestModule();
