import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminStatusCheck.tsx', 'utf8');
content = content.replace(
  /keywords:\s*tool\.keywords,\n\s*addedAt:\s*tool\.addedAt,/g,
  'hasValidSeoMeta: (tool.description?.length >= 120 && tool.description?.length <= 160),\n          wordCount: fileContent.split(/\\s+/).length,\n          keywords: tool.keywords,\n          addedAt: tool.addedAt,'
);

let content2 = fs.readFileSync('src/tools/finans/KrediKartiAsgariHesaplama.tsx', 'utf8');
// Replace the hardcoded string "50000" inside the input or state
content2 = content2.replace(/"50000"/g, "50000");
content2 = content2.replace(/'50000'/g, "50000");

fs.writeFileSync('src/pages/AdminStatusCheck.tsx', content, 'utf8');
fs.writeFileSync('src/tools/finans/KrediKartiAsgariHesaplama.tsx', content2, 'utf8');

