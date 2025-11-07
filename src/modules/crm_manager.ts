/**
 * CRM Manager Module
 * מודול ניהול קשרי לקוחות - אחראי על ניהול לידים, מעקב והפקת דוחות
 */

import { query } from '../config/database';
import { log } from '../utils/logger';
import { Lead, DashboardStats } from '../types';

export class CrmManagerModule {
  /**
   * קבלת סטטיסטיקות כלליות לדשבורד
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Total properties
      const propertiesResult = await query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'active') as active
        FROM properties
      `);

      // Today's posts
      const postsResult = await query(`
        SELECT COUNT(*) as total
        FROM posts
        WHERE DATE(posted_at) = CURRENT_DATE
        AND status = 'posted'
      `);

      // Today's leads
      const leadsResult = await query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE sentiment = 'hot') as hot
        FROM leads
        WHERE DATE(created_at) = CURRENT_DATE
      `);

      // Pending posts
      const pendingResult = await query(`
        SELECT COUNT(*) as total
        FROM posts
        WHERE status = 'pending'
      `);

      // Active groups
      const groupsResult = await query(`
        SELECT COUNT(*) as total
        FROM fb_groups
        WHERE is_active = true
      `);

      const stats: DashboardStats = {
        total_properties: parseInt(propertiesResult.rows[0].total),
        active_properties: parseInt(propertiesResult.rows[0].active),
        total_posts_today: parseInt(postsResult.rows[0].total),
        total_leads_today: parseInt(leadsResult.rows[0].total),
        hot_leads_today: parseInt(leadsResult.rows[0].hot),
        pending_posts: parseInt(pendingResult.rows[0].total),
        active_groups: parseInt(groupsResult.rows[0].total),
      };

      return stats;
    } catch (error) {
      log.error('crm_manager', 'Failed to get dashboard stats', { error });
      throw error;
    }
  }

  /**
   * קבלת לידים חמים
   */
  async getHotLeads(limit: number = 20): Promise<Lead[]> {
    try {
      const result = await query(
        `SELECT l.*, p.city, p.property_type, p.price
         FROM leads l
         LEFT JOIN properties p ON l.property_id = p.id
         WHERE l.sentiment = 'hot'
         AND l.status IN ('new', 'contacted')
         ORDER BY l.created_at DESC
         LIMIT $1`,
        [limit]
      );

      return result.rows;
    } catch (error) {
      log.error('crm_manager', 'Failed to get hot leads', { error });
      throw error;
    }
  }

  /**
   * קבלת ביצועי קבוצות
   */
  async getGroupPerformance(): Promise<any[]> {
    try {
      const result = await query(`
        SELECT
          g.id,
          g.name,
          g.members_count,
          g.category,
          COUNT(DISTINCT p.id) as total_posts,
          SUM(p.likes_count) as total_likes,
          SUM(p.comments_count) as total_comments,
          COUNT(DISTINCT l.id) as total_leads,
          ROUND(AVG(p.likes_count), 2) as avg_likes_per_post
        FROM fb_groups g
        LEFT JOIN posts p ON p.group_id = g.id AND p.status = 'posted'
        LEFT JOIN leads l ON l.post_id = p.id
        WHERE g.is_active = true
        GROUP BY g.id
        ORDER BY total_leads DESC, avg_likes_per_post DESC
        LIMIT 20
      `);

      return result.rows;
    } catch (error) {
      log.error('crm_manager', 'Failed to get group performance', { error });
      throw error;
    }
  }

