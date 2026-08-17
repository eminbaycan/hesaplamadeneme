import fs from 'fs';

let content = fs.readFileSync('src/data/tools.ts', 'utf8');

content = content.replace(/id:\s*'arac-vergisi-mtv-hesaplama'/g, "id: 'mtv-hesaplama'");
content = content.replace(/path:\s*'\/finans\/arac-vergisi-mtv-hesaplama'/g, "path: '/finans/mtv-hesaplama'");

fs.writeFileSync('src/data/tools.ts', content, 'utf8');

// Also update the React component file's RelatedTools reference
let componentContent = fs.readFileSync('src/tools/finans/AracVergisiMTVHesaplama.tsx', 'utf8');
componentContent = componentContent.replace(/currentToolId="arac-vergisi-mtv-hesaplama"/g, 'currentToolId="mtv-hesaplama"');
fs.writeFileSync('src/tools/finans/AracVergisiMTVHesaplama.tsx', componentContent, 'utf8');
