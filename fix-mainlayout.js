import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip AppRoutes.tsx and MainLayout.tsx
  if (filePath.includes('AppRoutes.tsx') || filePath.includes('MainLayout.tsx')) {
    return;
  }
  
  // Remove MainLayout import
  let newContent = content.replace(/import MainLayout from ['\"].*MainLayout['\"]\;(\r\n|\n)?/g, '');
  
  // Remove MainLayout wrapper with title prop
  newContent = newContent.replace(/<MainLayout\s+title=["'][^"']*["']\s*>([\s\S]*?)<\/MainLayout>/g, (match, p1) => {
    return `<div>${p1}</div>`;
  });
  
  // Remove simple MainLayout wrapper
  newContent = newContent.replace(/<MainLayout\s*>([\s\S]*?)<\/MainLayout>/g, (match, p1) => {
    return `<div>${p1}</div>`;
  });
  
  // Fix any double-wrapped divs that might have been created
  newContent = newContent.replace(/<div>\s*<div className="([^"]+)">/g, '<div className="$1">');
  newContent = newContent.replace(/<\/div>\s*<\/div>/g, '</div>');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Processed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') && !file.includes('AppRoutes') && !file.includes('MainLayout')) {
      processFile(filePath);
    }
  });
}

// Process all files in src directory
walkDir(path.join(__dirname, 'src')); 