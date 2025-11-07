/**
 * Facebook Listener Module
 * מודול האזנה לפייסבוק - אחראי על מעקב אחר תגובות והודעות
 */

import { Browser, Page } from 'puppeteer';
import { query } from '../config/database';
import { log } from '../utils/logger';
import { Lead } from '../types';
import alertSystem from './alert_system';

export class FbListenerModule {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * מעקב אחר תגובות לפוסטים
   */
  async monitorPostComments(postId: number): Promise<void> {
    try {
      // Get post details
      const postResult = await query(
        `SELECT post_url, fb_post_id FROM posts WHERE id = $1`,
        [postId]
      );

      if (postResult.rows.length === 0 || !postResult.rows[0].post_url) {
        log.warning('fb_listener', 'Post URL not found', { postId });
        return;
      }

      const postUrl = postResult.rows[0].post_url;

      log.info('fb_listener', 'Monitoring comments', { postId, postUrl });

      // In a real implementation, this would scrape the comments
      // For now, we'll simulate the process

      // TODO: Implement actual comment scraping with Puppeteer
      // This is a placeholder for the logic

      log.info('fb_listener', 'Comment monitoring completed', { postId });
    } catch (error) {
      log.error('fb_listener', 'Failed to monitor comments', { error, postId });
    }
  }

  /**
   * זיהוי תגובות מעניינות
   */
  async detectInterestedComments(): Promise<void> {
    try {
      // Keywords that indicate interest
      const interestedKeywords = [
        'מעוניין',
        'מעניין',
        'פרטים',
        'מחיר',
        'זמין',
        'אפשר',
        'רוצה',
        'לראות',
        'לבדוק',
        'נראה טוב',
        'נראה מעולה',
      ];

      // This is a simulated implementation
      // In production, this would scan actual Facebook comments

      log.info('fb_listener', 'Detecting interested comments');

      // TODO: Implement actual comment detection
      // For now, this is a placeholder

    } catch (error) {
      log.error('fb_listener', 'Failed to detect interested comments', { error });
    }
  }

  /**
   * שמירת ליד חדש
   */
  async saveLead(lead: Partial<Lead>): Promise<number> {
    try {
      const result = await query(
        `INSERT INTO leads
         (post_id, property_id, fb_user_id, fb_user_name, fb_profile_url,
          contact_type, message_text, sentiment, score, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          lead.post_id,
          lead.property_id,
          lead.fb_user_id,
          lead.fb_user_name,
          lead.fb_profile_url,
          lead.contact_type || 'comment',
          lead.message_text,
          lead.sentiment || 'warm',
          lead.score || 50,
          lead.status || 'new',
        ]
      );

      const leadId = result.rows[0].id;

      log.info('fb_listener', 'Lead saved', { leadId, fbUserName: lead.fb_user_name });

      // Send alert for hot leads
      if (lead.sentiment === 'hot') {
        await alertSystem.sendLeadAlert(leadId);
      }

      return leadId;
    } catch (error) {
      log.error('fb_listener', 'Failed to save lead', { error, lead });
      throw error;
    }
  }

  /**
   * ניתוח סנטימנט של תגובה
   */
  analyzeSentiment(text: string): { sentiment: 'hot' | 'warm' | 'cold' | 'negative'; score: number } {
    const lowerText = text.toLowerCase();

    // Hot keywords
    const hotKeywords = [
      'מעוניין',
      'רוצה',
      'קונה',
      'מתי אפשר',
      'איך ליצור קשר',
      'מחיר סופי',
      'מתאים לי',
    ];

    // Warm keywords
    const warmKeywords = [
      'פרטים',
      'מידע',
      'אפשר',
      'מעניין',
      'נראה',
      'לבדוק',
      'לראות',
    ];

    // Cold keywords
    const coldKeywords = ['תודה', 'אולי', 'חשבתי', 'לא בטוח'];

    // Negative keywords
    const negativeKeywords = ['לא', 'יקר', 'רחוק', 'לא מתאים', 'לא מעניין'];

    let score = 50; // Base score

    // Check for hot keywords
    for (const keyword of hotKeywords) {
      if (lowerText.includes(keyword)) {
        score += 20;
      }
    }

    // Check for warm keywords
    for (const keyword of warmKeywords) {
      if (lowerText.includes(keyword)) {
        score += 10;
      }
    }

    // Check for cold keywords
    for (const keyword of coldKeywords) {
      if (lowerText.includes(keyword)) {
        score -= 10;
      }
    }

    // Check for negative keywords
    for (const keyword of negativeKeywords) {
      if (lowerText.includes(keyword)) {
        score -= 20;
      }
    }

    // Determine sentiment
    let sentiment: 'hot' | 'warm' | 'cold' | 'negative';
    if (score >= 80) {
      sentiment = 'hot';
    } else if (score >= 50) {
      sentiment = 'warm';
    } else if (score >= 30) {
      sentiment = 'cold';
    } else {
      sentiment = 'negative';
    }

    return { sentiment, score: Math.max(0, Math.min(100, score)) };
  }

  /**
   * שליחת תגובה אוטומטית
   */
  async sendAutomatedReply(leadId: number, replyText: string): Promise<boolean> {
    try {
      // Update lead with response
      await query(
        `UPDATE leads
         SET responded = true, response_text = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [replyText, leadId]
      );

      log.info('fb_listener', 'Automated reply sent', { leadId });

      // TODO: Implement actual Facebook reply using Puppeteer
      // This is a placeholder

      return true;
    } catch (error) {
      log.error('fb_listener', 'Failed to send automated reply', { error, leadId });
      return false;
    }
  }

