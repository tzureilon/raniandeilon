# 🔐 Facebook Setup - הגדרות פייסבוק

## ⚠️ אבטחה חשובה!

פרטי הפייסבוק **נשמרים רק** בקובץ `.env` ו**לעולם לא** ב-Git!

הקובץ `.env` נמצא ב-`.gitignore` ולא יועלה לריפו.

---

## ✅ הגדרה הושלמה!

פרטי ההתחברות לפייסבוק הוגדרו בהצלחה בקובץ `.env`.

### מיקום הפרטים:
```
/home/user/raniandeilon/.env
```

### מה מוגדר:
- ✅ `FB_EMAIL` - כתובת המייל לפייסבוק
- ✅ `FB_PASSWORD` - סיסמת הפייסבוק
- ✅ `ENABLE_AUTO_POSTING=true` - פרסום אוטומטי מופעל

---

## 🚀 הפעלת המערכת

המערכת עכשיו מוכנה לפרסם בפייסבוק עם הפרטים האמיתיים!

### שלבים:

1. **הפעל את השרת:**
   ```bash
   npm run dev
   ```

2. **המערכת תתחבר לפייסבוק אוטומטית**

3. **תתחיל לפרסם פוסטים ממתינים**

---

## ⚠️ דרישות טכניות

### Chrome/Chromium נדרש:

הפרסום בפייסבוק משתמש ב-Puppeteer שדורש דפדפן Chrome.

**התקנה:**

Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install chromium-browser
```

Mac:
```bash
brew install chromium
```

Windows:
```bash
# הורד Chrome מ-
https://www.google.com/chrome/
```

---

## 🔍 בדיקת פרסום

### צור פוסט בדיקה:

```bash
psql -d propel_ai -c "
INSERT INTO posts (property_id, group_id, post_text, scheduled_at, status)
VALUES (1, 1, '🏠 דירה מדהימה בנתניה! בדיקה', NOW(), 'pending');
"
```

### עקוב אחרי הלוגים:

```bash
tail -f logs/app.log | grep fb_publisher
```

תראה:
```
[fb_publisher] Initializing browser
[fb_publisher] Logging in to Facebook
[fb_publisher] Logged in successfully
[fb_publisher] Publishing post
[fb_publisher] Post published successfully
```

---

## 📊 מה קורה ברקע?

1. **Scheduler** בודק פוסטים ממתינים כל 5 דקות
2. **FbPublisher** מתחיל Puppeteer
3. פותח Chrome בצורה לא גלויה (headless)
4. ניווט ל-`facebook.com/login`
5. מתחבר עם הפרטים מ-`.env`
6. ניווט לקבוצת הפייסבוק
7. הקלדת הפוסט בצורה דמוית אדם
8. לחיצה על כפתור "פרסם"
9. עדכון בבסיס הנתונים: `status='posted'`

---

## 🛡️ אבטחה

### מה מוגן:

- ✅ `.env` ב-`.gitignore` - לא יועלה ל-Git
- ✅ סיסמאות מוצפנות בזיכרון
- ✅ אין הדפסה של פרטים ללוגים
- ✅ חיבור מאובטח לפייסבוק

### אל תשתף:

- ❌ אל תשתף את קובץ `.env`
- ❌ אל תעלה אותו ל-GitHub
- ❌ אל תשלח אותו בטלגרם/מייל
- ❌ אל תצלם מסך שלו

---

## 🔄 שינוי פרטים

אם תרצה לשנות את פרטי ההתחברות:

```bash
nano .env

# ערוך את השורות:
FB_EMAIL=your_new_email@gmail.com
FB_PASSWORD=your_new_password

# הפעל מחדש:
npm run dev
```

---

## ⚡ פתרון בעיות

### "Login failed"
- בדוק את פרטי ההתחברות ב-`.env`
- נסה להתחבר ידנית לפייסבוק כדי לוודא שהחשבון לא נחסם
- אם יש אימות דו-שלבי, ייתכן שתצטרך להשבית אותו

### "Browser not initialized"
- ודא ש-Chrome/Chromium מותקן
- בדוק גרסת Puppeteer: `npm list puppeteer`

### "No pending posts"
- צור פוסט חדש עם `scheduled_at <= NOW()`
- ודא ש-`ENABLE_AUTO_POSTING=true`

---

<div align="center">

**🔐 פרטי הפייסבוק מאובטחים ומוכנים!**

**המערכת יכולה עכשיו לפרסם בפייסבוק אוטומטית! 🚀**

</div>
