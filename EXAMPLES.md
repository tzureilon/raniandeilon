# 📝 דוגמאות שימוש - Propel.AI

## דוגמאות מעשיות לשימוש במערכת

---

## 1️⃣ הוספת נכס - דירה

\`\`\`bash
curl -X POST http://localhost:3000/api/properties \\
  -H "Content-Type: application/json" \\
  -d '{
    "property": {
      "property_type": "דירה",
      "city": "נתניה",
      "neighborhood": "קרית השרון",
      "street": "רחוב הרצל",
      "price": 1800000,
      "rooms": 4,
      "area_sqm": 110,
      "description": "דירה מרווחת ומוארת, משופצת כחדשה, קומה 3 מתוך 4, מעלית, מזגן מרכזי, מחסן וחניה",
      "status": "active",
      "available_from": "2024-12-01"
    },
    "images": [
      "https://example.com/living-room.jpg",
      "https://example.com/kitchen.jpg",
      "https://example.com/bedroom.jpg"
    ]
  }'
\`\`\`

---

## 2️⃣ הוספת נכס - בית פרטי

\`\`\`bash
curl -X POST http://localhost:3000/api/properties \\
  -H "Content-Type: application/json" \\
  -d '{
    "property": {
      "property_type": "בית פרטי",
      "city": "קדימה צורן",
      "neighborhood": "קדימה",
      "price": 3200000,
      "rooms": 6,
      "area_sqm": 180,
      "description": "בית פרטי מדהים, 2 קומות, גינה 200 מ\"ר, בריכה, נוף פתוח",
      "status": "active"
    },
    "images": [
      "https://example.com/house-front.jpg",
      "https://example.com/garden.jpg"
    ]
  }'
\`\`\`

---

## 3️⃣ הוספת נכס - מגרש

\`\`\`bash
curl -X POST http://localhost:3000/api/properties \\
  -H "Content-Type: application/json" \\
  -d '{
    "property": {
      "property_type": "מגרש",
      "city": "אבן יהודה",
      "price": 1200000,
      "area_sqm": 500,
      "description": "מגרש למגורים באזור מבוקש, תב\"ע מאושרת, אפשרות לבניית 2 קומות",
      "status": "active"
    }
  }'
\`\`\`

---

## 4️⃣ קבלת כל הנכסים

\`\`\`bash
curl http://localhost:3000/api/properties
\`\`\`

**תגובה לדוגמה:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "property_type": "דירה",
      "city": "נתניה",
      "price": 1800000,
      "rooms": 4,
      "status": "active"
    }
  ]
}
\`\`\`

---

## 5️⃣ קבלת נכס ספציפי

\`\`\`bash
curl http://localhost:3000/api/properties/1
\`\`\`

---

## 6️⃣ עדכון נכס

\`\`\`bash
curl -X PUT http://localhost:3000/api/properties/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "price": 1750000,
    "description": "דירה מרווחת - מחיר הופחת!"
  }'
\`\`\`

---

## 7️⃣ שינוי סטטוס נכס (למכור, להשכיר)

\`\`\`bash
# נמכר
curl -X PATCH http://localhost:3000/api/properties/1/status \\
  -H "Content-Type: application/json" \\
  -d '{"status": "sold"}'

# הושכר
curl -X PATCH http://localhost:3000/api/properties/1/status \\
  -H "Content-Type: application/json" \\
  -d '{"status": "rented"}'

# להחזיר לפעיל
curl -X PATCH http://localhost:3000/api/properties/1/status \\
  -H "Content-Type: application/json" \\
  -d '{"status": "active"}'
\`\`\`

---

## 8️⃣ מחיקת נכס

\`\`\`bash
curl -X DELETE http://localhost:3000/api/properties/1
\`\`\`

---

## 9️⃣ קבלת סטטיסטיקות דשבורד

\`\`\`bash
curl http://localhost:3000/api/dashboard/stats
\`\`\`

**תגובה לדוגמה:**
\`\`\`json
{
  "success": true,
  "data": {
    "total_properties": 5,
    "active_properties": 4,
    "total_posts_today": 12,
    "total_leads_today": 8,
    "hot_leads_today": 3,
    "pending_posts": 15,
    "active_groups": 10
  }
}
\`\`\`

---

## 🔟 קבלת לידים חמים

\`\`\`bash
curl http://localhost:3000/api/dashboard/hot-leads?limit=10
\`\`\`

**תגובה לדוגמה:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fb_user_name": "יוסי כהן",
      "message_text": "מעוניין, אפשר פרטים נוספים?",
      "sentiment": "hot",
      "score": 85,
      "city": "נתניה",
      "property_type": "דירה",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

---

## 1️⃣1️⃣ קבלת ביצועי קבוצות

\`\`\`bash
curl http://localhost:3000/api/dashboard/group-performance
\`\`\`

---

## 1️⃣2️⃣ קבלת ביצועי נכסים

\`\`\`bash
curl http://localhost:3000/api/dashboard/property-performance
\`\`\`

---

## 1️⃣3️⃣ קבלת דוח שבועי

\`\`\`bash
curl http://localhost:3000/api/dashboard/weekly-report
\`\`\`

**תגובה לדוגמה:**
\`\`\`json
{
  "success": true,
  "data": {
    "daily": [
      {
        "date": "2024-01-15",
        "posts_published": 12,
        "leads_generated": 8,
        "hot_leads": 3
      }
    ],
    "totals": {
      "total_posts": 84,
      "total_leads": 56,
      "total_hot_leads": 21
    }
  }
}
\`\`\`

---

## 1️⃣4️⃣ קבלת המלצות לשיפור

\`\`\`bash
curl http://localhost:3000/api/dashboard/recommendations
\`\`\`

**תגובה לדוגמה:**
\`\`\`json
{
  "success": true,
  "data": [
    "📉 יש נכסים עם ביצועים חלשים - שקול לשנות את הניסוחים או התמונות",
    "⚡ תדירות הפרסום נמוכה - שקול להגדיל את מספר הפרסומים היומיים"
  ]
}
\`\`\`

---

## 1️⃣5️⃣ קבלת כל הלידים

\`\`\`bash
# כל הלידים
curl http://localhost:3000/api/leads

# לידים חדשים בלבד
curl http://localhost:3000/api/leads?status=new

# לידים שטופלו
curl http://localhost:3000/api/leads?status=contacted
\`\`\`

---

## 1️⃣6️⃣ עדכון סטטוס ליד

\`\`\`bash
curl -X PATCH http://localhost:3000/api/leads/1/status \\
  -H "Content-Type: application/json" \\
  -d '{"status": "contacted"}'
\`\`\`

**סטטוסים אפשריים:**
- `new` - ליד חדש
- `contacted` - יצרנו קשר
- `qualified` - ליד מוסמך
- `converted` - הפך ללקוח
- `lost` - איבדנו אותו

---

## 1️⃣7️⃣ שליחת תגובה לליד

\`\`\`bash
curl -X POST http://localhost:3000/api/leads/1/reply \\
  -H "Content-Type: application/json" \\
  -d '{
    "replyText": "היי! תודה על ההתעניינות. הנכס עדיין זמין. אשמח לתאם צפייה. מתי נוח לך?"
  }'
\`\`\`

---

## 🎯 דוגמאות SQL ישירות

### הוספת קבוצות פייסבוק

\`\`\`sql
-- קבוצה 1
INSERT INTO fb_groups (name, url, members_count, category, target_cities, is_active)
VALUES (
  'נדל"ן נתניה וסביבה',
  'https://www.facebook.com/groups/netanya123',
  15000,
  'כללי',
  ARRAY['נתניה', 'אבן יהודה', 'עמק חפר'],
  true
);

-- קבוצה 2
INSERT INTO fb_groups (name, url, members_count, category, target_cities, is_active)
VALUES (
  'דירות למכירה בשרון',
  'https://www.facebook.com/groups/sharon456',
  8000,
  'קונים',
  ARRAY['רעננה', 'כפר סבא', 'הוד השרון', 'רמת השרון'],
  true
);

-- קבוצה 3
INSERT INTO fb_groups (name, url, members_count, category, target_cities, is_active)
VALUES (
  'נדל"ן קדימה צורן',
  'https://www.facebook.com/groups/kadima789',
  5000,
  'כללי',
  ARRAY['קדימה צורן'],
  true
);
\`\`\`

---

### שאילתות שימושיות

\`\`\`sql
-- כמה נכסים יש לי?
SELECT status, COUNT(*)
FROM properties
GROUP BY status;

-- הלידים הכי חמים
SELECT * FROM leads
WHERE sentiment = 'hot'
ORDER BY score DESC
LIMIT 10;

-- איזה קבוצות הכי טובות?
SELECT
  g.name,
  COUNT(p.id) as total_posts,
  COUNT(l.id) as total_leads
FROM fb_groups g
LEFT JOIN posts p ON p.group_id = g.id
LEFT JOIN leads l ON l.post_id = p.id
WHERE g.is_active = true
GROUP BY g.id
ORDER BY total_leads DESC;

-- כמה פוסטים פורסמו היום?
SELECT COUNT(*)
FROM posts
WHERE DATE(posted_at) = CURRENT_DATE
AND status = 'posted';

-- מה הביצועים של כל נכס?
SELECT
  p.id,
  p.city,
  p.property_type,
  COUNT(po.id) as total_posts,
  COUNT(l.id) as total_leads
FROM properties p
LEFT JOIN posts po ON po.property_id = p.id
LEFT JOIN leads l ON l.property_id = p.id
GROUP BY p.id
ORDER BY total_leads DESC;
\`\`\`

---

## 💡 טיפים

### 1. בדיקת חיבור לשרת
\`\`\`bash
curl http://localhost:3000/health
\`\`\`

### 2. כל ה-API מחזיר JSON
תמיד תקבל תגובה בפורמט:
\`\`\`json
{
  "success": true/false,
  "data": {...} או "error": "..."
}
\`\`\`

### 3. קודי תגובה
- `200` - הצלחה
- `201` - נוצר בהצלחה
- `400` - שגיאה בקלט
- `404` - לא נמצא
- `500` - שגיאת שרת

---

## 🚀 נתקעת?

1. בדוק את הלוגים: `tail -f logs/combined.log`
2. בדוק שהשרת רץ: `curl http://localhost:3000/health`
3. בדוק את הטבלה system_logs במסד הנתונים

---

<div align="center">

**זקוק לעזרה נוספת? שאל! 💪**

</div>