  /**
   * יצירת תגובה אוטומטית
   */
  generateAutoReply(sentiment: string): string {
    const replies = {
      hot: 'היי! תודה על ההתעניינות 🙂 הנכס עדיין זמין! אשמח לשלוח לך עוד פרטים ותמונות. אפשר לשלוח לי הודעה פרטית?',
      warm: 'שלום! אשמח לתת לך פרטים נוספים על הנכס. שלח/י לי הודעה פרטית ואחזור אליך מיד!',
      cold: 'תודה על ההתעניינות! במידה ותרצה/י עוד פרטים, אשמח לעזור. 📞',
    };

    return replies[sentiment as keyof typeof replies] || replies.warm;
  }

  /**
   * עדכון סטטיסטיקות פוסט
   */
  async updatePostStats(postId: number, stats: Partial<{ views: number; likes: number; comments: number; shares: number }>): Promise<void> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (stats.views !== undefined) {
        updates.push(`views_count = $${paramIndex++}`);
        values.push(stats.views);
      }
      if (stats.likes !== undefined) {
        updates.push(`likes_count = $${paramIndex++}`);
        values.push(stats.likes);
      }
      if (stats.comments !== undefined) {
        updates.push(`comments_count = $${paramIndex++}`);
        values.push(stats.comments);
      }
      if (stats.shares !== undefined) {
        updates.push(`shares_count = $${paramIndex++}`);
        values.push(stats.shares);
      }

      if (updates.length > 0) {
        values.push(postId);
        await query(
          `UPDATE posts SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
          values
        );

        log.info('fb_listener', 'Post stats updated', { postId, stats });
      }
    } catch (error) {
      log.error('fb_listener', 'Failed to update post stats', { error, postId, stats });
    }
  }

  /**
   * קבלת כל הלידים
   */
  async getAllLeads(status?: string): Promise<Lead[]> {
    try {
      let queryText = 'SELECT * FROM leads';
      const params: any[] = [];

      if (status) {
        queryText += ' WHERE status = $1';
        params.push(status);
      }

      queryText += ' ORDER BY created_at DESC';

      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      log.error('fb_listener', 'Failed to get leads', { error });
      throw error;
    }
  }

  /**
   * עדכון סטטוס ליד
   */
  async updateLeadStatus(leadId: number, status: string): Promise<void> {
    try {
      await query(
        `UPDATE leads SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [status, leadId]
      );
      log.info('fb_listener', 'Lead status updated', { leadId, status });
    } catch (error) {
      log.error('fb_listener', 'Failed to update lead status', { error, leadId, status });
      throw error;
    }
  }
}

export default new FbListenerModule();
