const fs = require('fs');
let rm = fs.readFileSync('src/lib/reportMapping.ts', 'utf8');
rm = rm.replace('import type { DimensionId } from "./scoring"', 'import type { DimensionId } from "@/data/scoring"');
fs.writeFileSync('src/lib/reportMapping.ts', rm, 'utf8');
