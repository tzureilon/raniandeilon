/**
 * Properties API Routes
 * נתיבי API לניהול נכסים
 */

import express from 'express';
import assetsIngest from '../modules/assets_ingest';
import contentGenerator from '../modules/content_generator';
import { log } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/properties - קבלת כל הנכסים
 */
router.get('/', async (req, res) => {
  try {
    const properties = await assetsIngest.getActiveProperties();
    res.json({ success: true, data: properties });
  } catch (error: any) {
    log.error('api', 'Failed to get properties', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/properties/:id - קבלת נכס לפי ID
 */
router.get('/:id', async (req, res) => {
  try {
    const property = await assetsIngest.getProperty(parseInt(req.params.id));
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const images = await assetsIngest.getPropertyImages(parseInt(req.params.id));

    res.json({ success: true, data: { ...property, images } });
  } catch (error: any) {
    log.error('api', 'Failed to get property', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/properties - הוספת נכס חדש
 */
router.post('/', async (req, res) => {
  try {
    const { property, images } = req.body;

    if (!property) {
      return res.status(400).json({ success: false, error: 'Property data is required' });
    }

    const propertyId = await assetsIngest.addProperty(property, images);

    // Generate content variations
    const propertyData = await assetsIngest.getProperty(propertyId);
    if (propertyData) {
      await contentGenerator.generateVariations(propertyData, 10);
    }

    res.status(201).json({ success: true, data: { id: propertyId } });
  } catch (error: any) {
    log.error('api', 'Failed to add property', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/properties/:id - עדכון נכס
 */
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    await assetsIngest.updateProperty(parseInt(req.params.id), updates);

    res.json({ success: true, message: 'Property updated successfully' });
  } catch (error: any) {
    log.error('api', 'Failed to update property', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/properties/:id/status - שינוי סטטוס נכס
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    await assetsIngest.updatePropertyStatus(parseInt(req.params.id), status);

    res.json({ success: true, message: 'Property status updated successfully' });
  } catch (error: any) {
    log.error('api', 'Failed to update property status', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/properties/:id - מחיקת נכס
 */
router.delete('/:id', async (req, res) => {
  try {
    await assetsIngest.deleteProperty(parseInt(req.params.id));

    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error: any) {
    log.error('api', 'Failed to delete property', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/properties/stats/overview - סטטיסטיקות נכסים
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await assetsIngest.getPropertyStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    log.error('api', 'Failed to get property stats', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
