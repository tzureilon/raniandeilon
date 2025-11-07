# 🏗️ ארכיטקטורת Propel.AI

מדריך טכני למבנה המערכת

---

## 🎯 סקירה כללית

```
┌─────────────────────────────────────────────────────────┐
│                    👤 משתמש                              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               React Dashboard (Port 5173)                │
│  📊 סטטיסטיקות | 🏠 נכסים | 🎯 לידים | 📈 דוחות       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼ (REST API)
┌─────────────────────────────────────────────────────────┐
│            Express.js Server (Port 3000)                 │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ Properties │  │ Dashboard  │  │   Leads    │        │
│  │   Routes   │  │   Routes   │  │   Routes   │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  🧩 Modules Layer                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Assets     │  │   Content    │  │  Scheduler   │  │
│  │   Ingest     │  │  Generator   │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │      FB      │  │      FB      │  │     CRM      │  │
│  │  Publisher   │  │   Listener   │  │   Manager    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐                                       │
│  │    Alert     │                                       │
│  │    System    │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
              │                      │
              ▼                      ▼
    ┌──────────────────┐   ┌──────────────────┐
    │   PostgreSQL     │   │   Facebook       │
    │   Database       │   │   (Puppeteer)    │
    └──────────────────┘   └──────────────────┘
              │
              ▼
    ┌──────────────────┐
    │    Telegram      │
    │    Bot API       │
    └──────────────────┘
```

---

## 📦 מבנה תיקיות

```
propel-ai/
│
├── 📂 src/                         # Backend Source Code
│   │
│   ├── 📂 config/                  # הגדרות
│   │   └── database.ts             # חיבור PostgreSQL
│   │
│   ├── 📂 modules/                 # מודולים עיקריים
│   │   ├── assets_ingest.ts        # ניהול נכסים
│   │   ├── content_generator.ts    # יצירת תוכן
│   │   ├── scheduler.ts            # תזמון פרסומים
│   │   ├── fb_publisher.ts         # פרסום בפייסבוק
│   │   ├── fb_listener.ts          # מעקב תגובות
│   │   ├── crm_manager.ts          # ניהול לידים
│   │   └── alert_system.ts         # התראות
│   │
│   ├── 📂 routes/                  # API Endpoints
│   │   ├── properties.ts           # /api/properties
│   │   ├── dashboard.ts            # /api/dashboard
│   │   └── leads.ts                # /api/leads
│   │
│   ├── 📂 types/                   # TypeScript Types
│   │   └── index.ts                # הגדרות טיפוסים
│   │
│   ├── 📂 utils/                   # כלים עזר
│   │   └── logger.ts               # מערכת לוגים
│   │
│   └── index.ts                    # 🚀 Entry Point
│
├── 📂 client/                      # Frontend React
│   ├── src/
│   │   ├── App.tsx                 # Main Component
│   │   ├── App.css                 # Styles
│   │   ├── main.tsx                # Entry Point
│   │   └── index.css               # Global Styles
│   │
│   ├── index.html                  # HTML Template
│   ├── vite.config.ts              # Vite Config
│   └── package.json                # Dependencies
│
├── 📂 database/                    # Database Schema
│   └── schema.sql                  # PostgreSQL Tables
│
├── 📂 scripts/                     # Scripts
│   ├── migrate.js                  # DB Migration
│   ├── seed.js                     # Sample Data
│   └── setup.sh                    # Setup Script
│
├── 📂 logs/                        # Log Files
│   ├── combined.log                # All Logs
│   └── error.log                   # Errors Only
│
├── 📄 .env                         # Environment Variables
├── 📄 package.json                 # Dependencies
├── 📄 tsconfig.json                # TypeScript Config
│
└── 📚 Documentation/
    ├── README.md                   # Main Documentation
    ├── START_HERE.md               # Quick Start
    ├── QUICK_START.md              # Step-by-Step Guide
    ├── EXAMPLES.md                 # API Examples
    ├── TROUBLESHOOTING.md          # Problem Solving
    └── ARCHITECTURE.md             # This File
```

---

## 🔄 זרימת נתונים (Data Flow)

### 1️⃣ הוספת נכס

```
משתמש מוסיף נכס
    │
    ▼
POST /api/properties
    │
    ▼
assets_ingest.addProperty()
    │
    ├─► שמירה ב-DB (properties table)
    │
    └─► content_generator.generateVariations()
            │
            └─► יצירת 10 וריאציות → post_variations table
```

### 2️⃣ תזמון פרסומים

```
Scheduler (Cron: כל שעה)
    │
    ▼
scheduler.createScheduledPosts()
    │
    ├─► קבלת נכסים פעילים
    ├─► בחירת קבוצות רלוונטיות
    ├─► בחירת וריאציות לא בשימוש
    │
    └─► יצירת posts ב-status: pending
```

### 3️⃣ פרסום אוטומטי

