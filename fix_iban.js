import fs from 'fs';

let toolsTs = fs.readFileSync('src/data/tools.ts', 'utf8');
toolsTs = toolsTs.replace(
    /keywords:\s*\['iban',\s*'finans',\s*'iban doğrulama',\s*'banka sorgulama',\s*'para transferi'\],/g,
    "keywords: ['iban', 'finans', 'iban doğrulama', 'banka sorgulama', 'para transferi', 'bankacılık'],"
);
fs.writeFileSync('src/data/tools.ts', toolsTs, 'utf8');
