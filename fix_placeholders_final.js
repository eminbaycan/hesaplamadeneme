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
        
        let startIdx = 0;
        while ((startIdx = content.indexOf('<input', startIdx)) !== -1) {
            // Find the end of this input tag.
            // Since JSX can have => in onChange, we have to count { and } or just find "/>".
            // Luckily, React inputs are almost always self-closing `/>` or `>`.
            let endIdx = startIdx;
            let bracketCount = 0;
            let inString = false;
            let stringChar = '';
            
            for (let i = startIdx + 6; i < content.length; i++) {
                const char = content[i];
                if (!inString && (char === '"' || char === "'")) {
                    inString = true;
                    stringChar = char;
                } else if (inString && char === stringChar) {
                    inString = false;
                } else if (!inString && char === '{') {
                    bracketCount++;
                } else if (!inString && char === '}') {
                    bracketCount--;
                } else if (!inString && bracketCount === 0 && char === '>') {
                    endIdx = i;
                    break;
                }
            }
            
            if (endIdx > startIdx) {
                let inner = content.substring(startIdx + 6, endIdx);
                let pCount = (inner.match(/placeholder=/g) || []).length;
                if (pCount > 1) {
                    let newInner = inner.replace(/\s*placeholder="Örn: [^"]+"/, '');
                    content = content.substring(0, startIdx + 6) + newInner + content.substring(endIdx);
                    changed = true;
                }
            }
            
            startIdx++;
        }
        
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
console.log(`Fixed ${fixedFiles} files using AST-like parsing.`);
