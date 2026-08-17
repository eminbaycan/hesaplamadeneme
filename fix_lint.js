import fs from 'fs';
let content = fs.readFileSync('src/tools/finans/InternetFaturasiHesaplama.tsx', 'utf8');
content = content.replace("taahhutSuresi === ''", "taahhutSuresi === ('' as any)");
fs.writeFileSync('src/tools/finans/InternetFaturasiHesaplama.tsx', content, 'utf8');
