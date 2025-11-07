/**
 * Scheduler Module
 * מודול תזמון - אחראי על קביעת זמני פרסום חכמים ותורי פרסום
 */

import cron from 'node-cron';
import { query } from '../config/database';
import { log } from '../utils/logger';
import { Property, Post, FbGroup } from '../types';
import contentGenerator from './content_generator';

export class SchedulerModule {
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private readonly MAX_POSTS_PER_DAY: number;
  private readonly MIN_INTERVAL_MINUTES: number;

  constructor() {
    this.MAX_POSTS_PER_DAY = parseInt(process.env.MAX_POSTS_PER_DAY || '50');
    this.MIN_INTERVAL_MINUTES = parseInt(process.env.MIN_POST_INTERVAL_MINUTES || '15');
  }

  /**
   * התחלת מנוע התזמון
   */
  start(): void {
    log.info('scheduler', 'Starting scheduler module');

    // Schedule post creation every hour
    const createPostsTask = cron.schedule('0 * * * *', async () => {
      await this.createScheduledPosts();
    });

    this.tasks.set('create_posts', createPostsTask);

    // Schedule pending posts check every 5 minutes
    const publishTask = cron.schedule('*/5 * * * *', async () => {
      await this.processPendingPosts();
    });

    this.tasks.set('publish_posts', publishTask);

    // Daily performance report at 23:00
    const reportTask = cron.schedule('0 23 * * *', async () => {
      await this.generateDailyReport();
    });

    this.tasks.set('daily_report', reportTask);

    log.info('scheduler', 'Scheduler started successfully');
  }

  /**
   * יצירת פוסטים מתוזמנים
   */
  async createScheduledPosts(): Promise<void> {
    try {
      log.info('scheduler', 'Creating scheduled posts');

      // Get active properties
      const propertiesResult = await query(
        `SELECT * FROM properties WHERE status = 'active' ORDER BY priority DESC`
      );
      const properties: Property[] = propertiesResult.rows;

      if (properties.length === 0) {
        log.info('scheduler', 'No active properties to schedule');
        return;
      }

      // Get active groups
      const groupsResult = await query(
        `SELECT * FROM fb_groups WHERE is_active = true ORDER BY success_rate DESC`
      );
      const groups: FbGroup[] = groupsResult.rows;

      if (groups.length === 0) {
        log.info('scheduler', 'No active groups available');
        return;
      }

      // Calculate posts per property
      const postsPerProperty = Math.ceil(this.MAX_POSTS_PER_DAY / properties.length);

      for (const property of properties) {
        // Generate variations if needed
        const variationsResult = await query(
          'SELECT COUNT(*) as count FROM post_variations WHERE property_id = $1',
          [property.id]
        );

        if (variationsResult.rows[0].count < 10) {
          await contentGenerator.generateVariations(property, 10);
        }

        // Schedule posts for this property
        await this.schedulePropertyPosts(property, groups, postsPerProperty);
      }

      log.info('scheduler', 'Scheduled posts created successfully');
    } catch (error) {
      log.error('scheduler', 'Failed to create scheduled posts', { error });
    }
  }

  /**
   * תזמון פוסטים לנכס ספציפי
   */
  async schedulePropertyPosts(property: Property, groups: FbGroup[], count: number): Promise<void> {
    try {
      // Select groups that match property location
      const relevantGroups = this.selectRelevantGroups(property, groups);

      if (relevantGroups.length === 0) {
        log.warning('scheduler', 'No relevant groups for property', { propertyId: property.id });
        return;
      }

      // Calculate time slots for today
      const timeSlots = this.generateTimeSlots(count);

      for (let i = 0; i < count && i < relevantGroups.length; i++) {
        const group = relevantGroups[i];
        const scheduledTime = timeSlots[i];

        // Check if already posted to this group recently
        const recentPost = await query(
          `SELECT id FROM posts
           WHERE property_id = $1 AND group_id = $2
           AND posted_at > NOW() - INTERVAL '7 days'`,
          [property.id, group.id]
        );

        if (recentPost.rows.length > 0) {
          continue; // Skip if posted recently
        }

        // Get variation text
        const variationText = await contentGenerator.getLeastUsedVariation(property.id!);

        if (!variationText) {
          log.warning('scheduler', 'No variation available', { propertyId: property.id });
          continue;
        }

        // Create scheduled post
        await query(
          `INSERT INTO posts (property_id, group_id, post_text, scheduled_at, status)
           VALUES ($1, $2, $3, $4, $5)`,
          [property.id, group.id, variationText, scheduledTime, 'pending']
        );

        log.info('scheduler', 'Post scheduled', {
          propertyId: property.id,
          groupId: group.id,
          scheduledTime,
        });
      }
    } catch (error) {
      log.error('scheduler', 'Failed to schedule property posts', { error, propertyId: property.id });
    }
  }

