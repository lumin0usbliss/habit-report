"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"
import { results } from "@/data/results"
import { getAnalysisSummary } from "@/lib/reportMapping"

export function Page11Summary({ reportData }: { reportData: ReportData }) {
  const primary = results[reportData.primaryType]
  const secondary = results[reportData.secondaryType]
  
  // 강점 3개
  const strengths = primary.strengths.slice(0, 3)
  if (strengths.length < 3) strengths.push(secondary.strengths[0])
  
  // 주의점 3개
  const cautions = primary.cautionPoints.slice(0, 3)
  if (cautions.length < 3) cautions.push(secondary.cautionPoints[0])
  
  // 성공 키워드 3개
  const keywords = [primary.keywords[0] || '자율성', primary.keywords[1] || '변화', secondary.keywords[0] || '실행']

  const summary = getAnalysisSummary(reportData.scores)

  return (
    <ReportLayout pageNumber={11}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase">
          ANALYSIS SUMMARY
        </h1>
        <p className="text-gray-500 mt-1 text-[11px]">최종 진단 요약 및 다음 행동</p>
      </div>

      <div className="border border-gray-200 bg-white rounded-2xl p-4 shadow-sm mb-4">
         <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-3 text-center border-b border-gray-100 pb-2">PROFILE IDENTITY</div>
         <div className="flex divide-x divide-gray-100">
            <div className="flex-1 px-4 text-center">
               <div className="text-[10px] text-[var(--color-hazzi-magenta)] font-bold tracking-widest uppercase mb-1">PRIMARY</div>
               <div className="font-bold text-sm text-gray-900 leading-tight mb-1">{primary.name}</div>
            </div>
            <div className="flex-1 px-4 text-center">
               <div className="text-[10px] text-[#4db077] font-bold tracking-widest uppercase mb-1">SECONDARY</div>
               <div className="font-bold text-sm text-gray-900 leading-tight mb-1">{secondary.name}</div>
            </div>
            <div className="flex-1 px-4 text-center">
               <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">PERSONAL FORMULA</div>
               <div className="font-bold text-[11px] text-gray-700 leading-tight mb-1">{keywords[0]} + {keywords[1]} + 작은 실행</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
         <div className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-[11px] text-gray-900 mb-2.5">CORE STRENGTH</h3>
            <ul className="space-y-1.5 text-[11px] text-gray-700 font-medium break-keep">
               {strengths.map((s, i) => <li key={i} className="flex gap-1.5"><span className="text-[var(--color-hazzi-magenta)]">✓</span> {s}</li>)}
            </ul>
         </div>
         <div className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-[11px] text-gray-900 mb-2.5">CORE CAUTION</h3>
            <ul className="space-y-1.5 text-[11px] text-gray-700 font-medium break-keep">
               {cautions.map((c, i) => <li key={i} className="flex gap-1.5"><span className="text-gray-400">△</span> {c}</li>)}
            </ul>
         </div>
         <div className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-[11px] text-gray-900 mb-3 w-full text-left">SUCCESS KEYWORDS</h3>
            <div className="flex flex-col gap-2 mt-auto mb-auto w-full">
               {keywords.map((k, i) => (
                  <div key={i} className="bg-[var(--color-hazzi-magenta)]/10 text-[var(--color-hazzi-magenta)] font-bold text-xs py-1.5 rounded w-full">{k}</div>
               ))}
            </div>
         </div>
      </div>
      
      <div className="border border-[var(--color-hazzi-magenta)]/20 bg-[var(--color-hazzi-magenta)]/5 rounded-2xl p-4 mb-5 shadow-sm text-center">
         <span className="text-[10px] font-bold text-[var(--color-hazzi-magenta)] tracking-widest uppercase mb-1.5 block">KEY BEHAVIOR PATTERN</span>
         <p className="text-[13px] font-bold text-gray-900 break-keep leading-relaxed">"{summary.keyMessage}"</p>
      </div>

      <div className="mb-4">
         <h3 className="font-bold text-sm mb-3 text-gray-900">지금 가장 권장할 실천 TOP 3</h3>
         <div className="grid grid-cols-3 gap-3">
            {summary.top3.map((action, idx) => (
               <div key={idx} className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm flex flex-col">
                  <div className="text-[var(--color-hazzi-magenta)] font-bold text-sm mb-1">0{idx + 1}</div>
                  <h4 className="font-bold text-[11px] text-gray-900 mb-1.5 leading-tight">{action.title}</h4>
                  <p className="text-[11px] text-gray-600 break-keep leading-tight">{action.action}</p>
               </div>
            ))}
         </div>
      </div>

      <div className="border border-gray-200 bg-gray-50 rounded-2xl p-4 mt-auto shadow-sm flex gap-4 items-center">
         <div className="shrink-0 bg-white border border-gray-200 rounded-xl p-2 w-16 text-center">
            <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">NEXT STEP</div>
            <div className="text-[11px] font-bold text-gray-900">Blueprint</div>
         </div>
         <div>
            <p className="text-[11px] font-bold text-gray-900 mb-0.5">분석이 끝났습니다.</p>
            <p className="text-[11px] text-gray-600 break-keep">다음 페이지에서 오늘 시작할 최소 행동과 나만의 습관 방식을 직접 설계해보세요. (다음 테스트 권장: 2~3주 후)</p>
         </div>
      </div>
    </ReportLayout>
  )
}
