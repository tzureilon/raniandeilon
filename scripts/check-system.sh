#!/bin/bash

# Propel.AI System Check Script
# סקריפט בדיקת תקינות המערכת

echo "╔════════════════════════════════════════════════╗"
echo "║      🔍 Propel.AI - System Check 🔍          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Function to print status
print_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ((ERRORS++))
    fi
}

print_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  בודק מבנה קבצים..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Backend files
[ -f "package.json" ] && print_check 0 "package.json קיים" || print_check 1 "package.json חסר"
[ -f "tsconfig.json" ] && print_check 0 "tsconfig.json קיים" || print_check 1 "tsconfig.json חסר"
[ -f ".env.example" ] && print_check 0 ".env.example קיים" || print_check 1 ".env.example חסר"
[ -f ".gitignore" ] && print_check 0 ".gitignore קיים" || print_check 1 ".gitignore חסר"
[ -f "nodemon.json" ] && print_check 0 "nodemon.json קיים" || print_check 1 "nodemon.json חסר"

# Check directories
[ -d "src" ] && print_check 0 "תיקיית src קיימת" || print_check 1 "תיקיית src חסרה"
[ -d "src/modules" ] && print_check 0 "תיקיית src/modules קיימת" || print_check 1 "תיקיית src/modules חסרה"
[ -d "src/routes" ] && print_check 0 "תיקיית src/routes קיימת" || print_check 1 "תיקיית src/routes חסרה"
[ -d "src/config" ] && print_check 0 "תיקיית src/config קיימת" || print_check 1 "תיקיית src/config חסרה"
[ -d "database" ] && print_check 0 "תיקיית database קיימת" || print_check 1 "תיקיית database חסרה"
[ -d "client" ] && print_check 0 "תיקיית client קיימת" || print_check 1 "תיקיית client חסרה"
[ -d "logs" ] && print_check 0 "תיקיית logs קיימת" || print_check 1 "תיקיית logs חסרה"
[ -d "uploads" ] && print_check 0 "תיקיית uploads קיימת" || print_check 1 "תיקיית uploads חסרה"
[ -d "screenshots" ] && print_check 0 "תיקיית screenshots קיימת" || print_check 1 "תיקיית screenshots חסרה"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  בודק קבצי Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Backend source files
[ -f "src/index.ts" ] && print_check 0 "src/index.ts" || print_check 1 "src/index.ts חסר"
[ -f "src/config/database.ts" ] && print_check 0 "src/config/database.ts" || print_check 1 "src/config/database.ts חסר"
[ -f "src/utils/logger.ts" ] && print_check 0 "src/utils/logger.ts" || print_check 1 "src/utils/logger.ts חסר"

# Check modules
MODULES=("assets_ingest" "content_generator" "scheduler" "fb_publisher" "fb_listener" "crm_manager" "alert_system")
for module in "${MODULES[@]}"; do
    [ -f "src/modules/$module.ts" ] && print_check 0 "src/modules/$module.ts" || print_check 1 "src/modules/$module.ts חסר"
done

# Check routes
ROUTES=("properties" "dashboard" "leads")
for route in "${ROUTES[@]}"; do
    [ -f "src/routes/$route.ts" ] && print_check 0 "src/routes/$route.ts" || print_check 1 "src/routes/$route.ts חסר"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  בודק קבצי Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

[ -f "client/package.json" ] && print_check 0 "client/package.json" || print_check 1 "client/package.json חסר"
[ -f "client/tsconfig.json" ] && print_check 0 "client/tsconfig.json" || print_check 1 "client/tsconfig.json חסר"
[ -f "client/vite.config.ts" ] && print_check 0 "client/vite.config.ts" || print_check 1 "client/vite.config.ts חסר"
[ -f "client/index.html" ] && print_check 0 "client/index.html" || print_check 1 "client/index.html חסר"
[ -f "client/src/App.tsx" ] && print_check 0 "client/src/App.tsx" || print_check 1 "client/src/App.tsx חסר"
[ -f "client/src/main.tsx" ] && print_check 0 "client/src/main.tsx" || print_check 1 "client/src/main.tsx חסר"

