import fs from 'fs';
import path from 'path';

const formulaMap = {
    'IbanDogrulama.tsx': 'IBAN Doğrulama Algoritması (MOD 97-10 ISO 7064): IBAN içindeki harfler sayısal değere çevrilir ve tüm dizi 97\'ye bölünür. Kalan 1 ise IBAN geçerlidir.',
    'KiraArtisOraniHesaplama.tsx': 'Kira Artışı = Mevcut Kira Tutarı × (TÜFE 12 Aylık Ortalama Oranı / 100)',
    'AracVergisiMTVHesaplama.tsx': 'Motorlu Taşıtlar Vergisi (MTV) = Aracın Yaşı ve Motor Silindir Hacmine (cm³) göre yasal tarifede belirlenen Yıllık Vergi Tutarı.',
    'SerbestMeslekMakbuzuHesaplama.tsx': 'Brüt Ücret = Net Ücret / 0.80 | Stopaj = Brüt × %20 | KDV = Brüt × %20 | Net Tahsilat = Brüt - Stopaj + KDV',
    'YillikIzinUcretiHesaplama.tsx': 'İzin Ücreti = (Günlük Brüt Ücret × Kullanılmayan İzin Günü) - (SGK Payı + Gelir Vergisi + Damga Vergisi)',
    'EnflasyonHesaplama.tsx': 'Gelecekteki Değer = Bugünkü Değer × (1 + (Yıllık Enflasyon Oranı / 100)) ^ Yıl',
    'MevduatFaiziHesaplama.tsx': 'Brüt Getiri = (Anapara × Faiz Oranı × Vade Gün Sayısı) / 36500 | Net Getiri = Brüt Getiri × (1 - Stopaj Oranı)',
    'VergiDilimiHesaplama.tsx': 'Ödenecek Gelir Vergisi = Kümülatif Vergi Matrahı × İçinde Bulunulan Dilimin Vergi Oranı (%) (Artan oranlı hesaplanır)',
    'KidemTazminatiHesaplama.tsx': 'Kıdem Tazminatı = (Son Brüt Maaş / 365) × Çalışılan Toplam Gün Sayısı - Damga Vergisi (%0.759)',
    'KrediKartiAsgariHesaplama.tsx': 'Asgari Ödeme = Dönem Borcu × %20 (Kredi limiti 25.000 TL altı ise) veya Dönem Borcu × %40 (Limiti 25.000 TL ve üstü ise)',
    'TapuHarciHesaplama.tsx': 'Alıcı Tapu Harcı = Satış Bedeli × %2 | Satıcı Tapu Harcı = Satış Bedeli × %2 | Toplam Harç = Satış Bedeli × %4',
    'BesGetiriHesaplama.tsx': 'BES Toplam Birikim = (Aylık Katkı Payı × Ödenen Ay Sayısı) + Devlet Katkısı (%30) + Fon Getiri Oranı',
    'AltinYatirimHesaplama.tsx': 'Altın Kâr/Zarar = (Güncel Satış Fiyatı × Gram/Adet) - (Alış Fiyatı × Gram/Adet)',
    'KriptoKarZararHesaplama.tsx': 'Kâr/Zarar = (Satış Fiyatı × Miktar - Satış Komisyonu) - (Alış Fiyatı × Miktar + Alış Komisyonu)',
    'TasitKredisiHesaplama.tsx': 'Aylık Taksit = Kredi Tutarı × [Faiz × (1 + Faiz)^Vade] / [(1 + Faiz)^Vade - 1] (Faiz oranına BSMV ve KKDF dahildir)',
    'KiraArtisHesaplama.tsx': 'Yeni Kira Bedeli = Mevcut Kira + (Mevcut Kira × Artış Oranı / 100)',
    'ZekatHesaplama.tsx': 'Zekat Tutarı = (Toplam Nakit + Altın/Gümüş Değeri + Ticari Mallar - Borçlar) × %2.5 (1/40) (Eğer toplam nisap miktarını geçiyorsa)',
    'RastgeleSayiHesaplama.tsx': 'Rastgele Sayı = Min + (Random(0,1) × (Max - Min))',
    'ModularAritmetikHesaplama.tsx': 'A ≡ R (mod M) ➔ A sayısının M sayısına bölümünden kalan R\'dir. (A = k × M + R)',
    'UsluSayiHesaplama.tsx': 'Üslü Sayı (a^n) = a × a × a × ... (Taban olan a sayısının, üs olan n kere kendisiyle çarpımı)',
    'OranHesaplama.tsx': 'Doğru Orantı (A / B = C / X) ➔ İçler Dışlar Çarpımı: X = (B × C) / A',
    'MilHesaplama.tsx': 'Kilometre (km) = Mil × 1.609344  |  Mil = Kilometre / 1.609344',
    'SayiOkunusuHesaplama.tsx': 'Sayısal değerin her üçlü basamak grubuna (Birler, Binler, Milyonlar vb.) ayrılması ve rakamların sözlüksel karşılıklarının birleştirilmesi algoritması.',
    'MetrekareHesaplama.tsx': 'Dikdörtgen/Kare için Alan (m²) = En (Metre) × Boy (Metre)',
    'StandartSapmaHesaplama.tsx': 'Örneklem Standart Sapması (σ) = √ [ ∑(x_i - μ)² / (N - 1) ] (Her değerin ortalamadan farkının karesinin toplamı / Eleman sayısı eksi 1)',
    'KpssPuanHesaplama.tsx': 'KPSS Puanı (P3 vb.) = Adayın Genel Kültür ve Genel Yetenek Net Sayısı × ÖSYM\'nin ilgili sınav yılı için belirlediği Standart Sapma ve Ağırlık Katsayıları'
};

