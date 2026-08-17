import fs from 'fs';
import path from 'path';

const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());

for (const cat of categories) {
    const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
    for (const file of files) {
        const fullPath = path.join(toolsDir, cat, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        
        const stateRegex = /const \[([^,]+),.*?useState(?:<([^>]+)>)?\((['"]?\d+(\.\d+)?['"]?)\)/g;
        let match;
        let findings = [];
        
        while ((match = stateRegex.exec(content)) !== null) {
            // Ignore 0 or 1 if it might be an active tab index
            if (match[1].toLowerCase().includes('tab') || match[1].toLowerCase().includes('index')) continue;
            findings.push({ stateName: match[1].trim(), type: match[2], value: match[3] });
        }
        
        if (findings.length > 0) {
            console.log(fullPath);
            findings.forEach(f => console.log(`  - ${f.stateName}: ${f.value} (${f.type || 'infer'})`));
        }
    }
}