# Check Frontend components
[ -f "client/src/components/Sidebar.tsx" ] && print_check 0 "Sidebar component" || print_check 1 "Sidebar component חסר"
[ -f "client/src/components/Card.tsx" ] && print_check 0 "Card component" || print_check 1 "Card component חסר"
[ -f "client/src/components/Button.tsx" ] && print_check 0 "Button component" || print_check 1 "Button component חסר"

# Check Frontend pages
PAGES=("Dashboard" "Properties" "PropertyForm" "Leads" "Groups" "Reports" "Settings")
for page in "${PAGES[@]}"; do
    [ -f "client/src/pages/$page.tsx" ] && print_check 0 "$page page" || print_check 1 "$page page חסר"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  בודק תלויות..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "node_modules" ]; then
    print_check 0 "Backend node_modules מותקן"
else
    print_warn "Backend node_modules לא מותקן - הרץ: npm install"
fi

if [ -d "client/node_modules" ]; then
    print_check 0 "Frontend node_modules מותקן"
else
    print_warn "Frontend node_modules לא מותקן - הרץ: cd client && npm install"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  בודק קבצי הגדרות..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env" ]; then
    print_check 0 "קובץ .env קיים"

    # Check required env vars
    if grep -q "DB_" .env; then
        print_check 0 "משתני DB מוגדרים"
    else
        print_warn "משתני DB חסרים ב-.env"
    fi

    if grep -q "FB_" .env; then
        print_check 0 "משתני FB מוגדרים"
    else
        print_warn "משתני FB חסרים ב-.env"
    fi
else
    print_warn "קובץ .env לא קיים - העתק מ-.env.example"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  בודק מסד נתונים..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

[ -f "database/schema.sql" ] && print_check 0 "schema.sql קיים" || print_check 1 "schema.sql חסר"
[ -f "scripts/migrate.js" ] && print_check 0 "migrate.js קיים" || print_check 1 "migrate.js חסר"
[ -f "scripts/seed.js" ] && print_check 0 "seed.js קיים" || print_check 1 "seed.js חסר"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  בודק תיעוד..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

[ -f "README.md" ] && print_check 0 "README.md" || print_check 1 "README.md חסר"
[ -f "START_HERE.md" ] && print_check 0 "START_HERE.md" || print_check 1 "START_HERE.md חסר"
[ -f "QUICK_START.md" ] && print_check 0 "QUICK_START.md" || print_check 1 "QUICK_START.md חסר"
[ -f "EXAMPLES.md" ] && print_check 0 "EXAMPLES.md" || print_check 1 "EXAMPLES.md חסר"
[ -f "TROUBLESHOOTING.md" ] && print_check 0 "TROUBLESHOOTING.md" || print_check 1 "TROUBLESHOOTING.md חסר"
[ -f "ARCHITECTURE.md" ] && print_check 0 "ARCHITECTURE.md" || print_check 1 "ARCHITECTURE.md חסר"
[ -f "client/README.md" ] && print_check 0 "client/README.md" || print_check 1 "client/README.md חסר"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 סיכום"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════╗"
    echo "║          ✅ כל הבדיקות עברו בהצלחה! ✅        ║"
    echo "║         המערכת מוכנה להפעלה! 🚀              ║"
    echo "╚════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo "📝 צעדים הבאים:"
    echo "   1. npm install              (אם לא הרצת)"
    echo "   2. cd client && npm install (אם לא הרצת)"
    echo "   3. cp .env.example .env     (אם .env לא קיים)"
    echo "   4. ערוך את .env עם הפרטים שלך"
    echo "   5. npm run db:migrate       (צור טבלאות)"
    echo "   6. npm run dev              (הפעל Backend)"
    echo "   7. cd client && npm run dev (הפעל Frontend)"
else
    echo -e "${RED}"
    echo "╔════════════════════════════════════════════════╗"
    echo "║        ⚠️  נמצאו $ERRORS שגיאות/אזהרות ⚠️         ║"
    echo "║          נא לתקן לפני הפעלה                   ║"
    echo "╚════════════════════════════════════════════════╝"
    echo -e "${NC}"
    exit 1
fi