const genericText = 'İlgili aracın evrensel hesaplama formülü arka planda otomatik uygulanmaktadır.';

let updatedFilesCount = 0;
const affectedToolIds = [];

// 1. Update TSX files
const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());

for (const cat of categories) {
    const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
    for (const file of files) {
        const fullPath = path.join(toolsDir, cat, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        
        if (content.includes(genericText)) {
            const specificFormula = formulaMap[file] || 'Hesaplama Formülü: Araç özelinde ilgili matematiksel formül kullanılmaktadır.';
            content = content.replace(genericText, specificFormula);
            fs.writeFileSync(fullPath, content, 'utf8');
            updatedFilesCount++;
            
            // Extract the tool's component name or deduce its ID
            const idMatch = file.replace('.tsx', '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
            affectedToolIds.push(idMatch);
            // also push raw file name as some IDs might differ slightly
            affectedToolIds.push(file.replace('.tsx', '').toLowerCase());
        }
    }
}
console.log(`Updated ${updatedFilesCount} tool files with specific formulas.`);

// 2. Update tools.ts versions and updatedAt
let toolsTs = fs.readFileSync('src/data/tools.ts', 'utf8');
const lines = toolsTs.split('\n');

const currentISO = new Date('2026-08-16T13:33:32-07:00').toISOString();

// To be safe and just bump versions for EVERYTHING that might have been updated,
// let's do a regex replace on the tools array. But we want to target only the updated ones.
// Actually, since the user said "listdeki tamam olanları yeniden güncelle, güncelleme versiyonlarına da işle", 
// and we know which ones we updated... 

// A robust way to parse and update tools.ts
// We'll search for the tools that had missing formulas in our array

for (let i = 0; i < affectedToolIds.length; i++) {
    // Some manual mappings for ID differences
    if (affectedToolIds[i] === 'serbest-meslek-makbuzu-hesaplama') affectedToolIds.push('serbest-meslek');
    if (affectedToolIds[i] === 'arac-vergisi-mtv-hesaplama') affectedToolIds.push('mtv-hesaplama');
    // We'll just look for id: 'something' that matches.
}

// Regex to find each tool block
const toolBlockRegex = /{\s*id:\s*'([^']+)'[^}]*}/g;
let newToolsTs = toolsTs.replace(toolBlockRegex, (match, id) => {
    let isAffected = affectedToolIds.some(affectedId => id.includes(affectedId) || affectedId.includes(id));
    if (isAffected) {
        // Update or add updatedAt
        let replaced = match;
        if (replaced.includes('updatedAt:')) {
            replaced = replaced.replace(/updatedAt:\s*'[^']+'/, `updatedAt: '${currentISO}'`);
        } else {
            replaced = replaced.replace(/}(\s*)$/, `, updatedAt: '${currentISO}' }`);
        }
        
        // Update or add version
        if (replaced.includes('version:')) {
            replaced = replaced.replace(/version:\s*'([^']+)'/, (m, v) => {
                let parts = v.split('.');
                parts[parts.length-1] = parseInt(parts[parts.length-1]) + 1;
                return `version: '${parts.join('.')}'`;
            });
        } else {
            replaced = replaced.replace(/}(\s*)$/, `, version: '1.0.1' }`);
        }
        
        return replaced;
    }
    return match;
});

fs.writeFileSync('src/data/tools.ts', newToolsTs, 'utf8');
console.log('Updated versions and dates in tools.ts.');