  /**
   * קבלת ביצועי נכסים
   */
  async getPropertyPerformance(): Promise<any[]> {
    try {
      const result = await query(`
        SELECT
          p.id,
          p.property_type,
          p.city,
          p.neighborhood,
          p.price,
          COUNT(DISTINCT po.id) as total_posts,
          SUM(po.views_count) as total_views,
          SUM(po.likes_count) as total_likes,
          SUM(po.comments_count) as total_comments,
          COUNT(DISTINCT l.id) as total_leads,
          COUNT(DISTINCT CASE WHEN l.sentiment = 'hot' THEN l.id END) as hot_leads
        FROM properties p
        LEFT JOIN posts po ON po.property_id = p.id
        LEFT JOIN leads l ON l.property_id = p.id
        WHERE p.status = 'active'
        GROUP BY p.id
        ORDER BY hot_leads DESC, total_leads DESC
        LIMIT 20
      `);

      return result.rows;
    } catch (error) {
      log.error('crm_manager', 'Failed to get property performance', { error });
      throw error;
    }
  }

  /**
   * דוח ביצועים שבועי
   */
  async getWeeklyReport(): Promise<any> {
    try {
      const result = await query(`
        SELECT
          date,
          posts_published,
          posts_failed,
          total_views,
          total_likes,
          total_comments,
          total_shares,
          leads_generated,
          hot_leads
        FROM performance_metrics
        WHERE date >= CURRENT_DATE - INTERVAL '7 days'
        ORDER BY date DESC
      `);

      const totals = await query(`
        SELECT
          SUM(posts_published) as total_posts,
          SUM(posts_failed) as total_failed,
          SUM(total_views) as total_views,
          SUM(total_likes) as total_likes,
          SUM(total_comments) as total_comments,
          SUM(leads_generated) as total_leads,
          SUM(hot_leads) as total_hot_leads
        FROM performance_metrics
        WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      `);

      return {
        daily: result.rows,
        totals: totals.rows[0],
      };
    } catch (error) {
      log.error('crm_manager', 'Failed to get weekly report', { error });
      throw error;
    }
  }

  /**
   * עדכון עדיפות נכס לפי ביצועים
   */
  async updatePropertyPriorities(): Promise<void> {
    try {
      log.info('crm_manager', 'Updating property priorities based on performance');

      // Get performance scores
      const result = await query(`
        SELECT
          p.id,
          COUNT(DISTINCT l.id) as lead_count,
          COUNT(DISTINCT CASE WHEN l.sentiment = 'hot' THEN l.id END) as hot_lead_count,
          SUM(po.likes_count) as total_likes
        FROM properties p
        LEFT JOIN posts po ON po.property_id = p.id
        LEFT JOIN leads l ON l.property_id = p.id
        WHERE p.status = 'active'
        GROUP BY p.id
      `);

      for (const row of result.rows) {
        // Calculate priority score (1-10)
        let priority = 5; // Base priority

        // Add points for hot leads (2 points per hot lead, max 3 points)
        priority += Math.min(3, row.hot_lead_count * 2);

        // Add points for regular leads (0.5 points per lead, max 2 points)
        priority += Math.min(2, row.lead_count * 0.5);

        // Add points for likes (0.01 per like, max 1 point)
        priority += Math.min(1, (row.total_likes || 0) * 0.01);

        // Cap at 10
        priority = Math.min(10, Math.max(1, Math.round(priority)));

        // Update property priority
        await query('UPDATE properties SET priority = $1 WHERE id = $2', [priority, row.id]);
      }

      log.info('crm_manager', 'Property priorities updated successfully');
    } catch (error) {
      log.error('crm_manager', 'Failed to update property priorities', { error });
    }
  }

  /**
   * זיהוי קבוצות חלשות
   */
  async identifyUnderperformingGroups(): Promise<any[]> {
    try {
      const result = await query(`
        SELECT
          g.id,
          g.name,
          g.url,
          COUNT(p.id) as post_count,
          AVG(p.likes_count) as avg_likes,
          AVG(p.comments_count) as avg_comments,
          COUNT(l.id) as lead_count
        FROM fb_groups g
        LEFT JOIN posts p ON p.group_id = g.id AND p.posted_at >= NOW() - INTERVAL '30 days'
        LEFT JOIN leads l ON l.post_id = p.id
        WHERE g.is_active = true
        GROUP BY g.id
        HAVING COUNT(p.id) > 5 AND (AVG(p.likes_count) < 2 OR COUNT(l.id) = 0)
        ORDER BY lead_count ASC, avg_likes ASC
      `);

      if (result.rows.length > 0) {
        log.warning('crm_manager', 'Underperforming groups identified', {
          count: result.rows.length,
        });
      }

      return result.rows;
    } catch (error) {
      log.error('crm_manager', 'Failed to identify underperforming groups', { error });
      throw error;
    }
  }

