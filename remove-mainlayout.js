import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Remove MainLayout import
  let newContent = content.replace(/import MainLayout from ['\"].*MainLayout['\"]\;(\r\n|\n)?/g, '');
  
  // Remove MainLayout wrapper
  newContent = newContent.replace(/<MainLayout[^>]*>([\s\S]*)<\/MainLayout>/g, (match, p1) => {
    // Return the content inside MainLayout wrapped in a div
    return `<div>${p1}</div>`;
  });
  
  fs.writeFileSync(filePath, newContent);
  console.log(`Processed: ${filePath}`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') && !file.includes('AppRoutes')) {
      processFile(filePath);
    }
  });
}

walkDir(path.join(__dirname, 'src', 'pages')); 