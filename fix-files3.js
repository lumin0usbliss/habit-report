const fs = require('fs');
let p09 = fs.readFileSync('src/components/report/pages/Page09Prescription.tsx', 'utf8');
p09 = p09.replace(/reportData\.primaryType ===/g, 'primaryType ===');
p09 = p09.replace(/reportData\.secondaryType ===/g, 'String(reportData.secondaryType) ===');
fs.writeFileSync('src/components/report/pages/Page09Prescription.tsx', p09, 'utf8');
