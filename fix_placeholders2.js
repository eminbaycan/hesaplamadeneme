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
        
        // Find ALL placeholders and remove the injected ones if there are two.
        // Actually, let's just find `placeholder="Örn: X"` and remove it if there's another placeholder in the same `<input...>` block.
        // Better: let's just remove the injected `placeholder="Örn: [\d.]+"` IF it occurs right after `<input `
        // Because my injection did: `<input placeholder="Örn: 10"`
        
        // Let's just find the exact string injection pattern and remove it IF the rest of the tag has another placeholder.
        const tagPattern = /<input([^>]+)>/g;
        content = content.replace(tagPattern, (m, inner) => {
            let pCount = (inner.match(/placeholder=/g) || []).length;
            if (pCount > 1) {
                let newInner = inner.replace(/placeholder="Örn: [^"]+"\s*/, '');
                changed = true;
                return `<input${newInner}>`;
            }
            return m;
        });
        
        // Another common type issue: `const [taahhutSuresi, setTaahhutSuresi] = useState<number>('')`
        // We already tried replacing `useState<number>('')` but it might be `useState<number | ''>('')` which is fine.
        // Let's manually replace the InternetFaturasiHesaplama one.
        if (file === 'InternetFaturasiHesaplama.tsx') {
            content = content.replace(/useState<number>\(''\)/g, "useState<number | ''>('')");
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(fullPath, content, 'utf8');
            fixedFiles++;
        }
    }
}
console.log(`Fixed ${fixedFiles} files (pass 2).`);
