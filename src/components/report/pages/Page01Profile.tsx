"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"
import { results } from "@/data/results"
import { calculateTypeFitScore } from "@/lib/testLogic"
import { getCoreFormula, getExecutionStabilityText } from "@/lib/reportMapping"

export function Page01Profile({ reportData }: { reportData: ReportData }) {
  const primary = results[reportData.primaryType]
  const secondary = results[reportData.secondaryType]
  
  const mappedScores: any = {
    START: reportData.scores.initiation,
    PERSIST: reportData.scores.persistence,
    RECOVER: reportData.scores.recovery,
    ACHIEVE: reportData.scores.achievement,
    SOCIAL: reportData.scores.relationship,
    PERFECT: reportData.scores.pressure,
    EXPLORE: reportData.scores.exploration,
    STIMULUS: reportData.scores.stimulation
  }
  let fitScore = Math.round(calculateTypeFitScore(mappedScores, reportData.primaryType))
  if (Number.isNaN(fitScore)) fitScore = 0
  
  // Execution Stability Logic
  const stabilityMap = (score: number) => {
    if (score >= 80) return "A+"
    if (score >= 60) return "A"
    if (score >= 40) return "B+"
    if (score >= 30) return "B"
    return "C"
  }
  const stability = stabilityMap(reportData.scores.persistence)
  const stabilityText = getExecutionStabilityText(stability)
  const coreFormula = getCoreFormula(reportData.primaryType, reportData.secondaryType, reportData.scores)

  const factors = [
    { id: "START", label: "시작력", score: reportData.scores.initiation },
    { id: "PERSIST", label: "지속력", score: reportData.scores.persistence },
    { id: "RECOVER", label: "회복력", score: reportData.scores.recovery },
    { id: "ACHIEVE", label: "목표 달성력", score: reportData.scores.achievement },
    { id: "SOCIAL", label: "관계 지향성", score: reportData.scores.relationship },
    { id: "PRESSURE", label: "압력 저항성", score: reportData.scores.pressure },
    { id: "EXPLORE", label: "탐구력", score: reportData.scores.exploration },
    { id: "STIMULUS", label: "자극 추구", score: reportData.scores.stimulation },
  ]

  const maxFactor = factors.reduce((max, f) => f.score > max.score ? f : max, factors[0])
  const minFactor = factors.reduce((min, f) => f.score < min.score ? f : min, factors[0])
  const gap = Math.round(maxFactor.score - minFactor.score)

  return (
    <ReportLayout pageNumber={1}>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
          PERSONAL<br/>HABIT PROFILE REPORT
        </h1>
        <p className="text-gray-500 mt-2 text-sm">나만의 습관을 이해하고, 지속 가능한 변화를 설계하세요.</p>
        <div className="text-right text-[10px] text-gray-400 -mt-12">
          REPORT DATE {reportData.reportDate.slice(0,10).replace(/-/g, '.')}<br/>
          REPORT ID {reportData.reportId}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-[var(--color-hazzi-magenta)]"></div>
          <div className="px-5 py-4 pt-5 flex-1 flex flex-col">
            <div className="text-[9px] text-[var(--color-hazzi-magenta)] font-bold mb-1 tracking-widest uppercase">PRIMARY</div>
            <h2 className="text-[16px] font-bold mb-2.5 break-keep text-gray-900 leading-tight">
              {primary.name.replace(primary.name.split(' ').pop() || '', '')} 
              <span className="text-[var(--color-hazzi-magenta)]">{primary.name.split(' ').pop()}</span>
            </h2>
            <div className="flex gap-1.5 mb-3">
              {primary.keywords.map(k => (
                <span key={k} className="px-2 py-0.5 bg-[var(--color-hazzi-magenta)]/5 border border-[var(--color-hazzi-magenta)]/20 rounded text-[10px] text-gray-700 font-medium">
                  {k}
                </span>
              ))}
            </div>
            
            <div className="mt-auto text-[11px] font-medium text-gray-700 break-keep leading-snug">
               {primary.oneLineSummary}
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-[#67d195]"></div>
          <div className="px-5 py-4 pt-5 flex-1 flex flex-col">
            <div className="text-[9px] text-[#4db077] font-bold mb-1 tracking-widest uppercase">SECONDARY</div>
            <h2 className="text-[16px] font-bold mb-2.5 break-keep text-gray-900 leading-tight">
              {secondary.name.replace(secondary.name.split(' ').pop() || '', '')} 
              <span className="text-[#4db077]">{secondary.name.split(' ').pop()}</span>
            </h2>
            <div className="flex gap-1.5 mb-3">
              {secondary.keywords.map(k => (
                <span key={k} className="px-2 py-0.5 bg-[#67d195]/10 border border-[#67d195]/30 rounded text-[10px] text-gray-700 font-medium">
                  {k}
                </span>
              ))}
            </div>
            
            <div className="mt-auto text-[11px] font-medium text-gray-700 break-keep leading-snug">
               {secondary.oneLineSummary}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm flex flex-col justify-between">
          <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">HABIT FIT SCORE</div>
          <div className="my-2">
            <span className="text-4xl font-bold text-[var(--color-hazzi-magenta)]">{fitScore}</span>
            <span className="text-gray-900 font-bold"> /100</span>
          </div>
          <p className="text-[10px] text-gray-600 break-keep">현재 방식과 성향의 적합도는 {fitScore >= 70 ? '양호한' : '개선이 필요한'} 편입니다.</p>
        </div>
        <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm flex flex-col justify-between">
          <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">EXECUTION STABILITY</div>
          <div className="my-2">
            <span className="text-4xl font-bold text-gray-900">{stability}</span>
          </div>
          <p className="text-[10px] text-gray-600 break-keep">{stabilityText}</p>
        </div>
        <div className="border border-[var(--color-hazzi-magenta)]/20 bg-[var(--color-hazzi-magenta)]/5 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">CORE FORMULA</div>
          <div className="text-base font-bold text-gray-900 my-2 break-keep leading-tight">
            {coreFormula}
          </div>
          <p className="text-[10px] text-gray-600 break-keep">이 요소들이 동시에 있을 때 지속 가능성이 가장 높아집니다.</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 flex items-baseline gap-2">
          상세 성향 분석
          <span className="text-[var(--color-hazzi-magenta)] text-[10px] font-normal tracking-widest uppercase">8 Factor Overview</span>
        </h3>
        <p className="text-[11px] text-gray-500 mt-1">8가지 축으로 분석한 나의 행동 특성입니다.</p>
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-4 mb-2">
         {/* 왼쪽 시각화 (가로형 막대 리스트) */}
         <div className="border border-gray-200 bg-white rounded-2xl px-5 py-3 shadow-sm flex flex-col gap-1.5 h-full">
            {factors.map((f, i) => (
               <div key={f.label} className={`flex items-center gap-3 ${i !== factors.length - 1 ? 'border-b border-gray-50 pb-1' : ''}`}>
                  <div className="w-14 shrink-0 flex flex-col">
                    <span className="text-[8px] text-gray-500 font-bold tracking-widest uppercase mb-0">{f.id}</span>
                    <span className="text-[11px] font-bold text-gray-900 leading-none">{f.label}</span>
                  </div>
                  
                  <div className="flex-1 h-[8px] bg-gray-100 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-gray-800 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${Math.max(0, Math.min(100, f.score))}%` }}
                    />
                  </div>
                  
                  <div className="w-8 shrink-0 text-right text-[13px] font-bold text-gray-900">
                    {Math.round(f.score)}
                  </div>
               </div>
            ))}
         </div>

         {/* 오른쪽 수치 표 */}
         <div className="border border-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <table className="w-full text-left text-[11px]">
               <thead>
                  <tr className="bg-[#FCFAFC] text-gray-500 border-b border-gray-200">
                     <th className="font-normal py-1.5 px-4 w-1/3">지표</th>
                     <th className="font-normal py-1.5 px-4 text-center w-1/3">점수</th>
                     <th className="font-normal py-1.5 px-4 text-right w-1/3">수준</th>
                  </tr>
               </thead>
               <tbody>
                  {factors.map((f, i) => (
                     <tr key={f.label} className={i !== factors.length - 1 ? 'border-b border-gray-100' : ''}>
                        <td className="py-1.5 px-4 font-bold text-gray-900">{f.label}</td>
                        <td className="py-1.5 px-4 text-center text-gray-600 font-medium">{Math.round(f.score)}</td>
                        <td className={`py-1.5 px-4 text-right font-bold ${
                           f.score >= 60 ? 'text-[var(--color-hazzi-magenta)]' : 
                           f.score < 40 ? 'text-gray-400' : 'text-amber-500'
                        }`}>
                           {f.score >= 60 ? '높음' : f.score < 40 ? '낮음' : '보통'}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </ReportLayout>
  )
}
