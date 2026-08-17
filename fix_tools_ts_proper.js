import fs from 'fs';

let content = fs.readFileSync('src/data/tools.ts', 'utf8');
const lines = content.split('\n');
console.log("LINES 1690-1720:");
for(let i=1690; i<=1720; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
