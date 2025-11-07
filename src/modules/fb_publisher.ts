/**
 * Facebook Publisher Module
 * מודול פרסום בפייסבוק - אחראי על פרסום אוטומטי של פוסטים בקבוצות
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { query } from '../config/database';
import { log } from '../utils/logger';
import { Post } from '../types';

export class FbPublisherModule {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isLoggedIn: boolean = false;

  /**
   * אתחול הדפדפן
   */
  async initialize(): Promise<void> {
    try {
      log.info('fb_publisher', 'Initializing browser');

      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      });

      this.page = await this.browser.newPage();

      // Set user agent
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Set viewport
      await this.page.setViewport({ width: 1280, height: 800 });

      log.info('fb_publisher', 'Browser initialized successfully');
    } catch (error) {
      log.error('fb_publisher', 'Failed to initialize browser', { error });
      throw error;
    }
  }

  /**
   * התחברות לפייסבוק
   */
  async login(): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('Browser not initialized');
      }

      log.info('fb_publisher', 'Logging in to Facebook');

      await this.page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2' });

      // Enter credentials
      await this.page.type('#email', process.env.FB_EMAIL || '');
      await this.page.type('#pass', process.env.FB_PASSWORD || '');

      // Click login button
      await this.page.click('[name="login"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });

      // Check if logged in
      const url = this.page.url();
      this.isLoggedIn = !url.includes('/login');

      if (this.isLoggedIn) {
        log.info('fb_publisher', 'Logged in successfully');
      } else {
        log.error('fb_publisher', 'Login failed');
      }

      return this.isLoggedIn;
    } catch (error) {
      log.error('fb_publisher', 'Login error', { error });
      return false;
    }
  }

  /**
   * פרסום פוסט לקבוצה
   */
  async publishPost(postId: number): Promise<boolean> {
    try {
      if (!this.page || !this.isLoggedIn) {
        throw new Error('Not logged in');
      }

      // Get post details
      const postResult = await query(
        `SELECT p.*, g.url as group_url, g.name as group_name
         FROM posts p
         JOIN fb_groups g ON p.group_id = g.id
         WHERE p.id = $1`,
        [postId]
      );

      if (postResult.rows.length === 0) {
        throw new Error('Post not found');
      }

      const post: Post = postResult.rows[0];
      const groupUrl = postResult.rows[0].group_url;

      log.info('fb_publisher', 'Publishing post', { postId, groupUrl });

      // Navigate to group
      await this.page.goto(groupUrl, { waitUntil: 'networkidle2' });
      await this.randomDelay(2000, 4000);

      // Find and click "Write something" box
      const postBoxSelector = '[role="button"][aria-label*="Write something"]';
      await this.page.waitForSelector(postBoxSelector, { timeout: 10000 });
      await this.page.click(postBoxSelector);
      await this.randomDelay(1000, 2000);

      // Type the post text
      const textAreaSelector = '[role="textbox"][contenteditable="true"]';
      await this.page.waitForSelector(textAreaSelector, { timeout: 10000 });
      await this.page.click(textAreaSelector);
      await this.humanLikeTyping(this.page, post.post_text);
      await this.randomDelay(2000, 3000);

      // Click Post button
      const postButtonSelector = '[aria-label*="Post"]';
      await this.page.click(postButtonSelector);
      await this.randomDelay(3000, 5000);

      // Update post status
      await query(
        `UPDATE posts
         SET status = 'posted', posted_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [postId]
      );

      // Update group last_posted_at
      await query(
        `UPDATE fb_groups SET last_posted_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [post.group_id]
      );

      log.info('fb_publisher', 'Post published successfully', { postId });
      return true;
    } catch (error) {
      log.error('fb_publisher', 'Failed to publish post', { error, postId });

      // Update post status to failed
      await query(
        `UPDATE posts
         SET status = 'failed', error_message = $1
         WHERE id = $2`,
        [error.message, postId]
      );

      return false;
    }
  }

  /**
   * הקלדה דמוית אדם
   */
  private async humanLikeTyping(page: Page, text: string): Promise<void> {
    for (const char of text) {
      await page.keyboard.type(char);
      await this.randomDelay(50, 150); // Random delay between keystrokes
    }
  }

  /**
   * השהייה אקראית
   */
  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * עיבוד תור פוסטים ממתינים
   */
  async processPendingPosts(): Promise<void> {
    try {
      // Check if auto posting is enabled
      if (process.env.ENABLE_AUTO_POSTING !== 'true') {
        log.info('fb_publisher', 'Auto posting is disabled');
        return;
      }

      // Initialize browser if needed
      if (!this.browser) {
        await this.initialize();
      }

      // Login if needed
      if (!this.isLoggedIn) {
        const loginSuccess = await this.login();
        if (!loginSuccess) {
          log.error('fb_publisher', 'Cannot process posts - login failed');
          return;
        }
      }

      // Get pending posts
      const result = await query(
        `SELECT id FROM posts
         WHERE status = 'pending'
         AND scheduled_at <= NOW()
         ORDER BY scheduled_at ASC
         LIMIT 5`
      );

      const posts = result.rows;

      if (posts.length === 0) {
        log.info('fb_publisher', 'No pending posts to publish');
        return;
      }

      log.info('fb_publisher', 'Processing pending posts', { count: posts.length });

      for (const post of posts) {
        await this.publishPost(post.id);
        // Wait between posts to avoid detection
        await this.randomDelay(60000, 120000); // 1-2 minutes
      }
    } catch (error) {
      log.error('fb_publisher', 'Failed to process pending posts', { error });
    }
  }

  /**
   * סגירת הדפדפן
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.isLoggedIn = false;
      log.info('fb_publisher', 'Browser closed');
    }
  }

  /**
   * צילום מסך לדיבאג
   */
  async takeScreenshot(filename: string): Promise<void> {
    if (this.page) {
      await this.page.screenshot({ path: `screenshots/${filename}.png` });
      log.info('fb_publisher', 'Screenshot taken', { filename });
    }
  }

  /**
   * קבלת סטטיסטיקות פרסום
   */
  async getPublishingStats(): Promise<any> {
    try {
      const result = await query(`
        SELECT
          DATE(posted_at) as date,
          COUNT(*) as total_published,
          COUNT(*) FILTER (WHERE status = 'posted') as successful,
          COUNT(*) FILTER (WHERE status = 'failed') as failed,
          AVG(EXTRACT(EPOCH FROM (posted_at - scheduled_at))) as avg_delay_seconds
        FROM posts
        WHERE posted_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(posted_at)
        ORDER BY date DESC
      `);

      return result.rows;
    } catch (error) {
      log.error('fb_publisher', 'Failed to get publishing stats', { error });
      throw error;
    }
  }
}

export default new FbPublisherModule();
