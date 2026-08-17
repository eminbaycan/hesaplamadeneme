import fs from 'fs';

let content = fs.readFileSync('src/data/tools.ts', 'utf8');

const regex = /\{\s*id:\s*'([^']+)',[\s\S]*?\}/g;
let match;
let stubs = [];
while ((match = regex.exec(content)) !== null) {
    if (!match[0].includes('component:')) {
        stubs.push(match[1]);
    }
}
console.log(`Found ${stubs.length} stubs missing components:`, stubs);
