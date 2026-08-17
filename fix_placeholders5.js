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
        
        content = content.replace(/<input([^>]+)>/g, (match, inner) => {
            let pCount = (inner.match(/placeholder=/g) || []).length;
            if (pCount > 1) {
                // remove the specific one we added
                let newInner = inner.replace(/placeholder="Örn: [^"]+"\s*/, '');
                if (newInner !== inner) {
                    changed = true;
                    return `<input${newInner}>`;
                }
            }
            return match;
        });
        
        if (content.includes('useState<number>(\'\')')) {
            content = content.replace(/useState<number>\(''\)/g, "useState<number | ''>('')");
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(fullPath, content, 'utf8');
            fixedFiles++;
        }
    }
}
console.log(`Fixed ${fixedFiles} files (pass 5).`);
