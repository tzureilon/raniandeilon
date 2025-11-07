/**
 * Leads API Routes
 * נתיבי API לניהול לידים
 */

import express from 'express';
import fbListener from '../modules/fb_listener';
import { log } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/leads - קבלת כל הלידים
 */
router.get('/', async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const leads = await fbListener.getAllLeads(status);
    res.json({ success: true, data: leads });
  } catch (error: any) {
    log.error('api', 'Failed to get leads', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/leads/:id/status - עדכון סטטוס ליד
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    await fbListener.updateLeadStatus(parseInt(req.params.id), status);

    res.json({ success: true, message: 'Lead status updated successfully' });
  } catch (error: any) {
    log.error('api', 'Failed to update lead status', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/leads/:id/reply - שליחת תגובה לליד
 */
router.post('/:id/reply', async (req, res) => {
  try {
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ success: false, error: 'Reply text is required' });
    }

    const success = await fbListener.sendAutomatedReply(parseInt(req.params.id), replyText);

    res.json({ success, message: success ? 'Reply sent successfully' : 'Failed to send reply' });
  } catch (error: any) {
    log.error('api', 'Failed to send reply', { error });
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
