const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'report', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  if (file === 'Page03Snapshot1.tsx' || file === 'Page07Snapshot2.tsx') {
    // 척도 라벨 전혀 아니다 / 매우 그렇다
    content = content.replace(/text-\[10px\] text-gray-400 font-bold absolute/g, 'text-[11px] text-gray-400 font-bold absolute');
    // BASED ON YOUR RESPONSE
    content = content.replace(/text-\[9px\] font-bold px-2 py-1/g, 'text-[10px] font-bold px-2 py-1');
  }

  if (file === 'Page06FactorDetail.tsx') {
    // 표 내부 텍스트
    content = content.replace(/text-\[10px\] text-gray-500/g, 'text-[11px] text-gray-500');
    content = content.replace(/text-\[8px\]/g, 'text-[10px]');
    // gap 줄이기
    content = content.replace(/gap-2 mb-2/g, 'gap-1 mb-1');
    content = content.replace(/mb-6/g, 'mb-4');
  }

  if (file === 'Page08Environment.tsx') {
    content = content.replace(/text-\[10px\] text-gray-500 break-keep/g, 'text-[11px] text-gray-500 break-keep');
    content = content.replace(/text-\[9px\]/g, 'text-[10px]');
  }

  if (file === 'Page09Prescription.tsx') {
    content = content.replace(/text-\[10px\]/g, 'text-[11px]');
    content = content.replace(/text-\[8px\]/g, 'text-[10px]');
    content = content.replace(/text-xs text-gray-700 font-bold/g, 'text-[13px] text-gray-700 font-bold');
  }

  if (file === 'Page10Plan.tsx') {
    // 리스트 아이템
    content = content.replace(/text-\[10px\] text-gray-700/g, 'text-[11px] text-gray-700');
    // 질문
    content = content.replace(/text-\[9px\] text-gray-600 mb-3/g, 'text-xs text-gray-600 mb-2');
    content = content.replace(/text-\[9px\] text-gray-600 bg/g, 'text-xs text-gray-600 bg');
    // 날짜
    content = content.replace(/text-\[9px\] text-gray-400/g, 'text-[11px] text-gray-400');
    // WEEK
    content = content.replace(/text-\[9px\] text-\[var/g, 'text-[10px] text-[var');
    // 하단 텍스트
    content = content.replace(/text-\[9px\]/g, 'text-[11px]');
    content = content.replace(/text-\[8px\]/g, 'text-[10px]');
    // 여백 축소
    content = content.replace(/p-4/g, 'p-3');
    content = content.replace(/gap-4/g, 'gap-3');
  }

  if (file === 'Page11Summary.tsx') {
    content = content.replace(/text-\[10px\] text-gray-700/g, 'text-[11px] text-gray-700');
    content = content.replace(/text-\[10px\] text-gray-600/g, 'text-[11px] text-gray-600');
    content = content.replace(/text-\[9px\]/g, 'text-[10px]');
  }

  if (file === 'Page12Blueprint.tsx') {
    content = content.replace(/text-\[10px\]/g, 'text-[11px]');
  }

  // Save the modifications
  fs.writeFileSync(filePath, content, 'utf-8');
}

console.log("Fonts adjusted.");
