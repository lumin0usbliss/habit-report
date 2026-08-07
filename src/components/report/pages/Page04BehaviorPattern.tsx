"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"
import { getBehaviorPatterns, getMeaningfulGap } from "@/lib/reportMapping"

export function Page04BehaviorPattern({ reportData }: { reportData: ReportData }) {
  const patterns = getBehaviorPatterns(reportData.scores)
  const gap = getMeaningfulGap(reportData.scores)

  return (
    <ReportLayout pageNumber={4}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase">
          BEHAVIOR PATTERN ANALYSIS
        </h1>
        <p className="text-gray-500 mt-2 text-xs">점수 간 관계로 보는 행동 재현 패턴</p>
      </div>

      <div className="flex flex-col gap-3 mb-auto">
        {patterns.map((pattern, idx) => (
          <div key={idx} className="border border-[var(--color-hazzi-magenta)]/10 rounded-xl p-4 bg-white shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-1.5">
               <span className="text-[10px] font-bold text-[var(--color-hazzi-magenta)] tracking-widest uppercase">PATTERN {String(idx+1).padStart(2,'0')}</span>
               <span className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1.5 py-[1px] rounded-sm uppercase tracking-wider">
                 SCORE SIGNAL: {pattern.scoreSignal}
               </span>
            </div>
            <h2 className="text-[15px] font-bold text-gray-900 mb-2.5">{pattern.title}</h2>
            
            <div className="grid grid-cols-[40px_1fr] gap-y-1.5 text-[11px] flex-1 items-start">
               <div className="text-gray-400 font-bold">관찰</div>
               <div className="text-gray-800 break-keep leading-tight truncate">{pattern.observe}</div>
               
               <div className="text-blue-400 font-bold">강점</div>
               <div className="text-gray-800 break-keep leading-tight truncate">{pattern.strength}</div>
               
               <div className="text-[var(--color-hazzi-magenta)] font-bold">위험</div>
               <div className="text-gray-800 break-keep leading-tight truncate">{pattern.risk}</div>
               
               <div className="text-green-500 font-bold">처방</div>
               <div className="text-gray-800 font-bold break-keep leading-tight truncate">{pattern.prescription}</div>
            </div>
          </div>
        ))}
      </div>

      {gap.valid && (
        <div className="mt-3 bg-white border border-gray-200 rounded-xl p-3 px-4 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center w-full mb-1">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-gray-200">
                YOUR BIGGEST GAP
              </span>
              <span className="text-[10px] font-bold text-gray-500">가장 의미 있는 점수 격차</span>
            </div>
            
            <div className="flex items-center gap-2">
               <div className="text-sm font-extrabold text-gray-900">{gap.label1} <span className="text-[var(--color-hazzi-magenta)]">{gap.score1}</span></div>
               <div className="text-[9px] text-gray-500 font-bold px-1.5 py-[1px] border border-gray-200 bg-gray-50 rounded-full whitespace-nowrap">
                  ↕ {gap.diff}pt
               </div>
               <div className="text-sm font-extrabold text-gray-900">{gap.label2} <span className="text-gray-500">{gap.score2}</span></div>
            </div>
          </div>
          
          <p className="text-[11px] text-gray-700 font-medium leading-snug break-keep w-[95%] line-clamp-2 mt-0.5">
             {gap.desc}
          </p>
        </div>
      )}

      <div className="text-center text-[9px] text-gray-400 mt-3">
        패턴 분석은 단일 점수보다 지표 간 상대적 조합을 우선합니다.
      </div>
    </ReportLayout>
  )
}
