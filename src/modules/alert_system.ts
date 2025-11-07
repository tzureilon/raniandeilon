/**
 * Alert System Module
 * מודול התראות - אחראי על שליחת התראות דרך טלגרם ואימייל
 */

import axios from 'axios';
import { query } from '../config/database';
import { log } from '../utils/logger';
import { Lead } from '../types';

export class AlertSystemModule {
  private readonly botToken: string;
  private readonly chatId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
  }

  /**
   * שליחת הודעה בטלגרם
   */
  async sendTelegramMessage(message: string): Promise<boolean> {
    try {
      if (!this.botToken || !this.chatId) {
        log.warning('alert_system', 'Telegram credentials not configured');
        return false;
      }

      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

      await axios.post(url, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
      });

      log.info('alert_system', 'Telegram message sent successfully');
      return true;
    } catch (error) {
      log.error('alert_system', 'Failed to send Telegram message', { error });
      return false;
    }
  }

  /**
   * התראה על ליד חם
   */
  async sendLeadAlert(leadId: number): Promise<void> {
    try {
      // Get lead details
      const result = await query(
        `SELECT l.*, p.city, p.neighborhood, p.property_type, p.price, po.post_url
         FROM leads l
         LEFT JOIN properties p ON l.property_id = p.id
         LEFT JOIN posts po ON l.post_id = po.id
         WHERE l.id = $1`,
        [leadId]
      );

      if (result.rows.length === 0) {
        return;
      }

      const lead = result.rows[0];

      const message = `
🔥 <b>ליד חם חדש!</b> 🔥

👤 <b>שם:</b> ${lead.fb_user_name || 'לא ידוע'}
📱 <b>פרופיל:</b> ${lead.fb_profile_url || 'לא זמין'}

🏠 <b>נכס:</b> ${lead.property_type || 'לא ידוע'}
📍 <b>מיקום:</b> ${lead.city || 'לא ידוע'}, ${lead.neighborhood || ''}
💰 <b>מחיר:</b> ${lead.price ? this.formatPrice(lead.price) : 'לא ידוע'} ₪

💬 <b>תגובה:</b> ${lead.message_text || 'לא זמינה'}

🎯 <b>ציון:</b> ${lead.score || 0}/100

${lead.post_url ? `🔗 <a href="${lead.post_url}">קישור לפוסט</a>` : ''}

⚡ <b>פעולה מומלצת:</b> צור קשר בהקדם!
`;

      await this.sendTelegramMessage(message);

      log.info('alert_system', 'Lead alert sent', { leadId });
    } catch (error) {
      log.error('alert_system', 'Failed to send lead alert', { error, leadId });
    }
  }

  /**
   * התראה על שגיאה קריטית
   */
  async sendErrorAlert(module: string, errorMessage: string): Promise<void> {
    try {
      const message = `
❌ <b>שגיאה קריטית במערכת</b>

📦 <b>מודול:</b> ${module}
⚠️ <b>שגיאה:</b> ${errorMessage}
🕐 <b>זמן:</b> ${new Date().toLocaleString('he-IL')}

נא לבדוק את המערכת בהקדם.
`;

      await this.sendTelegramMessage(message);
    } catch (error) {
      log.error('alert_system', 'Failed to send error alert', { error });
    }
  }

  /**
   * דוח יומי
   */
  async sendDailyReport(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get today's stats
      const statsResult = await query(
        `SELECT * FROM performance_metrics WHERE date = $1`,
        [today]
      );

      if (statsResult.rows.length === 0) {
        log.info('alert_system', 'No stats available for daily report');
        return;
      }

      const stats = statsResult.rows[0];

      // Get top performing groups
      const topGroups = await query(`
        SELECT g.name, COUNT(p.id) as post_count, SUM(p.likes_count) as total_likes
        FROM fb_groups g
        JOIN posts p ON p.group_id = g.id
        WHERE DATE(p.posted_at) = $1
        GROUP BY g.id
        ORDER BY total_likes DESC
        LIMIT 3
      `, [today]);

      let topGroupsText = '';
      if (topGroups.rows.length > 0) {
        topGroupsText = topGroups.rows
          .map((g, i) => `${i + 1}. ${g.name} - ${g.total_likes} לייקים`)
          .join('\n');
      }

      const message = `
📊 <b>דוח יומי - Propel.AI</b>
📅 ${new Date().toLocaleDateString('he-IL')}

━━━━━━━━━━━━━━━━━━━━

📢 <b>פרסומים:</b>
✅ פורסמו: ${stats.posts_published || 0}
❌ נכשלו: ${stats.posts_failed || 0}

👀 <b>חשיפה:</b>
צפיות: ${stats.total_views || 0}
לייקים: ${stats.total_likes || 0}
תגובות: ${stats.total_comments || 0}
שיתופים: ${stats.total_shares || 0}

🎯 <b>לידים:</b>
סה"כ: ${stats.leads_generated || 0}
🔥 חמים: ${stats.hot_leads || 0}

${topGroupsText ? `\n🏆 <b>קבוצות מובילות:</b>\n${topGroupsText}` : ''}

━━━━━━━━━━━━━━━━━━━━

✨ <b>המערכת פועלת בהצלחה!</b>
`;

      await this.sendTelegramMessage(message);

      log.info('alert_system', 'Daily report sent');
    } catch (error) {
      log.error('alert_system', 'Failed to send daily report', { error });
    }
  }

  /**
   * התראה על נכס חדש
   */
  async sendNewPropertyAlert(propertyId: number): Promise<void> {
    try {
      const result = await query('SELECT * FROM properties WHERE id = $1', [propertyId]);

      if (result.rows.length === 0) {
        return;
      }

      const property = result.rows[0];

      const message = `
✨ <b>נכס חדש נוסף למערכת!</b>

🏠 <b>סוג:</b> ${property.property_type}
📍 <b>מיקום:</b> ${property.city}, ${property.neighborhood || ''}
💰 <b>מחיר:</b> ${this.formatPrice(property.price)} ₪
📏 <b>שטח/חדרים:</b> ${property.area_sqm ? property.area_sqm + ' מ"ר' : ''} ${property.rooms ? property.rooms + ' חדרים' : ''}

📝 <b>תיאור:</b>
${property.description || 'אין תיאור'}

🚀 המערכת תתחיל לשווק את הנכס בקרוב!
`;

      await this.sendTelegramMessage(message);

      log.info('alert_system', 'New property alert sent', { propertyId });
    } catch (error) {
      log.error('alert_system', 'Failed to send new property alert', { error, propertyId });
    }
  }

  /**
   * התראה על הישג
   */
  async sendMilestoneAlert(milestone: string, value: number): Promise<void> {
    try {
      const emojis: { [key: string]: string } = {
        posts: '📢',
        leads: '🎯',
        hot_leads: '🔥',
        likes: '👍',
      };

      const message = `
🎉 <b>הישג חדש!</b>

${emojis[milestone] || '⭐'} <b>${this.getMilestoneText(milestone)}</b>

הגענו ל-<b>${value}</b> ${milestone}!

המשיכו כך! 💪
`;

      await this.sendTelegramMessage(message);

      log.info('alert_system', 'Milestone alert sent', { milestone, value });
    } catch (error) {
      log.error('alert_system', 'Failed to send milestone alert', { error });
    }
  }

  /**
   * פורמט מחיר
   */
  private formatPrice(price: number): string {
    return new Intl.NumberFormat('he-IL').format(price);
  }

  /**
   * טקסט להישג
   */
  private getMilestoneText(milestone: string): string {
    const texts: { [key: string]: string } = {
      posts: 'פרסומים',
      leads: 'לידים',
      hot_leads: 'לידים חמים',
      likes: 'לייקים',
    };

    return texts[milestone] || milestone;
  }

  /**
   * שליחת התראה כללית
   */
  async sendAlert(title: string, message: string): Promise<void> {
    try {
      const fullMessage = `
<b>${title}</b>

${message}

⏰ ${new Date().toLocaleString('he-IL')}
`;

      await this.sendTelegramMessage(fullMessage);
    } catch (error) {
      log.error('alert_system', 'Failed to send alert', { error });
    }
  }
}

export default new AlertSystemModule();
