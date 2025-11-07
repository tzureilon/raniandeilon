# 🎨 Propel.AI Frontend

ממשק משתמש מודרני ומקיף למערכת Propel.AI

---

## 🚀 התקנה והפעלה

\`\`\`bash
# התקנת תלויות
npm install

# הפעלה במצב פיתוח
npm run dev

# בנייה לפרודקשן
npm run build
\`\`\`

הממשק יהיה זמין ב: **http://localhost:5173**

---

## 📁 מבנה הפרויקט

\`\`\`
client/
├── src/
│   ├── components/          # רכיבים משותפים
│   │   ├── Sidebar.tsx      # תפריט צד
│   │   ├── Card.tsx         # כרטיס
│   │   └── Button.tsx       # כפתור
│   │
│   ├── pages/               # דפים
│   │   ├── Dashboard.tsx    # דשבורד ראשי
│   │   ├── Properties.tsx   # ניהול נכסים
│   │   ├── PropertyForm.tsx # טופס נכס
│   │   ├── Leads.tsx        # ניהול לידים
│   │   ├── Groups.tsx       # קבוצות פייסבוק
│   │   ├── Reports.tsx      # דוחות וביצועים
│   │   └── Settings.tsx     # הגדרות
│   │
│   ├── services/            # שירותי API
│   │   └── api.ts           # קריאות API
│   │
│   ├── types/               # TypeScript Types
│   │   └── index.ts         # הגדרות טיפוסים
│   │
│   ├── App.tsx              # קומפוננטה ראשית + Routing
│   ├── App.css              # עיצוב כללי
│   └── main.tsx             # Entry point
│
├── index.html               # HTML Template
├── package.json             # Dependencies
└── vite.config.ts           # Vite Configuration
\`\`\`

---

## 📄 דפים במערכת

### 1. 📊 Dashboard
- סטטיסטיקות בזמן אמת
- לידים חמים אחרונים
- המלצות לשיפור
- **נתיב:** `/`

### 2. 🏠 Properties
- רשימת כל הנכסים
- פילטר לפי סטטוס (פעיל, נמכר, הושכר)
- עריכה ומחיקה מהירה
- שינוי סטטוס
- **נתיב:** `/properties`

### 3. ➕ PropertyForm
- הוספת נכס חדש
- עריכת נכס קיים
- טופס מלא עם ולידציה
- העלאת תמונות
- **נתיב:** `/properties/add` או `/properties/edit/:id`

### 4. 🎯 Leads
- ניהול לידים
- פילטר לפי סטטוס
- ניקוד סנטימנט
- שינוי סטטוס ליד
- **נתיב:** `/leads`

### 5. 👥 Groups
- ניהול קבוצות פייסבוק (בפיתוח)
- **נתיב:** `/groups`

### 6. 📈 Reports
- ביצועי קבוצות מובילות
- ביצועי נכסים מובילים
- טבלאות אנליטיקס
- **נתיב:** `/reports`

### 7. ⚙️ Settings
- הגדרות מערכת (בפיתוח)
- **נתיב:** `/settings`

---

## 🧩 רכיבים משותפים

### Sidebar
תפריט צד עם ניווט מלא:
- ניווט בין דפים
- סטטוס פעיל
- רספונסיבי
- אייקונים ברורים

### Card
כרטיס רכיב עם עיצוב מודרני:
\`\`\`tsx
<Card title="כותרת">
  <p>תוכן הכרטיס</p>
</Card>
\`\`\`

### Button
כפתור רב שימושי:
\`\`\`tsx
<Button
  variant="primary"   // primary, secondary, danger, success
  size="medium"       // small, medium, large
  onClick={() => {}}
>
  לחץ כאן
</Button>
\`\`\`

---

## 🔌 Services - קריאות API

### propertiesService
\`\`\`typescript
// קבלת כל הנכסים
const properties = await propertiesService.getAll();

// הוספת נכס
await propertiesService.create({ property, images });

// עדכון
await propertiesService.update(id, data);

// מחיקה
await propertiesService.delete(id);
\`\`\`

### dashboardService
\`\`\`typescript
// סטטיסטיקות
const stats = await dashboardService.getStats();

// לידים חמים
const leads = await dashboardService.getHotLeads(10);

// המלצות
const recs = await dashboardService.getRecommendations();
\`\`\`

### leadsService
\`\`\`typescript
// קבלת לידים
const leads = await leadsService.getAll('new');

// עדכון סטטוס
await leadsService.updateStatus(id, 'contacted');
\`\`\`

---

## 🎨 עיצוב ונושא

### צבעים עיקריים
- **Primary:** `#667eea` - סגול כחלחל
- **Secondary:** `#764ba2` - סגול כהה
- **Success:** `#51cf66` - ירוק
- **Danger:** `#ff6b6b` - אדום
- **Background:** `#f5f7fa` - אפור בהיר