```
FB Publisher (Cron: כל 5 דקות)
    │
    ▼
fb_publisher.processPendingPosts()
    │
    ├─► קבלת posts עם status: pending
    │
    ├─► התחברות לפייסבוק (Puppeteer)
    │
    ├─► פרסום בקבוצה
    │   │
    │   ├─► הקלדה דמוית אדם
    │   ├─► השהיות אקראיות
    │   └─► לחיצה על Post
    │
    └─► עדכון status: posted / failed
```

### 4️⃣ מעקב תגובות

```
FB Listener (Continuous)
    │
    ▼
fb_listener.monitorPostComments()
    │
    ├─► סריקת תגובות בפוסטים
    │
    ├─► ניתוח סנטימנט (hot/warm/cold)
    │
    ├─► שמירה ב-leads table
    │
    └─► אם ליד חם →
            alert_system.sendLeadAlert()
                │
                └─► שליחת התראה בטלגרם
```

### 5️⃣ דוחות יומיים

```
Scheduler (Cron: 23:00)
    │
    ▼
scheduler.generateDailyReport()
    │
    ├─► איסוף סטטיסטיקות היום
    │
    ├─► שמירה ב-performance_metrics
    │
    └─► alert_system.sendDailyReport()
            │
            └─► שליחת דוח בטלגרם
```

---

## 🗄️ מבנה מסד הנתונים

### טבלאות עיקריות

```sql
┌─────────────────┐
│   properties    │  ← נכסים
├─────────────────┤
│ id              │
│ property_type   │
│ city            │
│ price           │
│ status          │
│ priority        │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│ property_images │  ← תמונות נכס
├─────────────────┤
│ id              │
│ property_id     │
│ image_url       │
└─────────────────┘

┌─────────────────┐
│   fb_groups     │  ← קבוצות פייסבוק
├─────────────────┤
│ id              │
│ name            │
│ url             │
│ target_cities   │
│ success_rate    │
└─────────────────┘
         │
         │ N:M
         ▼
┌─────────────────┐
│     posts       │  ← פוסטים שפורסמו
├─────────────────┤
│ id              │
│ property_id     │───┐
│ group_id        │   │
│ post_text       │   │
│ status          │   │ 1:N
│ scheduled_at    │   │
│ posted_at       │   │
└─────────────────┘   │
                      ▼
                ┌─────────────────┐
                │     leads       │  ← לידים
                ├─────────────────┤
                │ id              │
                │ post_id         │
                │ property_id     │
                │ fb_user_name    │
                │ sentiment       │
                │ score           │
                │ status          │
                └─────────────────┘

┌─────────────────────────┐
│ performance_metrics     │  ← מדדי ביצועים
├─────────────────────────┤
│ date                    │
│ posts_published         │
│ leads_generated         │
│ hot_leads               │
└─────────────────────────┘
```

### יחסים בין טבלאות

- `properties` 1:N `property_images`
- `properties` 1:N `posts`
- `fb_groups` 1:N `posts`
- `posts` 1:N `leads`
- `properties` 1:N `post_variations`

---

## 🧩 מודולים - תיאור מפורט

### 1. Assets Ingest Module
**תפקיד:** ניהול נכסים

**פונקציות עיקריות:**
- `addProperty()` - הוספת נכס חדש
- `updateProperty()` - עדכון נכס קיים
- `getActiveProperties()` - קבלת נכסים פעילים
- `deleteProperty()` - מחיקת נכס

**טכנולוגיה:** TypeScript, PostgreSQL

---

### 2. Content Generator Module
**תפקיד:** יצירת תוכן מגוון

**פונקציות עיקריות:**
- `generateVariations()` - יצירת 10 נוסחים שונים
- `fillTemplate()` - מילוי תבניות עם נתוני נכס
- `getLeastUsedVariation()` - בחירת נוסח שלא נוצל הרבה

**אלגוריתם:**
```
1. טעינת תבניות לפי סוג נכס
2. מילוי משתנים: {city}, {price}, {rooms}, etc.
3. רנדומיזציה של תוכן
4. שמירה ב-post_variations
5. מעקב אחר שימוש בכל נוסח
```

---

### 3. Scheduler Module
**תפקיד:** תזמון חכם של פרסומים

**Cron Jobs:**
- `*/60 * * * *` - יצירת פוסטים חדשים (כל שעה)
- `*/5 * * * *` - עיבוד פוסטים ממתינים (כל 5 דקות)
- `0 23 * * *` - דוח יומי (23:00)

**פונקציות:**
- `createScheduledPosts()` - יצירת תור פרסומים
- `generateTimeSlots()` - יצירת חלונות זמן אקראיים
- `selectRelevantGroups()` - בחירת קבוצות לפי עיר

**אלגוריתם תזמון:**
```
1. חישוב: postsPerProperty = MAX_POSTS_PER_DAY / activeProperties
2. לכל נכס:
   a. בחירת קבוצות רלוונטיות (לפי עיר)
   b. יצירת חלונות זמן (08:00-22:00)
   c. מרווח מינימלי: MIN_POST_INTERVAL_MINUTES
   d. בחירת וריאציה חדשה
   e. שמירת post עם status: pending
```

---

### 4. FB Publisher Module
**תפקיד:** פרסום אוטומטי בפייסבוק

