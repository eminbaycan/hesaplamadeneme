import fs from 'fs';

let content = fs.readFileSync('src/data/tools.ts', 'utf8');

// Replace the old stub completely, or just point it to the component.
// It's better to remove the old stub completely so we don't have duplicates.
// The old stub has id: 'mtv-hesaplama'. Let's find it and remove it.

const stubRegex = /\{\s*id:\s*'mtv-hesaplama'[\s\S]*?path:\s*'\/finans\/mtv-hesaplama',\s*\},/;
content = content.replace(stubRegex, '');

fs.writeFileSync('src/data/tools.ts', content, 'utf8');
