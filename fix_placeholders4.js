import fs from 'fs';
import path from 'path';

const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());

let fixedFiles = 0;

for (const cat of categories) {
    const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
    for (const file of files) {
        const fullPath = path.join(toolsDir, cat, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        let changed = false;
        
        // Split by `<input` and reassemble
        let parts = content.split('<input ');
        for(let i=1; i<parts.length; i++) {
            let part = parts[i];
            let endIdx = part.indexOf('>');
            if (endIdx > -1) {
                let inner = part.substring(0, endIdx);
                let pCount = (inner.match(/placeholder=/g) || []).length;
                if (pCount > 1) {
                    inner = inner.replace(/placeholder="Örn: [^"]+"\s*/, '');
                    parts[i] = inner + part.substring(endIdx);
                    changed = true;
                }
            }
        }
        
        if (changed) {
            fs.writeFileSync(fullPath, parts.join('<input '), 'utf8');
            fixedFiles++;
        }
    }
}
console.log(`Fixed ${fixedFiles} files (pass 4).`);
