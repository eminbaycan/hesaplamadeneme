import fs from 'fs';
import path from 'path';

// 1. Revert title in tools.ts
let toolsTs = fs.readFileSync('src/data/tools.ts', 'utf8');
toolsTs = toolsTs.replace(
    /title:\s*'KDV Hesaplama 2026 - KDV Dahil ve Hariç Bulma Aracı',/g,
    "title: 'KDV Hesaplama',"
);
fs.writeFileSync('src/data/tools.ts', toolsTs, 'utf8');
console.log('Fixed KDV title in tools.ts');

// 2. Add SEO-friendly H1 titles to all tools
const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());

let h1Updated = 0;

for (const cat of categories) {
    const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
    for (const file of files) {
        const fullPath = path.join(toolsDir, cat, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Find current H1
        const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
        if (h1Match) {
            let innerText = h1Match[1];
            // Skip if it already contains 2026
            if (!innerText.includes('2026')) {
                const isHesaplama = innerText.toLowerCase().includes('hesaplama');
                const suffix = isHesaplama ? ' 2026 - Ücretsiz ve Hızlı Sonuçlar' : ' 2026 - Ücretsiz Araç';
                
                const newInnerText = `${innerText} ${suffix}`;
                content = content.replace(h1Match[0], h1Match[0].replace(innerText, newInnerText));
                fs.writeFileSync(fullPath, content, 'utf8');
                h1Updated++;
            }
        }
    }
}

console.log(`Updated H1 tags in ${h1Updated} files.`);
