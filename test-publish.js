/**
 * Manual Post Publishing Test
 * הפעלת פרסום ידנית לבדיקה
 */

require('dotenv').config();
const fbPublisher = require('./dist/modules/fb_publisher').default;

async function testPublishing() {
  console.log('🚀 מתחיל בדיקת פרסום ידנית...\n');

  try {
    // Check configuration
    console.log('📋 בדיקת הגדרות:');
    console.log(`   FB_EMAIL: ${process.env.FB_EMAIL}`);
    console.log(`   ENABLE_AUTO_POSTING: ${process.env.ENABLE_AUTO_POSTING}\n`);

    // Process pending posts
    console.log('🔄 מעבד פוסטים ממתינים...');
    await fbPublisher.processPendingPosts();

    console.log('\n✅ התהליך הסתיים!');

  } catch (error) {
    console.error('\n❌ שגיאה:', error.message);
  }

  process.exit(0);
}

testPublishing();
