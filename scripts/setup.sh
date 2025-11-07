#!/bin/bash

# Propel.AI - Setup Script
# סקריפט התקנה אוטומטי

echo "╔════════════════════════════════════════════════╗"
echo "║         🚀 Propel.AI - Setup Script 🚀        ║"
echo "║     מערכת אוטונומית לשיווק נדל״ן בפייסבוק     ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check Node.js
print_info "בודק Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js לא מותקן! אנא התקן מ: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
print_success "Node.js מותקן: $NODE_VERSION"

# Check PostgreSQL
print_info "בודק PostgreSQL..."
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL לא מותקן! אנא התקן מ: https://www.postgresql.org/"
    exit 1
fi
PSQL_VERSION=$(psql --version)
print_success "PostgreSQL מותקן: $PSQL_VERSION"

# Install Backend Dependencies
print_info "מתקין תלויות Backend..."
npm install
if [ $? -eq 0 ]; then
    print_success "תלויות Backend הותקנו בהצלחה"
else
    print_error "שגיאה בהתקנת תלויות Backend"
    exit 1
fi

# Install Frontend Dependencies
print_info "מתקין תלויות Frontend..."
cd client
npm install
if [ $? -eq 0 ]; then
    print_success "תלויות Frontend הותקנו בהצלחה"
else
    print_error "שגיאה בהתקנת תלויות Frontend"
    exit 1
fi
cd ..

# Create .env file if not exists
if [ ! -f .env ]; then
    print_info "יוצר קובץ .env..."
    cp .env.example .env
    print_success "קובץ .env נוצר - אנא ערוך אותו עם הפרטים שלך"
else
    print_info "קובץ .env כבר קיים"
fi

# Create logs directory
if [ ! -d "logs" ]; then
    mkdir logs
    print_success "תיקיית logs נוצרה"
fi

# Create uploads directory
if [ ! -d "uploads" ]; then
    mkdir uploads
    print_success "תיקיית uploads נוצרה"
fi

# Create screenshots directory
if [ ! -d "screenshots" ]; then
    mkdir screenshots
    print_success "תיקיית screenshots נוצרה"
fi

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║           ✅ ההתקנה הושלמה בהצלחה! ✅          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "📋 הצעדים הבאים:"
echo ""
echo "1️⃣  צור מסד נתונים PostgreSQL:"
echo "   createdb propel_ai"
echo ""
echo "2️⃣  הרץ מיגרציות:"
echo "   npm run db:migrate"
echo ""
echo "3️⃣  (אופציונלי) טען נתוני דמו:"
echo "   npm run db:seed"
echo ""
echo "4️⃣  ערוך את קובץ .env עם הפרטים שלך"
echo ""
echo "5️⃣  הפעל את השרת:"
echo "   npm run dev"
echo ""
echo "6️⃣  בטרמינל נפרד, הפעל את הממשק:"
echo "   cd client && npm run dev"
echo ""
echo "🌐 הדשבורד יהיה זמין ב: http://localhost:5173"
echo "🔧 ה-API יהיה זמין ב: http://localhost:3000"
echo ""
echo "📖 למדריך מלא: קרא את QUICK_START.md"
echo ""
