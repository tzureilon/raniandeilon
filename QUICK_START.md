# 🚀 מדריך התחלה מהירה - Propel.AI

## מה זה Propel.AI?
מערכת שמפרסמת אוטומטית נכסי נדל"ן בפייסבוק, עוקבת אחרי תגובות, ומנהלת לידים בשבילך.

---

## 📋 לפני שמתחילים - מה צריך להכין?

### 1. תוכנות שצריך להתקין במחשב:
- ✅ **Node.js** (גרסה 18 ומעלה) - [הורד כאן](https://nodejs.org/)
- ✅ **PostgreSQL** (מסד נתונים) - [הורד כאן](https://www.postgresql.org/download/)
- ✅ **Git** - [הורד כאן](https://git-scm.com/)

### 2. חשבונות שצריך:
- ✅ חשבון פייסבוק פעיל (למשתמש אמיתי, לא דף עסקי)
- ✅ בוט טלגרם להתראות (אופציונלי אבל מומלץ)

---

## 🎯 שלב 1: הורדת הקוד

פתח Terminal/CMD והקלד:

\`\`\`bash
# אם הקוד כבר נמצא במחשב, עבור לתיקייה:
cd raniandeilon

# אחרת, שכפל את הפרויקט:
git clone <כתובת-הריפו>
cd raniandeilon
\`\`\`

---

## 🎯 שלב 2: התקנת החבילות

\`\`\`bash
# התקן את כל החבילות של ה-Backend
npm install

# התקן את החבילות של הממשק
cd client
npm install
cd ..
\`\`\`

⏱️ **זה ייקח כ-2-3 דקות**

---

## 🎯 שלב 3: הגדרת מסד הנתונים

### 3.1 פתח PostgreSQL
- במחשב Windows: פתח את pgAdmin
- במחשב Mac/Linux: פתח Terminal

### 3.2 צור מסד נתונים חדש
\`\`\`sql
-- הקלד זאת ב-pgAdmin או ב-Terminal:
CREATE DATABASE propel_ai;
\`\`\`

### 3.3 הרץ את הטבלאות
\`\`\`bash
# חזור לתיקיית הפרויקט והרץ:
npm run db:migrate
\`\`\`

✅ אם הכל עבד, תראה: "✅ Database migration completed successfully!"

### 3.4 הוסף נתוני דמו (אופציונלי)
\`\`\`bash
npm run db:seed
\`\`\`

---

## 🎯 שלב 4: הגדרת הפרטים האישיים

### 4.1 צור קובץ הגדרות
\`\`\`bash
# העתק את קובץ הדוגמה:
cp .env.example .env
\`\`\`

### 4.2 פתח את הקובץ `.env` בעורך טקסט ומלא:

\`\`\`env
# ====== חיבור למסד נתונים ======
DB_HOST=localhost
DB_PORT=5432
DB_NAME=propel_ai
DB_USER=postgres
DB_PASSWORD=הסיסמה_שלך_ל_PostgreSQL

# ====== פרטי פייסבוק ======
FB_EMAIL=האימייל_שלך_בפייסבוק
FB_PASSWORD=הסיסמה_שלך_בפייסבוק

# ====== בוט טלגרם (אופציונלי) ======
# איך לקבל? ראה בסוף המדריך
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# ====== הגדרות פרסום ======
MAX_POSTS_PER_DAY=20
MIN_POST_INTERVAL_MINUTES=30
ENABLE_AUTO_POSTING=false  # בהתחלה תשאיר false!
\`\`\`

⚠️ **חשוב:** בהתחלה תשאיר `ENABLE_AUTO_POSTING=false` כדי לבדוק שהכל עובד!

---

## 🎯 שלב 5: הפעלת המערכת

### פתח 2 חלונות Terminal/CMD:

#### חלון 1️⃣ - הפעל את השרת (Backend):
\`\`\`bash
npm run dev
\`\`\`

אתה אמור לראות:
\`\`\`
╔════════════════════════════════════════════════╗
║              🚀 Propel.AI 🚀                  ║
║   מערכת אוטונומית לשיווק נדל״ן בפייסבוק      ║
║   Server: http://localhost:3000               ║
╚════════════════════════════════════════════════╝
\`\`\`

#### חלון 2️⃣ - הפעל את הממשק (Frontend):
\`\`\`bash
cd client
npm run dev
\`\`\`

אתה אמור לראות:
\`\`\`
  VITE v5.0.8  ready in 500 ms
  ➜  Local:   http://localhost:5173/
\`\`\`

---

## 🎯 שלב 6: בדיקה ראשונה

### פתח דפדפן וגש ל:
\`\`\`
http://localhost:5173
\`\`\`

אתה אמור לראות את הדשבורד! 🎉

---

## 🏠 שלב 7: הוספת נכס ראשון

### דרך 1: באמצעות API (מומלץ למתכנתים)

פתח Postman או Thunder Client ושלח:

\`\`\`
POST http://localhost:3000/api/properties
Content-Type: application/json

{
  "property": {
    "property_type": "דירה",
    "city": "תל אביב",
    "neighborhood": "צפון הישן",
    "price": 2500000,
    "rooms": 4,
    "area_sqm": 100,
    "description": "דירה מרווחת ומשופצת, קומה 3, מעלית, מזגן בכל החדרים"
  },
  "images": [
    "https://example.com/image1.jpg"
  ]
}
\`\`\`

### דרך 2: ישירות למסד הנתונים

פתח pgAdmin ורוץ:

\`\`\`sql
INSERT INTO properties (property_type, city, neighborhood, price, rooms, area_sqm, description, status)
VALUES (
  'דירה',
  'תל אביב',
  'צפון הישן',
  2500000,
  4,
  100,
  'דירה מרווחת ומשופצת',
  'active'
);
\`\`\`

---

## 📱 שלב 8: הוספת קבוצות פייסבוק

### הוסף קבוצות בפייסבוק שאתה רוצה לפרסם בהן:

\`\`\`sql
INSERT INTO fb_groups (name, url, members_count, category, target_cities, is_active)
VALUES
(
  'נדל"ן תל אביב',
  'https://www.facebook.com/groups/YOUR_GROUP_ID',
  10000,
  'כללי',
  ARRAY['תל אביב', 'רמת גן'],
  true
);
\`\`\`

**איך למצוא את ה-URL של קבוצה?**
1. היכנס לקבוצה בפייסבוק
2. העתק את הכתובת מהדפדפן
3. זה משהו כמו: `facebook.com/groups/123456789`

---

## 🚀 שלב 9: הפעלת הפרסום האוטומטי

⚠️ **רק אחרי שבדקת שהכל עובד!**

1. סגור את השרת (Ctrl+C)
2. פתח את `.env`
3. שנה ל: `ENABLE_AUTO_POSTING=true`
4. הפעל מחדש: `npm run dev`

המערכת תתחיל לפרסם אוטומטית! 🎉

---

## 📊 מה קורה עכשיו?

המערכת עושה את זה אוטומטית:
1. ✅ יוצרת 10 נוסחים שונים לכל נכס
2. ✅ מתזמנת פרסומים חכמים בקבוצות
3. ✅ מפרסמת בזמנים אקראיים (נראה טבעי יותר)
4. ✅ עוקבת אחר תגובות
5. ✅ מזהה לידים חמים
6. ✅ שולחה התראות בטלגרם

---

## 🔍 איך לראות את הסטטיסטיקות?

פתח דפדפן: `http://localhost:5173`

תראה:
- 🏠 כמה נכסים יש במערכת
- 📢 כמה פוסטים פורסמו היום
- 🎯 כמה לידים הגיעו
- 🔥 לידים חמים (אנשים שמתעניינים ברצינות)

---

## 🤖 איך להגדיר בוט טלגרם? (אופציונלי)

### 1. צור בוט חדש:
1. פתח טלגרם
2. חפש: `@BotFather`
3. שלח: `/newbot`
4. תן שם לבוט: `PropelAI Bot`
5. תן username: `propelai_your_name_bot`
6. תקבל **TOKEN** - שמור אותו!

### 2. קבל את ה-Chat ID שלך:
1. חפש: `@userinfobot`
2. שלח לו הודעה כלשהי
3. הוא יחזיר לך את ה-**Chat ID** - שמור אותו!

### 3. הכנס אותם ל-.env:
\`\`\`env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=987654321
\`\`\`

---

## ❓ בעיות נפוצות ופתרונות

### 🔴 "Cannot connect to database"
**פתרון:**
1. בדוק ש-PostgreSQL פועל
2. בדוק שהסיסמה ב-.env נכונה
3. רוץ: `npm run db:migrate`

### 🔴 "Port 3000 already in use"
**פתרון:**
\`\`\`bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <המספר> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
\`\`\`

### 🔴 "Facebook login failed"
**פתרון:**
1. בדוק שהאימייל והסיסמה נכונים
2. נסה להתחבר ידנית מהדפדפן קודם
3. אולי יש אימות דו-שלבי - תצטרך לכבות אותו זמנית

### 🔴 הדשבורד לא נטען
**פתרון:**
1. בדוק ש-Backend רץ על פורט 3000
2. בדוק ש-Frontend רץ על פורט 5173
3. נקה cache: Ctrl+Shift+R

---

## 📞 צריך עזרה?

1. בדוק את הלוגים: `logs/combined.log`
2. בדוק את הטבלה `system_logs` במסד הנתונים
3. פתח Issue ב-GitHub

---

## ✅ Checklist - האם עשית הכל?

- [ ] התקנתי Node.js
- [ ] התקנתי PostgreSQL
- [ ] יצרתי מסד נתונים `propel_ai`
- [ ] רצתי `npm install`
- [ ] רצתי `npm run db:migrate`
- [ ] מילאתי את קובץ `.env`
- [ ] הוספתי לפחות נכס אחד
- [ ] הוספתי לפחות קבוצת פייסבוק אחת
- [ ] השרת רץ בהצלחה
- [ ] הדשבורד נטען

---

## 🎯 הצעד הבא

אחרי שהכל עובד:
1. הוסף עוד נכסים
2. הוסף עוד קבוצות פייסבוק
3. הפעל את הפרסום האוטומטי
4. עקוב אחרי הסטטיסטיקות
5. תהנה מהלידים! 🚀

---

<div align="center">

**בהצלחה! 💪**

אם משהו לא ברור - שאל!

</div>