### Gradients
\`\`\`css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
\`\`\`

### Typography
- Font Family: System fonts
- Direction: RTL (עברית)
- Responsive sizes

---

## 📱 רספונסיביות

המערכת מותאמת למובייל:
- **Desktop:** תפריט מלא (260px)
- **Mobile:** תפריט מצומצם (70px)
- **Breakpoint:** 768px

\`\`\`css
@media (max-width: 768px) {
  /* Mobile styles */
}
\`\`\`

---

## 🔄 State Management

כרגע המערכת משתמשת ב-React Hooks בלבד:
- `useState` - מצב מקומי
- `useEffect` - side effects
- `useNavigate` - ניווט
- `useParams` - פרמטרים מ-URL

עתידי: אפשר להוסיף Redux/Zustand אם צריך.

---

## 🚦 Routing

המערכת משתמשת ב-React Router v6:

\`\`\`tsx
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/properties" element={<Properties />} />
  <Route path="/properties/add" element={<PropertyForm />} />
  <Route path="/properties/edit/:id" element={<PropertyForm />} />
  <Route path="/leads" element={<Leads />} />
  <Route path="/groups" element={<Groups />} />
  <Route path="/reports" element={<Reports />} />
  <Route path="/settings" element={<Settings />} />
</Routes>
\`\`\`

---

## 🔧 הגדרות סביבה

צור קובץ `.env` ב-`client/`:

\`\`\`env
# API Base URL
VITE_API_URL=http://localhost:3000/api
\`\`\`

---

## 🐛 בעיות נפוצות

### הדפים לא נטענים
1. בדוק שה-Backend רץ על פורט 3000
2. בדוק את ה-API URL ב-.env
3. פתח Console (F12) וחפש שגיאות

### Routing לא עובד
1. ודא ש-react-router-dom מותקן
2. בדוק שיש `<Router>` סביב ה-App
3. נקה cache: Ctrl+Shift+R

### CSS לא מוצג
1. נקה cache
2. Rebuild: `npm run build`
3. בדוק שה-imports נכונים

---

## 🚀 פיתוח עתידי

### To-Do
- [ ] ניהול קבוצות פייסבוק מהממשק
- [ ] הגדרות מערכת
- [ ] העלאת תמונות ל-Cloudinary
- [ ] Dark Mode
- [ ] Multi-language support
- [ ] Charts וגרפים
- [ ] Drag & Drop למיון
- [ ] Infinite scroll
- [ ] PWA support

---

## 📚 טכנולוגיות

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router** - Routing
- **Axios** - HTTP Client
- **CSS3** - Styling

---

## 💡 טיפים

### אופטימיזציה
\`\`\`typescript
// השתמש ב-memo לקומפוננטות כבדות
const HeavyComponent = React.memo(() => {
  // ...
});

// Lazy loading לדפים
const Dashboard = lazy(() => import('./pages/Dashboard'));
\`\`\`

### Debugging
\`\`\`typescript
// הוסף console.log לראות מה קורה
console.log('Data:', data);

// React DevTools - מומלץ מאוד!
\`\`\`

---

## 🤝 תרומה

רוצה לתרום לפרונט-אנד?
1. צור רכיב חדש ב-`components/`
2. הוסף דף חדש ב-`pages/`
3. עדכן routing ב-`App.tsx`
4. הוסף route ב-`Sidebar.tsx`

---

<div align="center">

**נבנה עם ❤️ בישראל**

**Propel.AI Frontend &copy; 2024**

</div>
