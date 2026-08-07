const fs = require('fs');
let p09 = fs.readFileSync('src/components/report/pages/Page09Prescription.tsx', 'utf8');
p09 = p09.replace('const strategy = getActionStrategy(reportData)', 'const primaryType = String(reportData.primaryType);\n  const strategy = getActionStrategy(reportData)');
fs.writeFileSync('src/components/report/pages/Page09Prescription.tsx', p09, 'utf8');
