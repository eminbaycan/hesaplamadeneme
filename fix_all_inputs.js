import fs from 'fs';
import path from 'path';

const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());

let updatedFiles = 0;

for (const cat of categories) {
    const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
    for (const file of files) {
        const fullPath = path.join(toolsDir, cat, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        let changed = false;
        
        // Find all useState with a number or string number
        // e.g. const [tutar, setTutar] = useState<number | ''>(500);
        // or const [tutar, setTutar] = useState('500');
        const stateRegex = /const\s+\[([^,]+),\s*\w+\]\s*=\s*useState(?:<([^>]+)>)?\((['"]?\d+(?:\.\d+)?['"]?)\)/g;
        
        let match;
        // Collect matches first because modifying content while looping regex is bad
        const matches = [];
        while ((match = stateRegex.exec(content)) !== null) {
            matches.push(match);
        }
        
        for (const m of matches) {
            const stateName = m[1].trim();
            const typeDef = m[2];
            const oldValStr = m[3];
            const oldValNum = oldValStr.replace(/['"]/g, '');
            
            // Exclude fixed configuration rates/types that make sense to be pre-filled
            const excludeList = ['oran', 'kdv', 'stopaj', 'tab', 'index', 'aktivite', 'taahhut', 'sure'];
            if (excludeList.some(ex => stateName.toLowerCase().includes(ex))) {
                continue;
            }
            // Exclude 0 or 1 if it might be an index, unless it's a known numeric input
            // Actually, any number input should probably be empty. Let's just allow it for anything that doesn't sound like a config.
            
            // Replace in file
            // Make sure the type allows string '' if it's currently a number
            // if typeDef is `number` and oldValStr is a number, we should change it to `number | ''`
            let newTypeStr = '';
            if (typeDef === 'number') {
                newTypeStr = '<number | \'\'>';
            } else if (typeDef) {
                newTypeStr = `<${typeDef}>`;
            }
            
            const regexToReplace = new RegExp(`const\\s+\\[${stateName},\\s*(\\w+)\\]\\s*=\\s*useState(?:<[^>]+>)?\\(${oldValStr}\\)`);
            content = content.replace(regexToReplace, `const [${stateName}, $1] = useState${newTypeStr}('')`);
            
            // Also try to add placeholder
            const inputRegex = new RegExp(`<input([^>]+value={${stateName}}[^>]*)>`, 'g');
            content = content.replace(inputRegex, (m2, inner) => {
                if (!inner.includes('placeholder=')) {
                    return `<input placeholder="Örn: ${oldValNum}"${inner}>`;
                }
                return m2;
            });
            
            changed = true;
        }
        
        if (changed) {
            fs.writeFileSync(fullPath, content, 'utf8');
            updatedFiles++;
        }
    }
}

console.log(`Updated ${updatedFiles} files automatically.`);
