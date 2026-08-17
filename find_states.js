import fs from 'fs';
import path from 'path';

const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());

let filesWithNumbers = [];

for (const cat of categories) {
    const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
    for (const file of files) {
        const fullPath = path.join(toolsDir, cat, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Match things like `useState<number | ''>(100)` or `useState(100)` or `useState('100')`
        // Also look for `<input ... value={...}`
        let match;
        const stateRegex = /useState(?:<[^>]+>)?\((['"]?\d+(\.\d+)?['"]?)\)/g;
        let hasHardcodedState = false;
        
        while ((match = stateRegex.exec(content)) !== null) {
            // we should ignore 0 if it's an index, but usually states for numbers are >0 or 0
            // let's just log them all first
            hasHardcodedState = true;
        }
        
        if (hasHardcodedState) {
            filesWithNumbers.push(fullPath);
        }
    }
}
console.log(`Found ${filesWithNumbers.length} files with potential hardcoded states.`);
