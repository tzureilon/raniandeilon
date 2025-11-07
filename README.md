# 🚀 Propel.AI

## מערכת אוטונומית לשיווק אגרסיבי של נדל״ן בפייסבוק

Propel.AI היא מערכת SaaS מתקדמת לשיווק אוטומטי של נכסי נדל״ן באמצעות פייסבוק. המערכת פועלת 24/7, מייצרת תוכן מגוון, מפרסמת בקבוצות מטורגטות, ומנהלת לידים בצורה חכמה ואוטומטית.

---

## 📖 מדריכים מהירים

| 📄 מדריך | 📝 תיאור | ⏱️ זמן קריאה |
|----------|----------|-------------|
| **[▶️ START_HERE.md](./START_HERE.md)** | **התחל כאן!** מדריך קצר ומהיר להתקנה | 3 דקות |
| **[📖 QUICK_START.md](./QUICK_START.md)** | מדריך מפורט צעד-אחר-צעד למתחילים | 15 דקות |
| **[💡 EXAMPLES.md](./EXAMPLES.md)** | דוגמאות מעשיות לשימוש ב-API | 10 דקות |
| **[🔧 TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | פתרון בעיות נפוצות | לפי צורך |

**👉 חדש כאן? התחל ב-[START_HERE.md](./START_HERE.md)**

---

## ✨ תכונות עיקריות

### 🏠 ניהול נכסים
- הזנה קלה של נכסים (דירות, בתים פרטיים, מגרשים, נכסים מסחריים)
- העלאת תמונות וניהול גלריה
- מעקב אחר סטטוס (פעיל, נמכר, מושכר)
- תעדוף אוטומטי לפי ביצועים

### 📝 יצירת תוכן דינמית
- 10+ וריאציות ייחודיות לכל נכס
- שימוש בתבניות חכמות
- התאמה אוטומטית לסוג נכס ואזור
- מנגנון אנטי-חזרתיות

### 📢 פרסום אוטומטי
- פרסום בפייסבוק עם Puppeteer
- ניהול קבוצות מטורגטות
- תזמון חכם של פרסומים
- רוטציית חשבונות למניעת חסימות
- מנגנון אנטי-באן מתקדם

### 🎯 ניהול לידים
- זיהוי אוטומטי של תגובות מעניינות
- ניתוח סנטימנט (חם, חמים, קר, שלילי)
- תגובות אוטומטיות מותאמות אישית
- ניקוד לידים (0-100)
- מעקב ומעבר סטטוסים

### 📊 דשבורד וניתוח
- סטטיסטיקות בזמן אמת
- ניתוח ביצועים של קבוצות ונכסים
- דוחות יומיים ושבועיים
- המלצות לשיפור
- ניתוח מגמות

### 📲 התראות והתראות
- התראות טלגרם על לידים חמים
- דוחות יומיים אוטומטיים
- התראות על שגיאות קריטיות
- עדכונים על נכסים חדשים

---

## 🛠️ טכנולוגיות

### Backend
- **Node.js** + **TypeScript** - שרת ומנוע עיבוד
- **Express.js** - REST API
- **PostgreSQL** - מסד נתונים
- **Puppeteer** - אוטומציה של פייסבוק
- **node-cron** - תזמון משימות

### Frontend
- **React** + **TypeScript** - ממשק משתמש
- **Vite** - כלי בנייה מהיר
- **Axios** - תקשורת עם API

### אינטגרציות
- **Telegram Bot API** - התראות
- **Cloudinary** - אחסון תמונות
- **OpenAI API** (אופציונלי) - יצירת תוכן מתקדם

---

## 📦 התקנה

### דרישות מקדימות
- Node.js 18+
- PostgreSQL 14+
- חשבון פייסבוק פעיל
- Telegram Bot Token (אופציונלי)

### שלב 1: שכפול הפרויקט
\`\`\`bash
git clone https://github.com/your-repo/propel-ai.git
cd propel-ai
\`\`\`

### שלב 2: התקנת תלויות Backend
\`\`\`bash
npm install
\`\`\`

### שלב 3: התקנת תלויות Frontend
\`\`\`bash
cd client
npm install
cd ..
\`\`\`

### שלב 4: הגדרת משתני סביבה
\`\`\`bash
cp .env.example .env
\`\`\`

ערוך את הקובץ `.env` והזן את הפרטים:
\`\`\`env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/propel_ai
DB_HOST=localhost
DB_PORT=5432
DB_NAME=propel_ai
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=development

# Facebook
FB_EMAIL=your_facebook_email
FB_PASSWORD=your_facebook_password

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Features
MAX_POSTS_PER_DAY=50
MIN_POST_INTERVAL_MINUTES=15
ENABLE_AUTO_POSTING=true
ENABLE_COMMENT_MONITORING=true
\`\`\`

### שלב 5: יצירת מסד נתונים
\`\`\`bash
# צור מסד נתונים ב-PostgreSQL
createdb propel_ai

# הרץ מיגרציות
npm run db:migrate

# טען נתוני דמו (אופציונלי)
npm run db:seed
\`\`\`

---

## 🚀 הרצה

### הפעלת Backend
\`\`\`bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
\`\`\`

### הפעלת Frontend
\`\`\`bash
cd client
npm run dev
\`\`\`

הדשבורד יהיה זמין בכתובת: http://localhost:5173

---

## 📖 שימוש במערכת

### 1. הוספת נכס חדש

שלח בקשת POST ל-`/api/properties`:
\`\`\`json
{
  "property": {
    "property_type": "דירה",
    "city": "נתניה",
    "neighborhood": "קרית השרון",
    "price": 1500000,
    "rooms": 4,
    "area_sqm": 100,
    "description": "דירה מרווחת ומוארת",
    "status": "active"
  },
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
\`\`\`

### 2. צפייה בדשבורד
פתח את הדפדפן בכתובת http://localhost:5173 לצפייה ב:
- סטטיסטיקות כלליות
- לידים חמים
- ביצועי נכסים וקבוצות

### 3. הוספת קבוצות פייסבוק
הוסף קבוצות ידנית למסד הנתונים:
\`\`\`sql
INSERT INTO fb_groups (name, url, members_count, category, target_cities, is_active)
VALUES ('נדל"ן נתניה', 'https://facebook.com/groups/example', 10000, 'כללי', ARRAY['נתניה'], true);
\`\`\`

### 4. הפעלת הפרסום האוטומטי
במשתני הסביבה, הגדר:
\`\`\`
ENABLE_AUTO_POSTING=true
\`\`\`

המערכת תתחיל לפרסם אוטומטית לפי התזמון.

---

## 🏗️ ארכיטקטורה

### מבנה תיקיות
\`\`\`
propel-ai/
├── src/                      # Backend source code
│   ├── config/              # הגדרות (DB, etc.)
│   ├── modules/             # מודולים עיקריים
│   │   ├── assets_ingest.ts
│   │   ├── content_generator.ts
│   │   ├── scheduler.ts
│   │   ├── fb_publisher.ts
│   │   ├── fb_listener.ts
│   │   ├── crm_manager.ts
│   │   └── alert_system.ts
│   ├── routes/              # API routes
│   ├── types/               # TypeScript types
│   ├── utils/               # כלים עזר
│   └── index.ts             # Entry point
├── client/                   # Frontend React
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── database/                 # סכמות DB
│   └── schema.sql
├── scripts/                  # סקריפטים
│   ├── migrate.js
│   └── seed.js
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

### מודולים עיקריים

#### 1. assets_ingest
- הוספה, עדכון ומחיקה של נכסים
- ניהול תמונות
- ולידציה

#### 2. content_generator
- יצירת וריאציות תוכן
- מילוי תבניות
- ניהול שימוש חוזר

#### 3. scheduler
- תזמון פרסומים חכם
- בחירת קבוצות רלוונטיות
- דוחות יומיים

#### 4. fb_publisher
- פרסום אוטומטי בפייסבוק
- ניהול דפדפן
- מנגנון אנטי-באן

#### 5. fb_listener
- מעקב אחר תגובות
- ניתוח סנטימנט
- תגובות אוטומטיות

#### 6. crm_manager
- ניהול לידים
- ניתוח ביצועים
- המלצות

#### 7. alert_system
- התראות טלגרם
- דוחות יומיים
- התראות על שגיאות

---

## 📊 API Endpoints

### Properties (נכסים)
- `GET /api/properties` - קבלת כל הנכסים
- `GET /api/properties/:id` - קבלת נכס לפי ID
- `POST /api/properties` - הוספת נכס חדש
- `PUT /api/properties/:id` - עדכון נכס
- `PATCH /api/properties/:id/status` - שינוי סטטוס
- `DELETE /api/properties/:id` - מחיקת נכס

### Dashboard (דשבורד)
- `GET /api/dashboard/stats` - סטטיסטיקות כלליות
- `GET /api/dashboard/hot-leads` - לידים חמים
- `GET /api/dashboard/group-performance` - ביצועי קבוצות
- `GET /api/dashboard/property-performance` - ביצועי נכסים
- `GET /api/dashboard/weekly-report` - דוח שבועי
- `GET /api/dashboard/recommendations` - המלצות

### Leads (לידים)
- `GET /api/leads` - קבלת כל הלידים
- `PATCH /api/leads/:id/status` - עדכון סטטוס ליד
- `POST /api/leads/:id/reply` - שליחת תגובה

---

## 🔐 אבטחה

- שימוש ב-HTTPS בפרודקשן
- הצפנת סיסמאות ב-.env
- הגבלת שיעור בקשות (Rate limiting)
- Validation של קלט משתמש
- SQL Injection protection
- XSS protection

---

## 🎯 תכונות עתידיות

- [ ] אינטגרציה עם WhatsApp Business
- [ ] שילוב AI לכתיבת תוכן (GPT-4)
- [ ] תמיכה באינסטגרם
- [ ] מערכת A/B testing לפוסטים
- [ ] אנליטיקס מתקדם
- [ ] אפליקציית מובייל
- [ ] Multi-tenancy (מספר משרדים)
- [ ] אינטגרציה עם CRM חיצוניים

---

## 🐛 דיבאג ובעיות נפוצות

### המערכת לא מפרסמת
1. בדוק ש-`ENABLE_AUTO_POSTING=true`
2. ודא שהפרטים של פייסבוק נכונים
3. בדוק שיש נכסים פעילים במערכת

### שגיאות חיבור למסד נתונים
1. ודא ש-PostgreSQL פועל
2. בדוק את פרטי ההתחברות ב-.env
3. הרץ מיגרציות: `npm run db:migrate`

### הדשבורד לא טוען
1. ודא שה-Backend פועל על פורט 3000
2. בדוק שה-Frontend פועל על פורט 5173
3. נקה cache של הדפדפן

---

## 📝 לוגים

לוגים נשמרים ב:
- `logs/error.log` - שגיאות בלבד
- `logs/combined.log` - כל הלוגים
- טבלת `system_logs` במסד הנתונים

---

## 🤝 תרומה

רוצה לתרום לפרויקט? מעולה!
1. Fork the repository
2. צור branch חדש (`git checkout -b feature/amazing-feature`)
3. Commit השינויים (`git commit -m 'הוספת פיצ׳ר מדהים'`)
4. Push ל-branch (`git push origin feature/amazing-feature`)
5. פתח Pull Request

---

## 📄 רישיון

MIT License - ראה קובץ LICENSE למידע נוסף

---

## 📞 יצירת קשר ותמיכה

- 📧 Email: support@propel-ai.com
- 💬 Telegram: @propel_ai_support
- 🌐 Website: https://propel-ai.com

---

## 🙏 תודות

- צוות הפיתוח
- הקהילה של Node.js
- תורמי הקוד הפתוח

---

## ⚖️ הצהרת אחריות

מערכת זו נועדה לשימוש לגיטימי בלבד. על המשתמשים לפעול בהתאם למדיניות פייסבוק ולחוקי הפרטיות והפרסום המקומיים. המפתחים אינם אחראים לשימוש לא חוקי או לא אתי במערכת.

---

<div align="center">

**נבנה בישראל 🇮🇱 עם ❤️**

**Propel.AI &copy; 2024**

</div>
