import fs from 'fs';
import path from 'path';

let toolsTs = fs.readFileSync('src/data/tools.ts', 'utf8');

// We can just parse tools.ts via a crude regex or dynamic import
// Let's just read the tools directly by running it through ts-node or just regex.
const toolsRegex = /id:\s*'([^']+)',[\s\S]*?title:\s*'([^']+)',[\s\S]*?description:\s*'([^']+)'[\s\S]*?categoryId:\s*'([^']+)'(?:,[\s\S]*?keywords:\s*\[(.*?)\])?/g;

let toolsList = [];
let match;
while ((match = toolsRegex.exec(toolsTs)) !== null) {
  let keywords = [];
  if (match[5]) {
    keywords = match[5].split(',').map(s => s.replace(/['"\s]/g, '')).filter(s => s.length > 0);
  }
  toolsList.push({
    id: match[1],
    title: match[2],
    description: match[3],
    categoryId: match[4],
    keywords: keywords,
  });
}

const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());
let failingTools = [];

for (const t of toolsList) {
  let foundFile = null;
  for (const cat of categories) {
      const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
      for (const file of files) {
          const content = fs.readFileSync(path.join(toolsDir, cat, file), 'utf8');
          if (content.includes(`currentToolId="${t.id}"`) || content.includes(`currentToolId='${t.id}'`)) {
              foundFile = { cat, file, content, path: path.join(toolsDir, cat, file) };
              break;
          }
      }
      if (foundFile) break;
  }
  
  if (!foundFile) {
      // try to match by path logic
      // skipped for now
      continue;
  }
  
  const content = foundFile.content;
  const wordCount = content.split(/\s+/).length;
  const hasDisclaimer = content.includes('<Disclaimer') || content.includes('Sorumluluk Reddi');
  const hasFAQ = content.includes('Sıkça Sorulan Sorular') || content.includes('SSS');
  const hasDescription = content.includes('Nedir ve Nasıl') || content.includes('Hakkında Her Şey') || content.includes('Nasıl Kullanılır');
  const hasFormula = content.includes('Kullanılan Formüller') || content.includes('Formülü:');
  const hasRelatedTools = content.includes('<RelatedTools');
  const hasValidSeoMeta = t.description.length >= 120 && t.description.length <= 160;
  const hasEnoughKeywords = t.keywords.length >= 6;
  
  const isAllGood = hasDisclaimer && hasFAQ && hasDescription && hasFormula && hasRelatedTools && hasValidSeoMeta && hasEnoughKeywords && wordCount >= 300;
  
  if (!isAllGood) {
      failingTools.push({
          id: t.id,
          title: t.title,
          file: foundFile.path,
          reasons: {
              wordCount: wordCount < 300 ? wordCount : 'OK',
              hasDisclaimer,
              hasFAQ,
              hasDescription,
              hasFormula,
              hasRelatedTools,
              hasValidSeoMeta: hasValidSeoMeta ? 'OK' : t.description.length,
              hasEnoughKeywords: hasEnoughKeywords ? 'OK' : t.keywords.length,
          }
      });
  }
}

console.log(`Found ${failingTools.length} failing tools.`);
for(let i=0; i<Math.min(5, failingTools.length); i++) {
    console.log(JSON.stringify(failingTools[i], null, 2));
}

