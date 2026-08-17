import fs from 'fs';
import path from 'path';

// 1. Check tools.ts descriptions
const toolsContent = fs.readFileSync('src/data/tools.ts', 'utf8');
const descriptionRegex = /id:\s*'([^']+)',[\s\S]*?title:\s*'([^']+)',[\s\S]*?description:\s*'([^']+)'/g;
const tools = [];
let match;
while ((match = descriptionRegex.exec(toolsContent)) !== null) {
  tools.push({ id: match[1], title: match[2], description: match[3], descLength: match[3].length });
}

console.log('--- DESCRIPTION LENGTHS ---');
const badDescriptions = tools.filter(t => t.descLength < 100 || t.descLength > 160);
console.log(`Found ${badDescriptions.length} tools with bad description lengths.`);
for (const t of badDescriptions.slice(0, 5)) {
  console.log(`${t.id}: ${t.descLength} chars -> ${t.description}`);
}

// 2. Check tool files for word count and content sections
const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());
let badFiles = [];

for (const cat of categories) {
  const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
  for (const file of files) {
    const fullPath = path.join(toolsDir, cat, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Strip code blocks and imports to estimate words? 
    // Or just count all words in the file as a rough estimate.
    // For "Sayfa İçi Metin İçeriği", they mean the rendered text, but let's count words in strings inside the file maybe?
    // Let's just do a rough total word count of the file for now.
    const words = content.split(/\s+/).length;
    
    // Also check for specific sections in the text
    const hasNasılKullanılır = /Nasıl Kullanılır/i.test(content);
    const hasNedir = /Nedir( ve Nasıl Hesaplanır)?/i.test(content) || /Nasıl Hesaplanır/i.test(content);
    const hasFAQ = /Sıkça Sorulan Sorular/i.test(content) || /SSS/i.test(content);
    
    if (words < 250 || !hasNasılKullanılır || !hasNedir || !hasFAQ) {
      badFiles.push({ file: `${cat}/${file}`, words, hasNasılKullanılır, hasNedir, hasFAQ });
    }
  }
}

console.log('\n--- BAD TOOL FILES ---');
console.log(`Found ${badFiles.length} files missing sections or < 250 words.`);
for (const f of badFiles.slice(0, 10)) {
  console.log(f);
}

