import fs from 'fs';

let content = fs.readFileSync('src/data/tools.ts', 'utf8');

// Fix trailing comma formats and formatting issues
content = content.replace(/,\s*updatedAt:\s*'([^']+)'\s*,\s*version:\s*'([^']+)'\s*}/g, ',\n    updatedAt: \'$1\',\n    version: \'$2\'\n  }');
fs.writeFileSync('src/data/tools.ts', content, 'utf8');
