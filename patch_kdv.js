import fs from 'fs';

let content = fs.readFileSync('src/data/tools.ts', 'utf8');
content = content.replace(
  "id: 'kdv-hesaplama',",
  "id: 'kdv-hesaplama',\n    component: KdvHesaplama,"
);
fs.writeFileSync('src/data/tools.ts', content, 'utf8');
