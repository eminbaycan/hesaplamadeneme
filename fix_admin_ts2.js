import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminStatusCheck.tsx', 'utf8');

content = content.replace(
  /hasDescription: false,\s*hasFormula: false/g,
  'hasDescription: false,\n            hasValidSeoMeta: false,\n            wordCount: 0,\n            hasFormula: false'
);

content = content.replace(
  /hasDescription: boolean;\s*hasFormula: boolean;/g,
  'hasDescription: boolean;\n  hasValidSeoMeta: boolean;\n  wordCount: number;\n  hasFormula: boolean;'
);

content = content.replace(
  /hasDescription: tool.hasDescription,\s*hasFormula: tool.hasFormula/g,
  'hasDescription: tool.hasDescription,\n            hasValidSeoMeta: (tool.description?.length >= 120 && tool.description?.length <= 160),\n            wordCount: 0,\n            hasFormula: tool.hasFormula'
);


fs.writeFileSync('src/pages/AdminStatusCheck.tsx', content, 'utf8');
