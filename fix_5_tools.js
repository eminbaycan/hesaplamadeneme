import fs from 'fs';

// 1. Fix keywords in tools.ts for kdv-hesaplama
let toolsTs = fs.readFileSync('src/data/tools.ts', 'utf8');
toolsTs = toolsTs.replace(
    /keywords:\s*\['kdv',\s*'hesaplama',\s*'kdv dahil',\s*'kdv hariç',\s*'vergi'\],/g,
    "keywords: ['kdv', 'hesaplama', 'kdv dahil', 'kdv hariç', 'vergi', 'fatura'],"
);
fs.writeFileSync('src/data/tools.ts', toolsTs, 'utf8');

// 2. Fix missing formulas
const toolsToFix = [
    {
        file: 'src/tools/matematik/HacimHesaplama.tsx',
        formulaName: 'Hacim Hesaplama Formülü',
        formulaContent: 'Hacim = En × Boy × Yükseklik (veya ilgili geometrik cismin spesifik hacim formülü)'
    },
    {
        file: 'src/tools/matematik/IncHesaplama.tsx',
        formulaName: 'İnç - Santimetre Dönüşüm Formülü',
        formulaContent: '1 İnç = 2.54 Santimetre (cm)'
    },
    {
        file: 'src/tools/matematik/KombinasyonHesaplama.tsx',
        formulaName: 'Kombinasyon (C) Formülü',
        formulaContent: 'C(n, r) = n! / [r! × (n - r)!]'
    },
    {
        file: 'src/tools/matematik/KokluSayiHesaplama.tsx',
        formulaName: 'Kök Alma Formülü',
        formulaContent: '√x = y ➔ y² = x (Karekök için)'
    }
];

for (const tool of toolsToFix) {
    let content = fs.readFileSync(tool.file, 'utf8');
    
    // Check if it already has a formula
    if (!content.includes('Kullanılan Formüller') && !content.includes('Formülü:')) {
        const formulaHtml = `
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  ${tool.formulaName}: ${tool.formulaContent}
                </div>
              </div>
            </div>
          </div>
          `;
          
        // Inject before Sıkça Sorulan Sorular
        content = content.replace(
            /<section className="pt-4 border-t border-black\/5 dark:border-white\/5">/,
            formulaHtml + '\n          <section className="pt-4 border-t border-black/5 dark:border-white/5">'
        );
        fs.writeFileSync(tool.file, content, 'utf8');
        console.log(`Fixed formula for ${tool.file}`);
    }
}
