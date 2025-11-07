/**
 * Validate Imports Script
 * סקריפט לבדיקת imports בכל הקבצים
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Extract imports from TypeScript file
function extractImports(content) {
  const importRegex = /import\s+(?:{[^}]+}|[\w]+)\s+from\s+['"]([^'"]+)['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

// Resolve import path
function resolveImport(importPath, currentFile) {
  // External packages
  if (!importPath.startsWith('.')) {
    return null; // Skip external packages
  }

  const currentDir = path.dirname(currentFile);
  let resolved = path.resolve(currentDir, importPath);

  // Try with .ts extension
  if (!fileExists(resolved) && !fileExists(resolved + '.ts')) {
    if (!fileExists(resolved + '.tsx')) {
      // Try as directory with index
      if (!fileExists(path.join(resolved, 'index.ts'))) {
        if (!fileExists(path.join(resolved, 'index.tsx'))) {
          return false;
        }
      }
    }
  }

  return true;
}

// Check file for import errors
function checkFile(filePath) {
  if (!fileExists(filePath)) {
    errors.push(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const imports = extractImports(content);

  imports.forEach((importPath) => {
    const result = resolveImport(importPath, filePath);
    if (result === false) {
      errors.push(`${filePath}: Cannot resolve import '${importPath}'`);
    }
  });
}

// Get all TypeScript files
function getAllTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        getAllTsFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

console.log('🔍 מתחיל בדיקת imports...\n');

// Check Backend files
console.log('📦 בודק Backend files...');
const backendFiles = getAllTsFiles('src');
backendFiles.forEach(checkFile);
console.log(`   ✅ נבדקו ${backendFiles.length} קבצים\n`);

// Check Frontend files
console.log('🎨 בודק Frontend files...');
const frontendFiles = getAllTsFiles('client/src');
frontendFiles.forEach(checkFile);
console.log(`   ✅ נבדקו ${frontendFiles.length} קבצים\n`);

// Print results
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 תוצאות\n');

if (errors.length > 0) {
  console.log(`❌ נמצאו ${errors.length} שגיאות:\n`);
  errors.forEach((error) => {
    console.log(`   ❌ ${error}`);
  });
  console.log('');
  process.exit(1);
}

if (warnings.length > 0) {
  console.log(`⚠️  ${warnings.length} אזהרות:\n`);
  warnings.forEach((warning) => {
    console.log(`   ⚠️  ${warning}`);
  });
  console.log('');
}

console.log('✅ כל ה-imports תקינים!');
console.log(`   📁 סה"כ ${backendFiles.length + frontendFiles.length} קבצים נבדקו`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
