import fs from 'fs';

let content = fs.readFileSync('src/data/tools.ts', 'utf8');

// The weird strings look like: `    version: '1.0.1'  , updatedAt: '2026-08-16T20:33:32.000Z' },`
// Another variant could be `, updatedAt: '2026-08-16T20:33:32.000Z' , version: '1.0.1' },`

// Let's just fix all of them to be properly formatted inside the block
content = content.replace(/,\s*version:\s*'([^']+)'\s*,\s*updatedAt:\s*'([^']+)'\s*},/g, ',\n    version: \'$1\',\n    updatedAt: \'$2\'\n  },');
content = content.replace(/,\s*updatedAt:\s*'([^']+)'\s*,\s*version:\s*'([^']+)'\s*},/g, ',\n    updatedAt: \'$1\',\n    version: \'$2\'\n  },');

// Check what else is broken
// Actually, earlier output showed:
//   , updatedAt: '2026-08-16T20:33:32.000Z' , version: '1.0.1' },
// wait, the error is at line 1714: error TS1005: ';' expected.
fs.writeFileSync('src/data/tools.ts', content, 'utf8');
