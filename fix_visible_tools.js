import fs from 'fs';

// Instead of modifying every component, maybe we can just remove all stubs from `tools.ts`?
// Or we can modify `src/data/tools.ts` to export a `tools` array that ONLY contains implemented tools?
// If we remove them, they are gone forever. Wait, the user might want those stubs as a roadmap.
// Let's modify `tools.ts` to only export implemented tools as `tools`, or export `tools` but we add a filter.
// Wait, `export const tools: Tool[] = [...]` is hardcoded. 
// We can just add `.filter(t => t.component)` to the export!
// Oh, but `tools` is a constant array. Let's look at `src/data/tools.ts` end of file.

let content = fs.readFileSync('src/data/tools.ts', 'utf8');

const regex = /export const tools: Tool\[\] = \[\s*\{/g;
if (content.includes('export const tools: Tool[] = [')) {
    // Let's replace the array with an array, but wait, the array is big.
    // What if we rename the big array to `allTools` and then export `tools = allTools.filter(t => t.component)`?
    content = content.replace('export const tools: Tool[] = [', 'const allTools: Tool[] = [');
    
    // find the end of allTools array
    // Since we know what's at the end of the file:
    content = content.replace('];\n\nexport const sortedTools = [...tools]', '];\n\nexport const tools = allTools.filter(t => Boolean(t.component));\n\nexport const sortedTools = [...tools]');
    
    fs.writeFileSync('src/data/tools.ts', content, 'utf8');
}