**טכנולוגיה:** Puppeteer (Headless Chrome)

**תהליך:**
```
1. אתחול דפדפן + התחברות לפייסבוק
2. קבלת פוסטים עם status: pending
3. לכל פוסט:
   a. מעבר ל-URL של הקבוצה
   b. חיפוש כפתור "Write something"
   c. הקלדה אותיות-אותיות (דמוי אדם)
   d. השהיות אקראיות
   e. לחיצה על Post
   f. עדכון status: posted
4. סגירת דפדפן
```

**מנגנון אנטי-באן:**
- הקלדה איטית (50-150ms בין תווים)
- השהיות אקראיות (2-4 שניות)
- User Agent אמיתי
- מרווחים בין פוסטים (1-2 דקות)

---

### 5. FB Listener Module
**תפקיד:** מעקב אחר תגובות ולידים

**פונקציות:**
- `monitorPostComments()` - סריקת תגובות
- `analyzeSentiment()` - ניתוח סנטימנט
- `saveLead()` - שמירת ליד
- `sendAutomatedReply()` - תגובה אוטומטית

**ניתוח סנטימנט:**
```javascript
Keywords Hot (מעוניין, רוצה, קונה) → +20 נקודות
Keywords Warm (פרטים, מעניין) → +10 נקודות
Keywords Cold (אולי, חשבתי) → -10 נקודות
Keywords Negative (לא, יקר) → -20 נקודות

Score >= 80 → sentiment: hot
Score >= 50 → sentiment: warm
Score >= 30 → sentiment: cold
Score < 30 → sentiment: negative
```

---

### 6. CRM Manager Module
**תפקיד:** ניהול לידים וניתוח ביצועים

**פונקציות:**
- `getDashboardStats()` - סטטיסטיקות כלליות
- `getHotLeads()` - לידים חמים
- `getGroupPerformance()` - ביצועי קבוצות
- `updatePropertyPriorities()` - עדכון עדיפויות

**אלגוריתם עדיפות נכס:**
```
Priority = 5 (base)
+ min(3, hot_leads * 2)
+ min(2, total_leads * 0.5)
+ min(1, total_likes * 0.01)
→ Cap at 10
```

---

### 7. Alert System Module
**תפקיד:** התראות והתראות

**סוגי התראות:**
- `sendLeadAlert()` - התראה על ליד חם
- `sendDailyReport()` - דוח יומי
- `sendErrorAlert()` - שגיאות קריטיות
- `sendNewPropertyAlert()` - נכס חדש נוסף

**פורמט הודעה:**
```
🔥 ליד חם חדש!
👤 שם: יוסי כהן
🏠 נכס: דירה בתל אביב
💬 תגובה: "מעוניין, אפשר פרטים?"
🎯 ציון: 85/100
```

---

## 🔐 אבטחה

### Secrets ב-.env
```
✅ סיסמאות מוצפנות
✅ לא נשמרות ב-Git
✅ הרשאות קבצים: 600
```

### Database Security
```
✅ Prepared Statements (מניעת SQL Injection)
✅ Input Validation
✅ הצפנת סיסמאות
```

### API Security
```
✅ CORS מוגדר
✅ Rate Limiting (אופציונלי)
✅ Input Sanitization
```

---

## 📊 ביצועים

### Bottlenecks אפשריים:
1. **Puppeteer** - אוכל זיכרון (500MB+ per instance)
2. **Database queries** - לטבלאות גדולות
3. **Facebook rate limits** - חסימות אוטומטיות

### אופטימיזציות:
1. **Database Indexes** - על כל ה-foreign keys
2. **Connection Pooling** - max 20 connections
3. **Caching** - לסטטיסטיקות (אופציונלי)
4. **Queue System** - לפרסומים (עתידי)

---

## 🔮 תכנון עתידי

### Phase 2
- [ ] Multi-account support (רוטציה של חשבונות)
- [ ] WhatsApp integration
- [ ] Instagram automation

### Phase 3
- [ ] AI content generation (GPT-4)
- [ ] A/B testing for posts
- [ ] Advanced analytics

### Phase 4
- [ ] Mobile app
- [ ] Multi-tenant (SaaS)
- [ ] API for external CRMs

---

## 🛠️ Stack טכנולוגי מלא

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 14+
- **ORM:** Native pg driver
- **Automation:** Puppeteer
- **Scheduling:** node-cron
- **Logging:** Winston

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **HTTP Client:** Axios
- **Styling:** Vanilla CSS

### DevOps
- **Version Control:** Git
- **CI/CD:** (To be implemented)
- **Monitoring:** Logs + system_logs table
- **Hosting:** Self-hosted / VPS

---

## 📞 תרומה ופיתוח

רוצה לתרום? קרא את המדריך:
- Fork → Branch → Code → Test → PR
- עקוב אחר TypeScript standards
- כתוב תיעוד לפונקציות חדשות
- הוסף tests (עתידי)

---

<div align="center">

**מעוניין בפרטים טכניים נוספים? שאל! 💪**

[← חזרה ל-README](./README.md)

</div>
