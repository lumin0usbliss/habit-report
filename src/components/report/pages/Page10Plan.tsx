"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"
import { get30DayPlan } from "@/lib/reportMapping"

export function Page10Plan({ reportData }: { reportData: ReportData }) {
  const plan = get30DayPlan(reportData.primaryType, reportData.scores)

  return (
    <ReportLayout pageNumber={10}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase">
          30-DAY HABIT PLAN
        </h1>
        <p className="text-gray-500 mt-1 text-xs">한 달간의 행동 설계 템플릿</p>
      </div>

      <div className="flex flex-col gap-2 mb-4">
         {plan.map((p, idx) => (
            <div key={idx} className="border border-gray-300 bg-white rounded-xl p-3 shadow-sm flex gap-3">
               <div className="w-16 shrink-0">
                  <div className="text-[10px] text-[var(--color-hazzi-magenta)] font-bold tracking-widest uppercase mb-0.5">{p.week}</div>
                  <div className="text-[11px] font-bold text-[var(--color-hazzi-magenta)] uppercase leading-tight mb-1">{p.name}</div>
                  <div className="text-[11px] text-gray-400">{idx*7 + 1}~{(idx+1)*7}일</div>
               </div>
               
               <div className="flex-1">
                  <div className="font-bold text-gray-900 text-[11px] mb-1.5">목표: {p.goal}</div>
                  <ul className="space-y-0.5 text-[11px] text-gray-700 mb-2">
                     {p.actions.map((act, i) => (
                        <li key={i} className="flex gap-1.5">
                           <span className="text-[var(--color-hazzi-magenta)] text-[11px] mt-0.5">✓</span> {act}
                        </li>
                     ))}
                  </ul>
                  <div className="text-xs text-gray-600 bg-[#FCFAFC] p-1.5 rounded-lg border border-gray-300">
                     <span className="font-bold text-gray-900 mr-1">주간 질문:</span> {p.question}
                  </div>
               </div>
            </div>
         ))}
      </div>

      <div className="border border-[var(--color-hazzi-magenta)]/20 bg-[var(--color-hazzi-magenta)]/5 rounded-xl px-4 py-3.5 mb-2">
         <div className="flex justify-between items-end mb-2">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
               <span className="text-[var(--color-hazzi-magenta)] text-sm">✓</span> HABIT TRACKER
            </h3>
            <span className="text-[11px] text-gray-500 font-bold tracking-widest uppercase border-b border-gray-400 border-dashed pb-0.5 inline-block min-w-[100px]">My Action: </span>
         </div>
         <p className="text-xs text-gray-600 mb-2 break-keep leading-snug">
            핵심 목표를 적고 매일 수행 여부를 체크하세요.
         </p>
         
         <div className="bg-white border border-gray-300 rounded-lg py-4 px-2 flex justify-center mt-1 shadow-sm">
            <div className="grid grid-cols-10 gap-x-[7px] gap-y-[7px] justify-center items-center">
               {Array.from({length: 30}).map((_, i) => (
                  <div key={i} className="w-[36px] h-[36px] min-w-[36px] min-h-[36px] rounded border border-gray-300 flex items-center justify-center p-0 box-border bg-[#FCFAFC]">
                     <span className="text-[12px] text-gray-400 font-medium font-[family-name:var(--font-space)] tracking-tighter leading-none">{String(i+1).padStart(2, '0')}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div className="bg-gray-50 border border-gray-300 p-2.5 rounded-xl mt-auto">
         <p className="text-[11px] text-gray-600 break-keep leading-snug">
            <span className="text-[10px] text-gray-900 font-bold tracking-widest uppercase mr-2">NEXT MEASUREMENT</span>
            30일 후 다시 테스트하면 점수 변화보다 실행 빈도와 부담감이 어떻게 달라졌는지 비교하세요.
         </p>
      </div>

    </ReportLayout>
  )
}
