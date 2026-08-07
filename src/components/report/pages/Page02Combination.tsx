"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"
import { results } from "@/data/results"
import { getCombinationAnalysis } from "@/lib/reportMapping"

export function Page02Combination({ reportData }: { reportData: ReportData }) {
  const pInfo = results[reportData.primaryType]
  const sInfo = results[reportData.secondaryType]
  const analysis = getCombinationAnalysis(reportData.primaryType, reportData.secondaryType, reportData.scores)

  const getSignalColor = (level: string) => {
    if (level === "높음") return "text-[var(--color-hazzi-magenta)] border-[var(--color-hazzi-magenta)]"
    if (level === "중간") return "text-amber-500 border-amber-500"
    return "text-gray-400 border-gray-400"
  }

  return (
    <ReportLayout pageNumber={2}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase tracking-tight">
          TYPE COMBINATION ANALYSIS
        </h1>
        <p className="text-gray-500 mt-2 text-xs font-medium tracking-wide">유형 조합 심층 분석</p>
      </div>

      <div className="mb-4">
        <div className="flex gap-4">
          <div className="flex-1 bg-white border border-gray-200 border-t-4 border-t-[var(--color-hazzi-magenta)] rounded-xl p-4 shadow-sm flex flex-col justify-center min-h-[110px]">
            <div>
              <p className="text-[10px] font-bold text-[var(--color-hazzi-magenta)] mb-0.5 tracking-widest">PRIMARY</p>
              <h2 className="text-lg font-bold text-gray-900">{pInfo.name}</h2>
            </div>
            <p className="text-[11px] font-medium leading-snug mt-1 text-gray-600 break-keep">
              {pInfo.oneLineSummary}
            </p>
          </div>
          <div className="flex-1 bg-white border border-gray-200 border-t-4 border-t-[#4db077] rounded-xl p-4 shadow-sm flex flex-col justify-center min-h-[110px]">
            <div>
              <p className="text-[10px] font-bold text-gray-400 mb-0.5 tracking-widest">SECONDARY</p>
              <h2 className="text-lg font-bold text-gray-900">{sInfo.name}</h2>
            </div>
            <p className="text-[11px] font-medium leading-snug mt-1 text-gray-600 break-keep">
              {sInfo.oneLineSummary}
            </p>
          </div>
        </div>
      </div>

      {/* PERSONALIZED ANALYSIS - YOUR SCORE SIGNAL */}
      <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
         <div className="flex items-center gap-2 mb-2">
            <span className="bg-[var(--color-hazzi-magenta)]/10 text-[var(--color-hazzi-magenta)] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              PERSONALIZED ANALYSIS
            </span>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">YOUR SCORE SIGNAL</span>
         </div>
         <h3 className="text-sm font-bold text-gray-900 mb-2">{analysis.scoreSignal.label}</h3>
         
         <div className="flex flex-wrap gap-2 mb-2">
            {analysis.scoreSignal.scores.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                 <span className="text-[11px] font-bold text-gray-600">{s.name}</span>
                 <span className="text-xs font-extrabold text-[var(--color-hazzi-magenta)]">{s.score}</span>
                 <span className="text-[10px] text-gray-400 font-bold">{s.trend}</span>
              </div>
            ))}
         </div>
         
         <p className="text-xs text-gray-600 font-medium leading-relaxed break-keep">
            {analysis.scoreSignal.desc}
         </p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm flex flex-col items-center justify-center min-h-[100px]">
          <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">CORE MOTIVATION</div>
          <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-400 text-xs my-1">♥</div>
          <p className="text-[10px] font-bold text-gray-900 break-keep leading-tight mt-1">{analysis.coreMotivation}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm flex flex-col items-center justify-center min-h-[100px]">
          <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">START TRIGGER</div>
          <div className="w-6 h-6 rounded-full border border-gray-900 flex items-center justify-center text-gray-900 text-xs my-1">▶</div>
          <p className="text-[10px] font-bold text-gray-900 break-keep leading-tight mt-1">{analysis.startTrigger}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm flex flex-col items-center justify-center min-h-[100px]">
          <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">DROP TRIGGER</div>
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-gray-400 text-xs my-1 font-bold">!</div>
          <p className="text-[10px] font-bold text-gray-900 break-keep leading-tight mt-1">{analysis.dropTrigger}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm flex flex-col items-center justify-center min-h-[100px]">
          <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">MAINTENANCE KEY</div>
          <div className="w-6 h-6 rounded-full border border-[var(--color-hazzi-magenta)] flex items-center justify-center text-[var(--color-hazzi-magenta)] text-xs my-1">∞</div>
          <p className="text-[10px] font-bold text-gray-900 break-keep leading-tight mt-1">{analysis.maintenanceKey}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="w-1/2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-center">
          <h3 className="text-[11px] font-bold mb-1.5">주/부유형의 작동 방식</h3>
          <p className="text-[11px] text-gray-700 leading-snug mb-2 break-keep line-clamp-3">
            {pInfo.coreTendency}
          </p>
          <p className="text-[10px] text-gray-500 leading-snug break-keep line-clamp-3">
            {sInfo.coreTendency}
          </p>
        </div>

        <div className="w-1/2 bg-[var(--color-hazzi-magenta)]/5 border border-[var(--color-hazzi-magenta)]/10 rounded-xl p-4 shadow-sm flex flex-col justify-center">
          <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3">COMBINATION SIGNAL</div>
          <div className="grid grid-cols-2 gap-y-3 flex-1">
             <div className={`border-l-2 pl-2 ${getSignalColor(analysis.combinationSignal.reaction)}`}>
               <div className="font-bold text-sm leading-none">{analysis.combinationSignal.reaction}</div>
               <div className="text-[9px] text-gray-500 mt-0.5">초기 반응성</div>
             </div>
             <div className={`border-l-2 pl-2 ${getSignalColor(analysis.combinationSignal.changeNeed)}`}>
               <div className="font-bold text-sm leading-none">{analysis.combinationSignal.changeNeed}</div>
               <div className="text-[9px] text-gray-500 mt-0.5">변화 필요도</div>
             </div>
             <div className={`border-l-2 pl-2 ${getSignalColor(analysis.combinationSignal.endurance)}`}>
               <div className="font-bold text-sm leading-none">{analysis.combinationSignal.endurance}</div>
               <div className="text-[9px] text-gray-500 mt-0.5">반복 내구도</div>
             </div>
             <div className={`border-l-2 pl-2 ${getSignalColor(analysis.combinationSignal.pressureTolerance)}`}>
               <div className="font-bold text-sm leading-none">{analysis.combinationSignal.pressureTolerance}</div>
               <div className="text-[9px] text-gray-500 mt-0.5">압박 적합도</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-gray-900 text-[11px] mb-2 flex items-center gap-1.5">
            ENERGY UP <span className="text-[9px] text-[var(--color-hazzi-magenta)] font-normal">잘 맞는 조건</span>
          </h3>
          <ul className="space-y-1.5">
             {pInfo.strengths.slice(0,3).map((s, idx) => (
                <li key={idx} className="flex gap-1.5 text-[10px] text-gray-700 leading-tight">
                   <span className="text-[var(--color-hazzi-magenta)] mt-[1px]">✓</span> <span className="truncate">{s}</span>
                </li>
             ))}
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-gray-900 text-[11px] mb-2 flex items-center gap-1.5">
            ENERGY DOWN <span className="text-[9px] text-[var(--color-hazzi-magenta)] font-normal">주의 조건</span>
          </h3>
          <ul className="space-y-1.5">
             {pInfo.cautionPoints.slice(0,3).map((s, idx) => (
                <li key={idx} className="flex gap-1.5 text-[10px] text-gray-700 leading-tight">
                   <span className="text-gray-400 mt-[1px]">×</span> <span className="truncate">{s}</span>
                </li>
             ))}
          </ul>
        </div>
      </div>

      <div className="bg-[var(--color-hazzi-magenta)]/5 p-3 rounded-xl text-[10px] border border-[var(--color-hazzi-magenta)]/10 text-gray-700 mt-auto">
         <span className="font-bold text-[var(--color-hazzi-magenta)] mr-2">실전 번역</span> 
         {pInfo.strategies[0]} {pInfo.strategies[1]}
      </div>
    </ReportLayout>
  )
}
