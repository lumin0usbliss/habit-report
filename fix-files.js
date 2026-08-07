const fs = require('fs');

// 1. qa/page.tsx
let qa = fs.readFileSync('src/app/qa/page.tsx', 'utf8');
qa = qa.replace('<Page12Blueprint />', '<Page12Blueprint reportData={reportData} />');
fs.writeFileSync('src/app/qa/page.tsx', qa, 'utf8');

// 2. result/page.tsx
let resultPage = fs.readFileSync('src/app/result/page.tsx', 'utf8');
resultPage = resultPage.replace('className="absolute top-[-9999px] left-[-9999px]"', 'className="absolute top-[-9999px] left-[-9999px] [&>div]:shadow-none [&>div]:border-none"');
fs.writeFileSync('src/app/result/page.tsx', resultPage, 'utf8');

// 3. ReportLayout.tsx
let rl = fs.readFileSync('src/components/report/ReportLayout.tsx', 'utf8');
rl = rl.replace('border border-[var(--color-hazzi-magenta)]/20 shadow-sm', 'shadow-[0_6px_24px_rgba(15,23,42,0.08)] print:shadow-none');
fs.writeFileSync('src/components/report/ReportLayout.tsx', rl, 'utf8');

// 4. Page02Combination.tsx
let p02 = fs.readFileSync('src/components/report/pages/Page02Combination.tsx', 'utf8');
p02 = p02.replace('{pInfo.shortDesc}', '{pInfo.oneLineSummary}');
p02 = p02.replace('{sInfo.shortDesc}', '{sInfo.oneLineSummary}');
fs.writeFileSync('src/components/report/pages/Page02Combination.tsx', p02, 'utf8');

// 5. Page09Prescription.tsx
let p09 = fs.readFileSync('src/components/report/pages/Page09Prescription.tsx', 'utf8');
p09 = p09.replace('const primaryType = reportData.primaryType', 'const primaryType = String(reportData.primaryType)');
p09 = p09.replace('reportData.scores.social >= 60', 'reportData.scores.relationship >= 60');
fs.writeFileSync('src/components/report/pages/Page09Prescription.tsx', p09, 'utf8');

// 6. reportMapping.ts
let rm = fs.readFileSync('src/lib/reportMapping.ts', 'utf8');
rm = rm.replace('import { getHabitTypeCombinations } from \"@/data/results\"', 'import { getHabitTypeCombinations } from \"@/data/results\"\nimport type { DimensionId } from \"@/data/scoring\"');
rm = rm.replace('const selectedPair = pairs.reduce((prev, current) => {', 'const selectedPair = pairs.reduce((prev, current): { id: DimensionId; gap: number } => {');
fs.writeFileSync('src/lib/reportMapping.ts', rm, 'utf8');

console.log('Fixed files via Node.js');
