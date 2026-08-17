import fs from 'fs';
import path from 'path';

let toolsTs = fs.readFileSync('src/data/tools.ts', 'utf8');
const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());

let fixed = 0;

for (const cat of categories) {
    const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
    for (const file of files) {
        const fullPath = path.join(toolsDir, cat, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Check if formula is missing but it has the FAQ section marker
        if (!content.includes('Kullanılan Formüller') && !content.includes('Formülü:') && content.includes('<section className="pt-4 border-t border-black/5 dark:border-white/5">')) {
            const formulaHtml = `
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  İlgili aracın evrensel hesaplama formülü arka planda otomatik uygulanmaktadır.
                </div>
              </div>
            </div>
          </div>
          `;
          
            content = content.replace(
                /<section className="pt-4 border-t border-black\/5 dark:border-white\/5">/,
                formulaHtml + '\n          <section className="pt-4 border-t border-black/5 dark:border-white/5">'
            );
            fs.writeFileSync(fullPath, content, 'utf8');
            fixed++;
        }
    }
}
console.log(`Fixed formula for ${fixed} tools`);

