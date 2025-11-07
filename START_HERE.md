# 👋 ברוך הבא ל-Propel.AI!

## מה זה?
מערכת שמפרסמת עבורך נכסי נדל"ן אוטומטית בפייסבוק 24/7, עוקבת אחרי תגובות, ומזהה לקוחות פוטנציאליים.

---

## 🚀 התחלה מהירה (5 דקות)

### אופציה 1: התקנה אוטומטית (מומלץ)

\`\`\`bash
# Mac/Linux:
chmod +x scripts/setup.sh
./scripts/setup.sh

# Windows (Git Bash):
bash scripts/setup.sh
\`\`\`

### אופציה 2: התקנה ידנית

\`\`\`bash
# 1. התקן תלויות
npm install
cd client && npm install && cd ..

# 2. צור מסד נתונים
createdb propel_ai

# 3. הרץ מיגרציות
npm run db:migrate

# 4. העתק הגדרות
cp .env.example .env

# 5. ערוך .env עם הפרטים שלך
\`\`\`

---

## 📝 הגדרת .env (חובה!)

פתח את הקובץ `.env` ומלא:

\`\`\`env
# PostgreSQL - הסיסמה של מסד הנתונים שלך
DB_PASSWORD=your_password_here

# Facebook - הפרטים שלך
FB_EMAIL=your@email.com
FB_PASSWORD=your_password

# בהתחלה השאר את זה false!
ENABLE_AUTO_POSTING=false
\`\`\`

---

## ▶️ הפעלה

פתח **2 חלונות Terminal**:

**Terminal 1 - Backend:**
\`\`\`bash
npm run dev
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd client
npm run dev
\`\`\`

פתח דפדפן: **http://localhost:5173** 🎉

---

## 📚 המשך קריאה

| קובץ | מה יש בפנים |
|------|-------------|
| **[QUICK_START.md](./QUICK_START.md)** | 📖 מדריך מלא צעד-אחר-צעד |
| **[EXAMPLES.md](./EXAMPLES.md)** | 💡 דוגמאות שימוש ב-API |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | 🔧 פתרון בעיות |
| **[README.md](./README.md)** | 📘 תיעוד מלא של המערכת |

---

## ✅ מה הלאה?

1. ✅ וודא שהשרת רץ והדשבורד נטען
2. 📝 הוסף נכס ראשון (ראה EXAMPLES.md)
3. 👥 הוסף קבוצות פייסבוק (ראה EXAMPLES.md)
4. 🚀 הפעל פרסום אוטומטי (אחרי שבדקת!)

---

## 🎯 זרימת עבודה מומלצת

\`\`\`
1. הוסף נכס למערכת
   ↓
2. המערכת יוצרת 10 פוסטים שונים
   ↓
3. המערכת מפרסמת בקבוצות רלוונטיות
   ↓
4. המערכת עוקבת אחרי תגובות
   ↓
5. אתה מקבל התראה על לידים חמים
   ↓
6. סוגר עסקה! 💰
\`\`\`

---

## ❓ שאלות נפוצות

### איך להוסיף נכס?
\`\`\`bash
curl -X POST http://localhost:3000/api/properties \\
  -H "Content-Type: application/json" \\
  -d '{
    "property": {
      "property_type": "דירה",
      "city": "תל אביב",
      "price": 2000000,
      "rooms": 4,
      "area_sqm": 100,
      "description": "דירה מעולה!"
    }
  }'
\`\`\`

לדוגמאות נוספות: [EXAMPLES.md](./EXAMPLES.md)

### איך להוסיף קבוצת פייסבוק?
\`\`\`sql
INSERT INTO fb_groups (name, url, category, target_cities, is_active)
VALUES (
  'נדל"ן תל אביב',
  'https://facebook.com/groups/123456',
  'כללי',
  ARRAY['תל אביב'],
  true
);
\`\`\`

### איך לראות סטטיסטיקות?
פתח: http://localhost:5173

או דרך API:
\`\`\`bash
curl http://localhost:3000/api/dashboard/stats
\`\`\`

### משהו לא עובד?
ראה: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🛠️ כלים שימושיים

\`\`\`bash
# בדיקת בריאות השרת
curl http://localhost:3000/health

# צפייה בלוגים
tail -f logs/combined.log

# מיגרציות מחדש
npm run db:migrate

# נתוני דמו
npm run db:seed
\`\`\`

---

## ⚠️ חשוב לדעת

1. **אל תפרסם אוטומטית** לפני שבדקת שהכל עובד
2. **התחל בפרסום מתון** - 10-20 פוסטים ליום
3. **עקוב אחרי החשבון** שלא ייחסם
4. **בדוק קבוצות** שמאפשרות פרסומים מסחריים
5. **גבה את מסד הנתונים** מדי פעם

---

## 🎓 למידה נוספת

### מבנה הפרויקט
\`\`\`
propel-ai/
├── src/               # Backend קוד
│   ├── modules/      # 7 מודולים עיקריים
│   ├── routes/       # API endpoints
│   └── types/        # TypeScript types
├── client/           # Frontend React
├── database/         # סכמת DB
└── scripts/          # סקריפטים עזר
\`\`\`

### API עיקרי
- `POST /api/properties` - הוסף נכס
- `GET /api/properties` - צפה בנכסים
- `GET /api/dashboard/stats` - סטטיסטיקות
- `GET /api/dashboard/hot-leads` - לידים חמים

מדריך מלא: [README.md](./README.md)

---

## 💪 מוכן?

\`\`\`bash
# התחל עכשיו!
npm run dev
\`\`\`

---

<div align="center">

**יש שאלות? קרא את [QUICK_START.md](./QUICK_START.md)** 📖

**בהצלחה! 🚀**

</div>