  /**
   * ניקוי לידים ישנים
   */
  async cleanupOldLeads(daysOld: number = 90): Promise<number> {
    try {
      const result = await query(
        `DELETE FROM leads
         WHERE created_at < NOW() - INTERVAL '${daysOld} days'
         AND status IN ('cold', 'negative', 'lost')
         RETURNING id`
      );

      const deletedCount = result.rows.length;

      log.info('crm_manager', 'Old leads cleaned up', { deletedCount, daysOld });

      return deletedCount;
    } catch (error) {
      log.error('crm_manager', 'Failed to cleanup old leads', { error });
      throw error;
    }
  }

  /**
   * ניתוח מגמות
   */
  async analyzeTrends(): Promise<any> {
    try {
      const result = await query(`
        WITH daily_stats AS (
          SELECT
            DATE(created_at) as date,
            COUNT(*) as lead_count,
            COUNT(*) FILTER (WHERE sentiment = 'hot') as hot_count
          FROM leads
          WHERE created_at >= NOW() - INTERVAL '30 days'
          GROUP BY DATE(created_at)
          ORDER BY date
        )
        SELECT
          date,
          lead_count,
          hot_count,
          LAG(lead_count) OVER (ORDER BY date) as prev_day_leads,
          ROUND(
            (lead_count - LAG(lead_count) OVER (ORDER BY date))::numeric /
            NULLIF(LAG(lead_count) OVER (ORDER BY date), 0) * 100,
            2
          ) as growth_rate
        FROM daily_stats
      `);

      return result.rows;
    } catch (error) {
      log.error('crm_manager', 'Failed to analyze trends', { error });
      throw error;
    }
  }

  /**
   * המלצות לשיפור
   */
  async getRecommendations(): Promise<string[]> {
    try {
      const recommendations: string[] = [];

      // Check underperforming properties
      const weakProperties = await query(`
        SELECT COUNT(*) as count
        FROM properties p
        LEFT JOIN posts po ON po.property_id = p.id
        WHERE p.status = 'active'
        GROUP BY p.id
        HAVING COUNT(po.id) > 10 AND SUM(po.likes_count) < 10
      `);

      if (parseInt(weakProperties.rows[0]?.count || '0') > 0) {
        recommendations.push('📉 יש נכסים עם ביצועים חלשים - שקול לשנות את הניסוחים או התמונות');
      }

      // Check posting frequency
      const todayPosts = await query(`
        SELECT COUNT(*) as count
        FROM posts
        WHERE DATE(posted_at) = CURRENT_DATE
      `);

      if (parseInt(todayPosts.rows[0].count) < 10) {
        recommendations.push('⚡ תדירות הפרסום נמוכה - שקול להגדיל את מספר הפרסומים היומיים');
      }

      // Check response rate
      const responseRate = await query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE responded = true) as responded
        FROM leads
        WHERE created_at >= NOW() - INTERVAL '7 days'
      `);

      const rate = parseInt(responseRate.rows[0].responded) / parseInt(responseRate.rows[0].total) * 100;
      if (rate < 50) {
        recommendations.push('💬 אחוז התגובות ללידים נמוך - שקול לשפר את התגובות האוטומטיות');
      }

      return recommendations;
    } catch (error) {
      log.error('crm_manager', 'Failed to get recommendations', { error });
      return [];
    }
  }
}

export default new CrmManagerModule();
