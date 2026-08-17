import fs from 'fs';

let content = fs.readFileSync('src/data/tools.ts', 'utf8');

// The array starts with `export const tools: Tool[] = [`
// We can just find that and change it.

content = content.replace('export const tools: Tool[] = [', 'const allTools: Tool[] = [');

// Then replace `];` followed by `export const sortedTools`
content = content.replace(/\];\s*export const sortedTools = \[\.\.\.tools\]/g, '];\n\nexport const tools = allTools.filter(t => Boolean(t.component));\n\nexport const sortedTools = [...tools]');

fs.writeFileSync('src/data/tools.ts', content, 'utf8');
