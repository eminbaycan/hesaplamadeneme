import fs from 'fs';
import path from 'path';

// Files and their states to empty out
const stateToEmpty = {
    'FaktoriyelHesaplama.tsx': ['numInput'],
    'HacimHesaplama.tsx': ['valA', 'valB', 'valC'],
    'IncHesaplama.tsx': ['inputValue', 'screenInch'],
    'KokluSayiHesaplama.tsx': ['radicand', 'degree', 'simplifyInput', 'opNum1', 'opNum2'],
    'KombinasyonHesaplama.tsx': ['nInput', 'rInput'],
    'MetrekareHesaplama.tsx': ['width', 'length', 'lW1', 'lL1', 'lW2', 'lL2', 'radius', 'triBase', 'triHeight', 'paintCoverage', 'paintCoats', 'tileWaste'],
    'MilHesaplama.tsx': ['inputValue', 'speedVal'],
    'ModularAritmetikHesaplama.tsx': ['numA', 'modN', 'baseA', 'expB', 'modPowN', 'currentHour', 'addHours', 'targetDays'],
    'OranHesaplama.tsx': ['valA', 'valB', 'valC', 'simpNum1', 'simpNum2'],
    'PermutasyonHesaplama.tsx': ['nInput', 'rInput'],
    'RastgeleSayiHesaplama.tsx': ['minInput', 'maxInput', 'countInput'],
    'SayiOkunusuHesaplama.tsx': ['numberInput'],
    'UsluSayiHesaplama.tsx': ['baseInput', 'exponentInput'],
    'KrediKartiAsgariHesaplama.tsx': ['kartLimiti'],
    'KiraArtisHesaplama.tsx': ['ozelOran'],
    'TasitKredisiHesaplama.tsx': ['vadeAy'],
    'KargoDesiHesaplama.tsx': ['adet'],
    'InternetFaturasiHesaplama.tsx': ['taahhutSuresi'],
    'BesGetiriHesaplama.tsx': ['beklenenGetiri'],
    // other rates like stopaj, kdv etc. usually make sense to have defaults or are dropdowns/buttons.
};

const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());

let updatedFiles = 0;

for (const cat of categories) {
    const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
    for (const file of files) {
        if (!stateToEmpty[file]) continue;
        
        const fullPath = path.join(toolsDir, cat, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        
        const states = stateToEmpty[file];
        let changed = false;
        
        for (const stateName of states) {
            // Match `const [stateName, setState] = useState<...>(number or string)`
            // We want to replace the initial value with `''`
            // Also need to be careful to extract the old value to put as placeholder in the input!
            
            const regex = new RegExp(`const\\s+\\[${stateName},\\s*\\w+\\]\\s*=\\s*useState(?:<[^>]+>)?\\((['"]?\\d+(?:\\.\\d+)?['"]?)\\)`);
            const match = content.match(regex);
            
            if (match) {
                const oldVal = match[1].replace(/['"]/g, ''); // get the raw number
                
                // Replace state init
                content = content.replace(regex, (m) => m.replace(match[1], "''"));
                
                // Now try to add placeholder to the corresponding input if it doesn't have one
                // We'll just look for `<input ... value={stateName}` or `onChange={(e) => setState(e.target.value)}`
                // and inject placeholder if missing. This is a bit tricky with regex.
                // A simpler way: just replace `value={stateName}` with `placeholder="${oldVal}" value={stateName}` 
                // ONLY IF placeholder doesn't exist near it.
                // Since JSX can be multiline, it's safer to just let the user see empty, or add placeholders.
                // Let's do a naive replace: find `<input` that contains `value={stateName}`
                // Actually, an input might already have a placeholder. Let's just blindly add placeholder={oldVal} if "placeholder=" is not in the same tag.
                
                // For simplicity, let's just do the state replacement first, which clears the default values.
                // Then let's add placeholder if we can.
                const inputRegex = new RegExp(`<input([^>]+value={${stateName}}[^>]*)>`, 'g');
                content = content.replace(inputRegex, (m, inner) => {
                    if (!inner.includes('placeholder=')) {
                        return `<input placeholder="Örn: ${oldVal}"${inner}>`;
                    }
                    return m;
                });
                
                changed = true;
            }
        }
        
        if (changed) {
            fs.writeFileSync(fullPath, content, 'utf8');
            updatedFiles++;
        }
    }
}

console.log(`Updated ${updatedFiles} files to empty default states.`);
