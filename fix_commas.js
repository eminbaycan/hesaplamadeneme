import fs from 'fs';

let content = fs.readFileSync('src/data/tools.ts', 'utf8');

// Fix double commas
// e.g. "component: AltinOranHesaplama,\n  ,\n    updatedAt:"
// We can just replace ",\n  ," with ","
content = content.replace(/,\n\s*,/g, ',');

fs.writeFileSync('src/data/tools.ts', content, 'utf8');
