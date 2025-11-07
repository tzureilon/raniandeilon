/**
 * Dashboard API Routes
 * נתיבי API לדשבורד ודוחות
 */

import express from 'express';
import crmManager from '../modules/crm_manager';
import scheduler from '../modules/scheduler';
import { log } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/dashboard/stats - סטטיסטיקות כלליות
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await crmManager.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    log.error('api', 'Failed to get dashboard stats', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/dashboard/hot-leads - לידים חמים
 */
router.get('/hot-leads', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const leads = await crmManager.getHotLeads(limit);
    res.json({ success: true, data: leads });
  } catch (error: any) {
    log.error('api', 'Failed to get hot leads', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/dashboard/group-performance - ביצועי קבוצות
 */
router.get('/group-performance', async (req, res) => {
  try {
    const performance = await crmManager.getGroupPerformance();
    res.json({ success: true, data: performance });
  } catch (error: any) {
    log.error('api', 'Failed to get group performance', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/dashboard/property-performance - ביצועי נכסים
 */
router.get('/property-performance', async (req, res) => {
  try {
    const performance = await crmManager.getPropertyPerformance();
    res.json({ success: true, data: performance });
  } catch (error: any) {
    log.error('api', 'Failed to get property performance', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/dashboard/weekly-report - דוח שבועי
 */
router.get('/weekly-report', async (req, res) => {
  try {
    const report = await crmManager.getWeeklyReport();
    res.json({ success: true, data: report });
  } catch (error: any) {
    log.error('api', 'Failed to get weekly report', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/dashboard/recommendations - המלצות לשיפור
 */
router.get('/recommendations', async (req, res) => {
  try {
    const recommendations = await crmManager.getRecommendations();
    res.json({ success: true, data: recommendations });
  } catch (error: any) {
    log.error('api', 'Failed to get recommendations', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/dashboard/schedule-stats - סטטיסטיקות תזמון
 */
router.get('/schedule-stats', async (req, res) => {
  try {
    const stats = await scheduler.getScheduleStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    log.error('api', 'Failed to get schedule stats', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/dashboard/trends - ניתוח מגמות
 */
router.get('/trends', async (req, res) => {
  try {
    const trends = await crmManager.analyzeTrends();
    res.json({ success: true, data: trends });
  } catch (error: any) {
    log.error('api', 'Failed to analyze trends', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
