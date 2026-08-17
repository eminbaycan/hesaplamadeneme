import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminStatusCheck.tsx', 'utf8');

// The error happens because the error fallback pushes an object without `hasValidSeoMeta` and `wordCount`
content = content.replace(
  /hasDescription: false,/g,
  'hasDescription: false,\n            hasValidSeoMeta: false,\n            wordCount: 0,'
);

fs.writeFileSync('src/pages/AdminStatusCheck.tsx', content, 'utf8');

let content2 = fs.readFileSync('src/tools/finans/KrediKartiAsgariHesaplama.tsx', 'utf8');
content2 = content2.replace(
  /const \[krediLimiti, setKrediLimiti\] = useState<number \| ''>\('50000'\);/g,
  "const [krediLimiti, setKrediLimiti] = useState<number | ''>(50000);"
);
content2 = content2.replace(
  /setKrediLimiti\('50000'\);/g,
  "setKrediLimiti(50000);"
);
fs.writeFileSync('src/tools/finans/KrediKartiAsgariHesaplama.tsx', content2, 'utf8');
