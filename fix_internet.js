import fs from 'fs';

let content = fs.readFileSync('src/tools/finans/InternetFaturasiHesaplama.tsx', 'utf8');
content = content.replace(
    'const toplamMaliyet = aylikToplam * taahhutSuresi;',
    'const tSuresi = taahhutSuresi === \'\' ? 0 : Number(taahhutSuresi);\n    const toplamMaliyet = aylikToplam * tSuresi;'
);
fs.writeFileSync('src/tools/finans/InternetFaturasiHesaplama.tsx', content, 'utf8');
