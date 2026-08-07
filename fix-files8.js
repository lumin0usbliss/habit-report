const fs = require('fs');
let rm = fs.readFileSync('src/lib/reportMapping.ts', 'utf8');
rm = rm.replace('let selectedPair = pairs[0]', 'let selectedPair: typeof pairs[number] = pairs[0]');
fs.writeFileSync('src/lib/reportMapping.ts', rm, 'utf8');
