const fs = require('fs');

// 1. qa/page.tsx
let qa = fs.readFileSync('src/app/qa/page.tsx', 'utf8');
qa = qa.replace('<Page12Blueprint reportData={reportData} />', '<Page12Blueprint reportData={c} />');
fs.writeFileSync('src/app/qa/page.tsx', qa, 'utf8');
