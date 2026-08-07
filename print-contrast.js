const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'report', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Unify Tiny English Labels to text-gray-500 (if they were gray-400)
  // This ensures they are dark enough for PDF.
  content = content.replace(/text-gray-400(.*?)tracking-widest uppercase/g, 'text-gray-500$1tracking-widest uppercase');
  content = content.replace(/text-gray-400(.*?)uppercase tracking-widest/g, 'text-gray-500$1uppercase tracking-widest');

  // Page 03 / 07 specific print fixes
  if (file === 'Page03Snapshot1.tsx' || file === 'Page07Snapshot2.tsx') {
    // Unselected circle: border-gray-300 -> border-gray-400
    content = content.replace(/border-gray-300/g, 'border-gray-400');
    // Track line: bg-gray-200 -> bg-gray-300
    content = content.replace(/bg-gray-200 -z-10/g, 'bg-gray-300 -z-10');
    // Row divider: border-gray-100 -> border-gray-200
    content = content.replace(/border-gray-100/g, 'border-gray-200');
  }

  // Page 06 specific print fixes
  if (file === 'Page06FactorDetail.tsx') {
    // Table borders: gray-100 -> gray-200
    content = content.replace(/border-gray-100/g, 'border-gray-200');
    content = content.replace(/border-gray-200 bg-gray-50/g, 'border-gray-300 bg-gray-50'); // Header maybe?
  }

  // Page 10 specific print fixes
  if (file === 'Page10Plan.tsx') {
    // Date/Check boxes: gray-100/200 -> gray-300
    content = content.replace(/border-gray-100/g, 'border-gray-300');
    content = content.replace(/border-gray-200/g, 'border-gray-300');
    // We already replaced some border-gray-200 from the general card style, let's keep the general card style intact.
    // General card is "bg-white border border-gray-300 rounded-xl". Wait, general card is 200. Let's fix that back.
  }

  // Page 12 specific print fixes
  if (file === 'Page12Blueprint.tsx') {
    // Input lines: border-gray-200 -> border-gray-400 (to make sure it prints well as a line to write on)
    content = content.replace(/border-gray-200/g, 'border-gray-400');
    content = content.replace(/border-gray-100/g, 'border-gray-300');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// Restore standard card borders for Page 10 if we broke it
let p10Path = path.join(dir, 'Page10Plan.tsx');
let p10Content = fs.readFileSync(p10Path, 'utf8');
p10Content = p10Content.replace(/bg-white border border-gray-300 rounded-xl/g, 'bg-white border border-gray-200 rounded-xl');
fs.writeFileSync(p10Path, p10Content, 'utf8');

// Restore standard card borders for Page 12 if we broke it
let p12Path = path.join(dir, 'Page12Blueprint.tsx');
let p12Content = fs.readFileSync(p12Path, 'utf8');
p12Content = p12Content.replace(/bg-white border border-gray-400 rounded-xl/g, 'bg-white border border-gray-200 rounded-xl');
fs.writeFileSync(p12Path, p12Content, 'utf8');

console.log('PDF contrast adjusted');
