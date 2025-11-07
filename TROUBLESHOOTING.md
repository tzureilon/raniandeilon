# 🔧 פתרון בעיות - Propel.AI

מדריך מקיף לפתרון בעיות נפוצות

---

## 🔴 בעיות התקנה

### ❌ "npm install failed"

**אבחון:**
\`\`\`bash
# בדוק גרסת Node.js
node -v
# צריך להיות 18 ומעלה
\`\`\`

**פתרון:**
\`\`\`bash
# נקה cache של npm
npm cache clean --force

# נסה שוב
npm install
\`\`\`

---

### ❌ "Cannot find module"

**פתרון:**
\`\`\`bash
# מחק node_modules והתקן מחדש
rm -rf node_modules package-lock.json
npm install

# גם בתיקיית client
cd client
rm -rf node_modules package-lock.json
npm install
\`\`\`

---

## 🔴 בעיות מסד נתונים

### ❌ "Cannot connect to database"

**אבחון:**
\`\`\`bash
# בדוק אם PostgreSQL רץ
# Mac/Linux:
ps aux | grep postgres

# Windows (CMD):
sc query postgresql-x64-14
\`\`\`

**פתרון 1: הפעל את PostgreSQL**
\`\`\`bash
# Mac:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Windows:
# Services -> PostgreSQL -> Start
\`\`\`

**פתרון 2: בדוק פרטי חיבור**
\`\`\`bash
# פתח .env וודא:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=propel_ai
DB_USER=postgres
DB_PASSWORD=הסיסמה_הנכונה
\`\`\`

**פתרון 3: צור מסד נתונים**
\`\`\`bash
# התחבר ל-PostgreSQL
psql -U postgres

# צור מסד נתונים
CREATE DATABASE propel_ai;

# צא
\q
\`\`\`

---

### ❌ "relation does not exist"

**משמעות:** הטבלאות לא נוצרו

**פתרון:**
\`\`\`bash
npm run db:migrate
\`\`\`

**אם זה לא עובד:**
\`\`\`bash
# התחבר ישירות
psql -U postgres -d propel_ai

# הרץ את הסכמה ידנית
\i database/schema.sql

# צא
\q
\`\`\`

---

### ❌ "password authentication failed"

**פתרון:**
1. פתח `.env`
2. ודא שהסיסמה נכונה
3. נסה להתחבר ידנית:
\`\`\`bash
psql -U postgres -d propel_ai
# אם זה עובד, הסיסמה נכונה
\`\`\`

**איפוס סיסמה ב-PostgreSQL:**
\`\`\`bash
# התחבר כ-superuser
sudo -u postgres psql

# שנה סיסמה
ALTER USER postgres PASSWORD 'סיסמה_חדשה';
\`\`\`

---

## 🔴 בעיות שרת

### ❌ "Port 3000 already in use"

**אבחון:**
\`\`\`bash
# Mac/Linux:
lsof -ti:3000

# Windows:
netstat -ano | findstr :3000
\`\`\`

**פתרון:**
\`\`\`bash
# Mac/Linux:
lsof -ti:3000 | xargs kill

# Windows (CMD כמנהל):
netstat -ano | findstr :3000
# רשום את ה-PID (המספר האחרון)
taskkill /PID <המספר> /F
\`\`\`

**חלופה:** שנה את הפורט ב-.env:
\`\`\`env
PORT=3001
\`\`\`

---

### ❌ "npm run dev - nothing happens"

**אבחון:**
\`\`\`bash
# בדוק לוגים
cat logs/combined.log
cat logs/error.log
\`\`\`

**פתרון:**
\`\`\`bash
# הרץ במצב verbose
NODE_ENV=development npm run dev
\`\`\`

---

### ❌ "TypeScript errors"

**פתרון:**
\`\`\`bash
# Build מחדש
npm run build

# אם יש שגיאות, בדוק:
npx tsc --noEmit
\`\`\`

---

## 🔴 בעיות פייסבוק

### ❌ "Facebook login failed"

**סיבות אפשריות:**
1. אימייל/סיסמה שגויים
2. אימות דו-שלבי פעיל
3. פייסבוק חסם את ההתחברות

**פתרון 1: בדוק פרטי התחברות**
\`\`\`bash
# פתח .env וודא:
FB_EMAIL=האימייל_הנכון
FB_PASSWORD=הסיסמה_הנכונה
\`\`\`

**פתרון 2: התחבר ידנית קודם**
1. פתח Chrome
2. היכנס לפייסבוק ידנית
3. אשר את המכשיר
4. נסה שוב

**פתרון 3: כבה אימות דו-שלבי זמנית**
- Settings -> Security -> Two-Factor Authentication -> Disable

---

### ❌ "Post failed - selector not found"

**משמעות:** פייסבוק שינה את המבנה

**פתרון זמני:**
\`\`\`bash
# פתח .env ובטל פרסום אוטומטי
ENABLE_AUTO_POSTING=false
\`\`\`

**פתרון קבוע:** צריך לעדכן את הסלקטורים ב-`fb_publisher.ts`

---

### ❌ "Account temporarily blocked"

**משמעות:** פייסבוק חסם את החשבון

**פתרון:**
1. פתח פייסבוק ידנית
2. עקוב אחר ההוראות לביטול חסימה
3. המתן 24-48 שעות
4. הפחת את `MAX_POSTS_PER_DAY` ב-.env

**מניעה:**
\`\`\`env
MAX_POSTS_PER_DAY=10  # במקום 50
MIN_POST_INTERVAL_MINUTES=60  # במקום 15
\`\`\`

---

## 🔴 בעיות ממשק (Frontend)

### ❌ "Blank page - nothing loads"

**אבחון:**
\`\`\`bash
# פתח Console בדפדפן (F12)
# חפש שגיאות
\`\`\`

**פתרון 1: נקה cache**
- Chrome: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

**פתרון 2: בדוק שה-Backend רץ**
\`\`\`bash
curl http://localhost:3000/health
\`\`\`

**פתרון 3: Rebuild**
\`\`\`bash
cd client
rm -rf node_modules
npm install
npm run dev
\`\`\`

---

### ❌ "Failed to fetch" / "Network Error"

**משמעות:** הממשק לא מצליח להתחבר לשרת

**פתרון:**
\`\`\`bash
# בדוק ש-Backend רץ על פורט 3000
curl http://localhost:3000/health

# אם לא, הפעל:
npm run dev
\`\`\`

---

### ❌ "CORS Error"

**פתרון:** הוסף ב-`src/index.ts`:
\`\`\`typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
\`\`\`

---

## 🔴 בעיות טלגרם

### ❌ "Telegram message not sent"

**אבחון:**
\`\`\`bash
# בדוק את הלוגים
tail -f logs/combined.log | grep telegram
\`\`\`

**פתרון 1: בדוק פרטים**
\`\`\`bash
# פתח .env וודא:
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=987654321
\`\`\`

**פתרון 2: בדוק Bot**
1. פתח טלגרם
2. שלח `/start` לבוט שלך
3. ודא שקיבלת תגובה

**פתרון 3: בדוק Chat ID**
\`\`\`bash
# שלח הודעה לבוט
# אז בדוק:
curl https://api.telegram.org/bot<TOKEN>/getUpdates
# חפש את ה-chat.id
\`\`\`

---

## 🔴 בעיות ביצועים

### ❌ "System is slow"

**אבחון:**
\`\`\`sql
-- בדוק כמה רשומות יש
SELECT
  'properties' as table_name, COUNT(*) FROM properties
UNION ALL
SELECT 'posts', COUNT(*) FROM posts
UNION ALL
SELECT 'leads', COUNT(*) FROM leads;
\`\`\`

**פתרון 1: נקה נתונים ישנים**
\`\`\`sql
-- מחק פוסטים ישנים מ-30+ ימים
DELETE FROM posts WHERE posted_at < NOW() - INTERVAL '30 days';

-- מחק לידים קרים מ-90+ ימים
DELETE FROM leads
WHERE created_at < NOW() - INTERVAL '90 days'
AND sentiment IN ('cold', 'negative');
\`\`\`

**פתרון 2: אופטימיזציית מסד נתונים**
\`\`\`sql
-- Vacuum וניתוח
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE propel_ai;
\`\`\`

---

### ❌ "High CPU usage"

**אבחון:**
\`\`\`bash
# Mac/Linux:
top | grep node

# Windows:
# Task Manager -> Details -> node.exe
\`\`\`

**פתרון:**
1. בטל פרסום אוטומטי זמנית:
\`\`\`env
ENABLE_AUTO_POSTING=false
\`\`\`

2. הפחת תדירות:
\`\`\`env
MAX_POSTS_PER_DAY=10
\`\`\`

3. סגור דפדפן Puppeteer:
\`\`\`bash
# הפעל מחדש את השרת
\`\`\`

---

## 🔴 בעיות כלליות

### ❌ "Module not found"

**פתרון:**
\`\`\`bash
npm install <שם-המודול>
\`\`\`

---

### ❌ "Permission denied"

**Mac/Linux:**
\`\`\`bash
sudo chown -R $USER:$USER .
chmod -R 755 .
\`\`\`

**Windows:** הרץ CMD כמנהל

---

### ❌ "Out of memory"

**פתרון:**
\`\`\`bash
# הגדל זיכרון Node.js
NODE_OPTIONS=--max-old-space-size=4096 npm run dev
\`\`\`

---

## 🔍 כלי אבחון

### 1. בדיקת שרת
\`\`\`bash
curl http://localhost:3000/health
\`\`\`

### 2. בדיקת Database
\`\`\`bash
psql -U postgres -d propel_ai -c "SELECT NOW();"
\`\`\`

### 3. צפייה בלוגים בזמן אמת
\`\`\`bash
tail -f logs/combined.log
\`\`\`

### 4. צפייה בשגיאות בלבד
\`\`\`bash
tail -f logs/error.log
\`\`\`

### 5. בדיקת לוגים במסד נתונים
\`\`\`sql
SELECT * FROM system_logs
WHERE level IN ('error', 'critical')
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

---

## 📞 קיבלת שגיאה שלא מופיעה כאן?

### שלב 1: צלם Screenshot של השגיאה
### שלב 2: בדוק לוגים
\`\`\`bash
cat logs/error.log
\`\`\`
### שלב 3: בדוק system_logs
\`\`\`sql
SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 10;
\`\`\`
### שלב 4: פתח Issue ב-GitHub עם:
- תיאור הבעיה
- צילום מסך
- לוגים רלוונטיים
- מה ניסית לעשות

---

## ✅ Checklist לפתרון בעיות

לפני שפונים לתמיכה, וודא ש:

- [ ] Node.js 18+ מותקן
- [ ] PostgreSQL רץ
- [ ] מסד נתונים propel_ai קיים
- [ ] טבלאות נוצרו (npm run db:migrate)
- [ ] קובץ .env קיים ומלא
- [ ] npm install רץ בהצלחה
- [ ] שני Terminals פתוחים (Backend + Frontend)
- [ ] פורטים 3000 ו-5173 פנויים
- [ ] בדקת את הלוגים

---

## 🔄 Reset מלא (פתרון אולטימטיבי)

אם שום דבר לא עובד:

\`\`\`bash
# 1. עצור את כל התהליכים
# Ctrl+C בכל Terminal פתוח

# 2. מחק node_modules
rm -rf node_modules client/node_modules
rm package-lock.json client/package-lock.json

# 3. התקן מחדש
npm install
cd client && npm install && cd ..

# 4. איפוס DB
dropdb propel_ai
createdb propel_ai
npm run db:migrate

# 5. הפעל מחדש
npm run dev
# בטרמינל נפרד:
cd client && npm run dev
\`\`\`

---

<div align="center">

**עדיין תקוע? שלח הודעה! 💪**

</div>
