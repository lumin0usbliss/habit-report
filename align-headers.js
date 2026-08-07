const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'report', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Standardize header margin to mb-6
  // Looking for `<div className="mb-X"> \n <h1`
  content = content.replace(/<div className="mb-\d+">(\s*<h1 className="text-2xl)/g, '<div className="mb-6">$1');
  
  // Page01 header standardization (if any)
  if (file === 'Page01Profile.tsx') {
    // Keep it mb-8 or mb-6 if we want it to match
    content = content.replace(/<div className="mb-\d+">(\s*<h1 className="text-3xl)/g, '<div className="mb-6">$1');
  }

  // Double check High/Medium/Low colors in Page01
  if (file === 'Page01Profile.tsx') {
    content = content.replace(/'text-yellow-600'/g, "'text-amber-500'");
  }

  // Ensure uppercase consistency for labels
  content = content.replace(/className="text-\[10px\] font-bold text-gray-500 uppercase tracking-widest"/g, 'className="text-[10px] font-bold text-gray-500 tracking-widest uppercase"');

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Headers aligned');
