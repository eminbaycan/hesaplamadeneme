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
        
        // Find <input placeholder="Örn: X" ... placeholder="Y"
        // This is safe: if a tag has two placeholders, we remove the first one.
        const inputRegex = /<input\s+placeholder="Örn: [^"]+"\s+([^>]+)>/g;
        content = content.replace(inputRegex, (m, rest) => {
            if (rest.includes('placeholder=')) {
                changed = true;
                return `<input ${rest}>`;
            }
            return m;
        });
        
        // Also fix the InternetFaturasi type
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
console.log(`Fixed ${fixedFiles} files (pass 3).`);
