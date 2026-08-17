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
        
        // Find inputs with two placeholders
        // Like <input placeholder="Örn: 5" placeholder="Sayı girin"
        // We will remove the one we added if there's another one.
        
        const inputRegex = /<input([^>]+)>/g;
        content = content.replace(inputRegex, (m, inner) => {
            const matches = [...inner.matchAll(/placeholder="[^"]+"/g)];
            if (matches.length > 1) {
                // Keep the second one (usually the original one) or first, wait.
                // Let's remove the one we added "Örn: <number>"
                let newInner = inner.replace(/placeholder="Örn: [\d.]+"\s*/, '');
                changed = true;
                return `<input${newInner}>`;
            }
            return m;
        });
        
        // Also InternetFaturasiHesaplama has type issue: Argument of type 'string' is not assignable to parameter of type 'number | (() => number)'.
        // Let's fix state types that don't allow ''
        const stateRegex = /useState(?:<number>)?\(''\)/g;
        if (stateRegex.test(content)) {
            content = content.replace(/useState(?:<number>)?\(''\)/g, "useState<number | ''>('')");
            changed = true;
        }
        
        if (changed) {
            fs.writeFileSync(fullPath, content, 'utf8');
            fixedFiles++;
        }
    }
}
console.log(`Fixed ${fixedFiles} files.`);