  /**
   * בחירת קבוצות רלוונטיות לנכס
   */
  private selectRelevantGroups(property: Property, groups: FbGroup[]): FbGroup[] {
    return groups.filter((group) => {
      // Filter by target cities if specified
      if (group.target_cities && group.target_cities.length > 0) {
        return group.target_cities.includes(property.city);
      }
      return true;
    });
  }

  /**
   * יצירת חלונות זמן לפרסום
   */
  private generateTimeSlots(count: number): Date[] {
    const slots: Date[] = [];
    const now = new Date();
    const startHour = 8; // 08:00
    const endHour = 22; // 22:00

    for (let i = 0; i < count; i++) {
      const slotTime = new Date(now);
      slotTime.setHours(startHour + Math.floor(Math.random() * (endHour - startHour)));
      slotTime.setMinutes(Math.floor(Math.random() * 60));
      slotTime.setSeconds(0);

      // Add to next day if time has passed
      if (slotTime < now) {
        slotTime.setDate(slotTime.getDate() + 1);
      }

      slots.push(slotTime);
    }

    // Sort by time
    slots.sort((a, b) => a.getTime() - b.getTime());

    // Ensure minimum interval
    for (let i = 1; i < slots.length; i++) {
      const diff = slots[i].getTime() - slots[i - 1].getTime();
      const minDiff = this.MIN_INTERVAL_MINUTES * 60 * 1000;

      if (diff < minDiff) {
        slots[i] = new Date(slots[i - 1].getTime() + minDiff);
      }
    }

    return slots;
  }

  /**
   * עיבוד פוסטים ממתינים
   */
  async processPendingPosts(): Promise<void> {
    try {
      const result = await query(
        `SELECT * FROM posts
         WHERE status = 'pending'
         AND scheduled_at <= NOW()
         ORDER BY scheduled_at ASC
         LIMIT 10`
      );

      const posts: Post[] = result.rows;

      if (posts.length === 0) {
        return;
      }

      log.info('scheduler', 'Processing pending posts', { count: posts.length });

      // These posts will be picked up by fb_publisher module
      for (const post of posts) {
        log.info('scheduler', 'Post ready for publishing', { postId: post.id });
      }
    } catch (error) {
      log.error('scheduler', 'Failed to process pending posts', { error });
    }
  }

  /**
   * יצירת דוח יומי
   */
  async generateDailyReport(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Count today's posts
      const postsResult = await query(
        `SELECT
          COUNT(*) FILTER (WHERE status = 'posted') as published,
          COUNT(*) FILTER (WHERE status = 'failed') as failed,
          SUM(views_count) as total_views,
          SUM(likes_count) as total_likes,
          SUM(comments_count) as total_comments,
          SUM(shares_count) as total_shares
         FROM posts
         WHERE DATE(posted_at) = $1`,
        [today]
      );

      const stats = postsResult.rows[0];

      // Count leads
      const leadsResult = await query(
        `SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE sentiment = 'hot') as hot
         FROM leads
         WHERE DATE(created_at) = $1`,
        [today]
      );

      const leadStats = leadsResult.rows[0];

      // Save to performance_metrics
      await query(
        `INSERT INTO performance_metrics
         (date, posts_published, posts_failed, total_views, total_likes,
          total_comments, total_shares, leads_generated, hot_leads)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (date) DO UPDATE SET
         posts_published = $2, posts_failed = $3, total_views = $4,
         total_likes = $5, total_comments = $6, total_shares = $7,
         leads_generated = $8, hot_leads = $9`,
        [
          today,
          stats.published || 0,
          stats.failed || 0,
          stats.total_views || 0,
          stats.total_likes || 0,
          stats.total_comments || 0,
          stats.total_shares || 0,
          leadStats.total || 0,
          leadStats.hot || 0,
        ]
      );

      log.info('scheduler', 'Daily report generated', { today, stats, leadStats });
    } catch (error) {
      log.error('scheduler', 'Failed to generate daily report', { error });
    }
  }

  /**
   * עצירת המנוע
   */
  stop(): void {
    this.tasks.forEach((task, name) => {
      task.stop();
      log.info('scheduler', `Stopped task: ${name}`);
    });
    this.tasks.clear();
  }

  /**
   * קבלת סטטיסטיקות תזמון
   */
  async getScheduleStats(): Promise<any> {
    try {
      const result = await query(`
        SELECT
          DATE(scheduled_at) as date,
          COUNT(*) as total_scheduled,
          COUNT(*) FILTER (WHERE status = 'posted') as posted,
          COUNT(*) FILTER (WHERE status = 'pending') as pending,
          COUNT(*) FILTER (WHERE status = 'failed') as failed
        FROM posts
        WHERE scheduled_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(scheduled_at)
        ORDER BY date DESC
      `);

      return result.rows;
    } catch (error) {
      log.error('scheduler', 'Failed to get schedule stats', { error });
      throw error;
    }
  }
}

export default new SchedulerModule();
