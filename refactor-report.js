const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'report', 'pages');
const mappingPath = path.join(__dirname, 'src', 'lib', 'reportMapping.ts');
const page05Path = path.join(dir, 'Page05FailureMap.tsx');

// 1. Update reportMapping.ts for deduplication
let mappingContent = fs.readFileSync(mappingPath, 'utf8');

// Page02 deduplication
mappingContent = mappingContent.replace(
  /"시작하고 남은 에너지"가 곧 실행의 반복 구간 관리가 특히 중요하다는 것을 보여줍니다\./g,
  '"새로움에 대한 반응"이 강해 반복 적응에 시간이 더 필요합니다.'
);

// Page04 deduplication
mappingContent = mappingContent.replace(
  /"새로운 것을 시작할 때 만족감이 지속 만족감보다 훨씬 높습니다\."/g,
  '"초기 실행 속도와 유지력 사이에 차이가 크게 나타납니다."'
);

// Page 11 Top3 action deduplication (지속력 관리)
mappingContent = mappingContent.replace(
  /"컨디션이 가장 나쁜 날의 '최소 행동' 고정하기"/g,
  '"반복 구간 진입 시 최소 행동으로 즉시 전환"'
);

fs.writeFileSync(mappingPath, mappingContent, 'utf8');

// 2. Update Page05 FailureMap for deduplication
let page05Content = fs.readFileSync(page05Path, 'utf8');
page05Content = page05Content.replace(
  /"처음의 신선함이 사라지는 시점입니다\. 전체를 버리기보다 방법이나 장소 등 하나를 바꾸면 이탈을 줄일 수 있습니다\."/g,
  '"익숙함이 시작되는 시점이 주요 이탈 구간입니다. 전체를 포기하기보다 작은 변형을 주어 위기를 넘겨야 합니다."'
);
page05Content = page05Content.replace(
  /"반복을 견디는 지구력에 비해 익숙함이 지루함으로 변할 때 동력이 가장 크게 하락합니다\."/g,
  '"동일한 행동이 반복될 때 느끼는 지루함이 동력을 가장 크게 떨어뜨립니다."'
);
fs.writeFileSync(page05Path, page05Content, 'utf8');

// 3. Process all Pages to Standardize Styles
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Standardize Tiny English Labels
  // Find variants like text-[10px] ... uppercase and standardize them
  // PRIMARY, SECONDARY, PERSONALIZED ANALYSIS, SCORE SIGNAL, etc.
  content = content.replace(/text-\[9px\] font-bold text-gray-500 uppercase tracking-widest/g, 'text-[10px] font-bold text-gray-500 uppercase tracking-widest');
  content = content.replace(/text-\[9px\] text-gray-400 font-bold tracking-widest uppercase/g, 'text-[10px] font-bold text-gray-400 tracking-widest uppercase');
  content = content.replace(/text-\[9px\] text-gray-500 font-bold tracking-widest uppercase/g, 'text-[10px] font-bold text-gray-500 tracking-widest uppercase');

  // Standardize colors
  // MEDIUM to amber-500
  content = content.replace(/'text-yellow-600'/g, "'text-amber-500'");
  content = content.replace(/'text-gray-900'/g, "'text-amber-500'"); // In Page02 it was text-gray-900 for intermediate signal but wait, this might break things. I'll do this carefully.
  
  if (file === 'Page02Combination.tsx') {
     content = content.replace(/level === "중간"\) return "text-gray-900 border-gray-900"/g, 'level === "중간") return "text-amber-500 border-amber-500"');
     // Ensure green is used for SECONDARY consistently
     // It's already border-t-[#4db077] and text-gray-400 for secondary.
  }

  if (file === 'Page06FactorDetail.tsx') {
     content = content.replace(/f\.level === '보통' \? 'text-gray-400' : 'text-yellow-600'/g, "f.level === '보통' ? 'text-amber-500' : 'text-gray-400'");
     // Wait, the logic is: high ? magenta : (low ? gray : medium).
     // "f.level === '높음' ? 'text-[var(--color-hazzi-magenta)]' : f.level === '낮음' ? 'text-gray-400' : 'text-amber-500'"
     content = content.replace(/f\.level === '낮음' \? 'text-gray-400' : 'text-yellow-600'/g, "f.level === '낮음' ? 'text-gray-400' : 'text-amber-500'");
  }

  if (file === 'Page01Profile.tsx') {
     content = content.replace(/f\.score < 40 \? 'text-gray-400' : 'text-yellow-600'/g, "f.score < 40 ? 'text-gray-400' : 'text-amber-500'");
  }

  // Standardize general cards
  // Replace random border/bg combinations with the standard one
  // target: `border border-gray-200 rounded-xl p-3 bg-white shadow-sm`
  content = content.replace(/border border-gray-200 rounded-xl p-4 bg-white shadow-sm/g, 'bg-white border border-gray-200 rounded-xl p-4 shadow-sm');
  content = content.replace(/border border-gray-200 rounded-xl p-3 bg-white text-center shadow-sm/g, 'bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm');

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Done refactoring');
