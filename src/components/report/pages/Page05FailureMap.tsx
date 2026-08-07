"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"

export function Page05FailureMap({ reportData }: { reportData: ReportData }) {
  const getCriticalPoint = () => {
     const s = reportData.scores
     if (s.initiation < 45) return { step: "03 빠른 시작", desc: "시작 자체를 미루는 시점입니다. 완벽한 환경보다 5분 이하의 아주 작은 첫 행동 설계가 필요합니다.", reason: "첫 진입 장벽을 넘는 에너지가 부족하여 준비 단계에서 머물 가능성이 큽니다.", scoreSignal: `시작력 ${Math.round(s.initiation)} ↓` }
     if (s.persistence < 45) return { step: "05 반복 구간 진입", desc: "처음의 신선함이 사라지는 시점입니다. 습관 자체를 버리기보다 방법이나 장소 중 하나를 바꾸면 이탈을 줄일 수 있습니다.", reason: "반복을 견디는 내구도가 약해 익숙함이 지루함으로 변할 때 동력이 가장 크게 하락합니다.", scoreSignal: `지속력 ${Math.round(s.persistence)} ↓` }
     if (s.recovery < 45) return { step: "07 실행 빈도 감소", desc: "한 번 놓친 후 다시 돌아오는 데 시간이 걸리는 시점입니다. 실패의 이유보다 재시작 조건을 먼저 정해두는 것이 좋습니다.", reason: "연속성이 깨졌을 때 재시작을 위한 심리적 장벽을 크게 느끼는 편입니다.", scoreSignal: `회복력 ${Math.round(s.recovery)} ↓` }
     
     // 기본값 (밸런스형)
     return { step: "06 의미 재평가", desc: "목표의 의미가 흐려지는 시점입니다. 처음에 이 목표를 세웠던 이유를 다시 한번 상기하는 것이 중요합니다.", reason: "행동이 기계적인 반복으로 느껴질 때 목적성을 잃으면 언제든 이탈할 수 있습니다.", scoreSignal: `전체 지표 밸런스형` }
  }

  const cp = getCriticalPoint()

  const steps = [
    { num: "01", label: "새 목표 발견" },
    { num: "02", label: "흥미 상승" },
    { num: "03", label: "빠른 시작" },
    { num: "04", label: "초기 몰입" },
    { num: "05", label: "반복 구간 진입" },
    { num: "06", label: "의미 재평가" },
    { num: "07", label: "실행 빈도 감소" },
    { num: "08", label: "새 목표 탐색" },
  ]

  return (
    <ReportLayout pageNumber={5}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase">
          HABIT FAILURE MAP
        </h1>
        <p className="text-gray-500 mt-2 text-xs">습관이 무너지기 전 나타나는 흐름과 개입 지점</p>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center px-2 relative mb-8">
           <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-gray-200 -z-10"></div>
           {steps.map((s) => {
             const isCritical = cp.step.includes(s.num)
             return (
               <div key={s.num} className="flex flex-col items-center bg-[#FCFAFC]">
                 <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-sm font-bold font-[family-name:var(--font-space)] mb-2 bg-white
                   ${isCritical ? 'border-[var(--color-hazzi-magenta)] text-[var(--color-hazzi-magenta)]' : 'border-gray-200 text-gray-400'}`}>
                   {s.num}
                 </div>
                 <div className={`text-[11px] text-center break-keep w-14 font-bold ${isCritical ? 'text-[var(--color-hazzi-magenta)]' : 'text-gray-600'}`}>
                   {s.label.split(' ').map((w,i) => <span key={i} className="block">{w}</span>)}
                 </div>
               </div>
             )
           })}
        </div>
        
        <div className="bg-[var(--color-hazzi-magenta)]/5 border border-[var(--color-hazzi-magenta)]/10 p-5 rounded-2xl relative">
          <div className="absolute top-4 right-4">
             <span className="bg-white text-[var(--color-hazzi-magenta)] border border-[var(--color-hazzi-magenta)]/20 text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
               PERSONALIZED ANALYSIS
             </span>
          </div>
          <p className="text-[15px] text-gray-800 break-keep leading-relaxed font-medium mb-3">
             <span className="font-bold text-[var(--color-hazzi-magenta)] mr-2">CRITICAL POINT · {cp.step}</span>
             {cp.desc}
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-[var(--color-hazzi-magenta)]/10">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                WHY THIS POINT? 
                <span className="text-[var(--color-hazzi-magenta)]">[{cp.scoreSignal}]</span>
             </div>
             <p className="text-xs text-gray-700 leading-relaxed break-keep font-medium">
                {cp.reason}
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
         <div className="border border-gray-200 bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              EARLY WARNING SIGNS <span className="text-xs text-[var(--color-hazzi-magenta)] font-normal">이탈 전 신호</span>
            </h3>
            <ul className="space-y-4 text-sm text-gray-700">
               <li className="flex gap-2"><span className="text-gray-400">×</span> "오늘만 쉬자"가 2회 이상 반복됨</li>
               <li className="flex gap-2"><span className="text-gray-400">×</span> 기록을 보는 것이 부담스럽게 느껴짐</li>
               <li className="flex gap-2"><span className="text-gray-400">×</span> 다른 새로운 목표를 검색하는 시간이 늘어남</li>
               <li className="flex gap-2"><span className="text-gray-400">×</span> 목표 자체보다 방법에 대한 불만이 커짐</li>
               <li className="flex gap-2"><span className="text-gray-400">×</span> 한 번 놓친 뒤 전체 계획을 포기하고 싶어짐</li>
            </ul>
         </div>

         <div className="border border-gray-200 bg-[var(--color-hazzi-magenta)]/5 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              RECOVERY PROTOCOL <span className="text-xs text-[var(--color-hazzi-magenta)] font-normal">24H RESET</span>
            </h3>
            <ul className="space-y-4 text-sm text-gray-700 font-medium">
               <li>1. 목표는 유지하고 방법만 바꾼다.</li>
               <li>2. 최소 행동을 평소의 20%로 낮춘다.</li>
               <li>3. 24시간 안에 1회만 실행한다.</li>
               <li>4. 실패 이유 대신 <strong className="text-gray-900">재시작 조건</strong>을 기록한다.</li>
               <li>5. 3일 뒤 정상 루틴으로 복귀할지 재평가한다.</li>
            </ul>
         </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-[17px] mb-4">상황별 즉시 개입</h3>
        <div className="grid grid-cols-3 gap-3">
           <div className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm">
             <div className="text-[var(--color-hazzi-magenta)] font-bold text-lg mb-1">A</div>
             <div className="font-bold text-gray-900 text-sm mb-2">지루하다</div>
             <p className="text-xs text-gray-500 break-keep">장소·순서·콘텐츠 중 하나만 교체.</p>
           </div>
           <div className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm">
             <div className="text-[var(--color-hazzi-magenta)] font-bold text-lg mb-1">B</div>
             <div className="font-bold text-gray-900 text-sm mb-2">부담스럽다</div>
             <p className="text-xs text-gray-500 break-keep">시간을 절반 이하로 줄이고 실행만 유지.</p>
           </div>
           <div className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm">
             <div className="text-[var(--color-hazzi-magenta)] font-bold text-lg mb-1">C</div>
             <div className="font-bold text-gray-900 text-sm mb-2">놓쳤다</div>
             <p className="text-xs text-gray-500 break-keep">보상 금지. 다음 가능한 시점에 5분 재개.</p>
           </div>
        </div>
      </div>

      <div className="text-center mt-auto">
         <p className="text-xl font-bold text-[var(--color-hazzi-magenta)] font-[family-name:var(--font-sans)] italic tracking-tight">
           "Change the method, not the goal."
         </p>
         <p className="text-xs text-gray-400 mt-6">
           가장 중요한 것은 '완벽하게 유지'가 아니라 '빨리 복귀'하는 능력입니다.
         </p>
      </div>

    </ReportLayout>
  )
}
