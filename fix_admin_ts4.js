import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminStatusCheck.tsx', 'utf8');
content = content.replace(
  /hasFormula: fileContent\.includes\('Kullanılan Formüller'\) \|\| fileContent\.includes\('Formülü:'\),/g,
  "hasFormula: fileContent.includes('Kullanılan Formüller') || fileContent.includes('Formülü:'),\n          hasValidSeoMeta: (tool.description?.length >= 120 && tool.description?.length <= 160),\n          wordCount: fileContent.split(/\\s+/).length,"
);

fs.writeFileSync('src/pages/AdminStatusCheck.tsx', content, 'utf8');
