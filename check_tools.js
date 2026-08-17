import fs from 'fs';

const content = fs.readFileSync('src/data/tools.ts', 'utf8');
// Parse descriptions: we can use a quick regex or actually evaluate.
// Let's just run ts-node or similar. Wait, we can compile tools.ts using esbuild to commonjs or write a quick parser.
