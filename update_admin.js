import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminStatusCheck.tsx', 'utf8');

// The tool description length comes from 'tools' array which we can import.
// Wait, AdminStatusCheck maps over `statuses` array. Where does statuses come from?
// It builds `statuses` by iterating over `tools` array!
content = content.replace(
  /hasDescription: boolean;/g,
  'hasDescription: boolean;\n  hasValidSeoMeta: boolean;\n  wordCount: number;'
);

content = content.replace(
  /hasDescription:\s*hasDescription,/g,
  `hasDescription: hasDescription,
            hasValidSeoMeta: (t.description?.length >= 120 && t.description?.length <= 160),
            wordCount: content.split(/\\s+/).length,`
);

content = content.replace(
  /const isAllGood = t.hasDisclaimer/g,
  `const isAllGood = t.hasDisclaimer && t.hasValidSeoMeta && t.wordCount >= 300`
);

content = content.replace(
  /const isAllGood = tool.hasDisclaimer/g,
  `const isAllGood = tool.hasDisclaimer && tool.hasValidSeoMeta && tool.wordCount >= 300`
);

fs.writeFileSync('src/pages/AdminStatusCheck.tsx', content, 'utf8');
