/**
 * System Health Check Script
 * בדיקת תקינות מערכת מקיפה
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🔍 בדיקת מערכת Propel.AI - System Health Check');
console.log('='.repeat(60) + '\n');

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  critical: []
};

function check(name, condition, isCritical = false) {
  process.stdout.write(`${name.padEnd(50, '.')} `);

  if (condition) {
    console.log('✅ PASS');
    results.passed++;
    return true;
  } else {
    const status = isCritical ? '❌ CRITICAL' : '⚠️  WARN';
    console.log(status);

    if (isCritical) {
      results.critical.push(name);
      results.failed++;
    } else {
      results.warnings++;
    }
    return false;
  }
}

// 1. קבצי הגדרות
console.log('\n📁 קבצי הגדרות (Configuration Files)\n');

check('package.json exists', fs.existsSync('package.json'), true);
check('tsconfig.json exists', fs.existsSync('tsconfig.json'), true);
check('.env.example exists', fs.existsSync('.env.example'));
check('.env configured', fs.existsSync('.env'), false);
check('.gitignore exists', fs.existsSync('.gitignore'));

// 2. תיקיות
console.log('\n📂 תיקיות (Directories)\n');

const dirs = [
  'src',
  'src/modules',
  'src/routes',
  'src/config',
  'src/utils',
  'database',
  'client',
  'dist'
];

dirs.forEach(dir => {
  check(`${dir}/ exists`, fs.existsSync(dir));
});

// 3. Backend Modules
console.log('\n⚙️  Backend Modules\n');

const modules = [
  'src/index.ts',
  'src/modules/fb_publisher.ts',
  'src/modules/scheduler.ts',
  'src/modules/content_generator.ts',
  'src/modules/assets_ingest.ts',
  'src/modules/crm_manager.ts',
  'src/modules/fb_listener.ts',
  'src/modules/alert_system.ts',
];

modules.forEach(mod => {
  const moduleName = path.basename(mod, '.ts');
  check(`Module: ${moduleName}`, fs.existsSync(mod), true);
});

// 4. API Routes
console.log('\n🛣️  API Routes\n');

const routes = [
  'src/routes/properties.ts',
  'src/routes/dashboard.ts',
  'src/routes/leads.ts',
];

routes.forEach(route => {
  const routeName = path.basename(route, '.ts');
  check(`Route: ${routeName}`, fs.existsSync(route));
});

// 5. Frontend
console.log('\n🎨 Frontend Files\n');

const frontendFiles = [
  'client/package.json',
  'client/src/App.tsx',
  'client/src/main.tsx',
  'client/src/services/api.ts',
];

frontendFiles.forEach(file => {
  const fileName = path.basename(file);
  check(`Frontend: ${fileName}`, fs.existsSync(file));
});

// 6. Database
console.log('\n🗄️  Database Files\n');

check('Database schema.sql', fs.existsSync('database/schema.sql'), true);
check('Migration script', fs.existsSync('scripts/migrate.js'));
check('Seed script', fs.existsSync('scripts/seed.js'));

// 7. Dependencies
console.log('\n📦 Dependencies\n');

check('node_modules installed', fs.existsSync('node_modules'), true);
check('client/node_modules installed', fs.existsSync('client/node_modules'));

// Check critical packages
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const criticalPackages = ['express', 'pg', 'puppeteer', 'dotenv'];

criticalPackages.forEach(pkg => {
  const installed = fs.existsSync(`node_modules/${pkg}`);
  check(`Package: ${pkg}`, installed, true);
});

// 8. Build Output
console.log('\n🔨 Build Output\n');

check('TypeScript compiled (dist/)', fs.existsSync('dist'), true);
check('dist/index.js exists', fs.existsSync('dist/index.js'), true);
check('dist/modules/ exists', fs.existsSync('dist/modules'), true);

// 9. Environment Configuration
console.log('\n🔐 Environment Configuration\n');

if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');

  check('FB_EMAIL configured', envContent.includes('FB_EMAIL=') && !envContent.includes('FB_EMAIL=your_'));
  check('FB_PASSWORD configured', envContent.includes('FB_PASSWORD=') && !envContent.includes('FB_PASSWORD=your_'));
  check('DB_NAME configured', envContent.includes('DB_NAME='));
  check('ENABLE_AUTO_POSTING set', envContent.includes('ENABLE_AUTO_POSTING='));
} else {
  console.log('  ⚠️  .env file not configured - copy from .env.example');
}

// 10. Facebook Publisher Analysis
console.log('\n🤖 Facebook Publisher Module Analysis\n');

if (fs.existsSync('src/modules/fb_publisher.ts')) {
  const fbPublisherContent = fs.readFileSync('src/modules/fb_publisher.ts', 'utf8');

  check('Puppeteer integration', fbPublisherContent.includes('import puppeteer'));
  check('Login method exists', fbPublisherContent.includes('async login()'));
  check('Publish method exists', fbPublisherContent.includes('async publishPost'));
  check('Error handling', fbPublisherContent.includes('try {') && fbPublisherContent.includes('catch'));
  check('Database updates', fbPublisherContent.includes("status = 'posted'"));
}

// 11. Documentation
console.log('\n📚 Documentation\n');

const docs = [
  'README.md',
  'START_HERE.md',
  'QUICK_START.md',
  'ARCHITECTURE.md',
  'TROUBLESHOOTING.md',
];

docs.forEach(doc => {
  check(`Doc: ${doc}`, fs.existsSync(doc));
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 תוצאות סופיות (Final Results)');
console.log('='.repeat(60));

console.log(`\n✅ בדיקות שעברו (Passed):    ${results.passed}`);
console.log(`⚠️  אזהרות (Warnings):       ${results.warnings}`);
console.log(`❌ כשלונות (Failed):        ${results.failed}`);

if (results.critical.length > 0) {
  console.log('\n❌ בעיות קריטיות (CRITICAL ISSUES):');
  results.critical.forEach(issue => {
    console.log(`   - ${issue}`);
  });
  console.log('\n⚠️  המערכת לא תוכל לפעול ללא תיקון הבעיות הקריטיות!');
} else {
  console.log('\n✅ אין בעיות קריטיות!');
}

// Overall Status
const totalChecks = results.passed + results.failed + results.warnings;
const successRate = Math.round((results.passed / totalChecks) * 100);

console.log('\n' + '='.repeat(60));
console.log(`📈 Success Rate: ${successRate}%`);

if (successRate >= 90 && results.failed === 0) {
  console.log('🎉 המערכת במצב מעולה! (System in Excellent Condition!)');
} else if (successRate >= 70 && results.failed < 3) {
  console.log('👍 המערכת במצב טוב (System in Good Condition)');
} else if (successRate >= 50) {
  console.log('⚠️  המערכת דורשת תשומת לב (System Needs Attention)');
} else {
  console.log('❌ המערכת דורשת תיקונים משמעותיים (System Needs Significant Fixes)');
}

console.log('='.repeat(60) + '\n');

// Next Steps
if (results.warnings > 0 || results.failed > 0) {
  console.log('📝 צעדים הבאים (Next Steps):\n');

  if (!fs.existsSync('.env')) {
    console.log('1. ⚙️  צור קובץ .env:');
    console.log('   cp .env.example .env');
    console.log('   ערוך את הקובץ והגדר את פרטי ההתחברות\n');
  }

  if (!fs.existsSync('client/node_modules')) {
    console.log('2. 📦 התקן תלויות Frontend:');
    console.log('   cd client && npm install\n');
  }

  if (results.critical.length === 0) {
    console.log('3. 🚀 הפעל את המערכת:');
    console.log('   npm run dev  # Backend');
    console.log('   cd client && npm run dev  # Frontend\n');
  }
}

// Exit code
process.exit(results.failed > 0 ? 1 : 0);
