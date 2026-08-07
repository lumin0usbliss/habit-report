"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"
import { getFactorDetail } from "@/lib/reportMapping"

export function Page06FactorDetail({ reportData }: { reportData: ReportData }) {
  const dims: Array<keyof ReportData["scores"]> = [
    "initiation", "persistence", "recovery", "achievement",
    "relationship", "pressure", "exploration", "stimulation"
  ]

  const factorDetails = dims.map(d => getFactorDetail(d, reportData.scores[d], reportData.scores))
  
  // GAP Analysis
  const sorted = [...factorDetails].sort((a,b) => b.score - a.score)
  const maxFactor = sorted[0]
  const minFactor = sorted[sorted.length - 1]
  const gap = Math.round(maxFactor.score - minFactor.score)

  return (
    <ReportLayout pageNumber={6}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase">
          8 FACTOR DETAIL
        </h1>
        <p className="text-gray-500 mt-2 text-xs">8가지 성향 요인별 세부 분석과 맞춤 전략</p>
      </div>

      {/* 막대형 요약 그래프 영역 */}
      <div className="border border-gray-200 bg-white rounded-2xl px-5 py-4 shadow-sm flex flex-col mb-4">
        <div className="flex justify-between items-baseline mb-3">
          <h3 className="text-sm font-bold text-gray-900">상세 성향 요약</h3>
          <span className="text-[11px] text-gray-500">8가지 지표를 한눈에 파악할 수 있는 요약입니다.</span>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-3">
         {[
            { id: "START", label: "시작력", score: reportData.scores.initiation },
            { id: "PERSIST", label: "지속력", score: reportData.scores.persistence },
            { id: "RECOVER", label: "회복력", score: reportData.scores.recovery },
            { id: "ACHIEVE", label: "목표달성력", score: reportData.scores.achievement },
            { id: "SOCIAL", label: "관계지향성", score: reportData.scores.relationship },
            { id: "PRESSURE", label: "압력저항성", score: reportData.scores.pressure },
            { id: "EXPLORE", label: "탐구력", score: reportData.scores.exploration },
            { id: "STIMULUS", label: "자극추구", score: reportData.scores.stimulation },
         ].map((f) => (
            <div key={f.id} className="flex items-center gap-3">
               <div className="w-20 shrink-0 flex flex-col">
                 <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-0.5">{f.id}</span>
                 <span className="text-[11px] font-bold text-gray-900 leading-none">{f.label}</span>
               </div>
               
               <div className="flex-1 h-[8px] bg-gray-100 rounded-full overflow-hidden flex">
                 <div 
                   className="h-full bg-gray-800 rounded-full transition-all duration-500 ease-out" 
                   style={{ width: `${Math.max(0, Math.min(100, f.score))}%` }}
                 />
               </div>
               
               <div className="w-6 shrink-0 text-right text-[11px] font-bold text-gray-900">
                 {Math.round(f.score)}
               </div>
            </div>
         ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden mb-auto text-xs">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-[#FCFAFC] text-gray-500 border-b border-gray-200">
                  <th className="font-normal py-2 px-3 w-[12%]">지표</th>
                  <th className="font-normal py-2 px-3 w-[8%]">점수</th>
                  <th className="font-normal py-2 px-3 w-[10%]">수준</th>
                  <th className="font-normal py-2 px-3 w-[35%]">행동 해석</th>
                  <th className="font-normal py-2 px-3 w-[15%]">주의 포인트</th>
                  <th className="font-normal py-2 px-3 w-[20%]">추천 전략</th>
               </tr>
            </thead>
            <tbody>
               {factorDetails.map((f, i) => (
                  <tr key={f.name} className={i !== factorDetails.length - 1 ? 'border-b border-gray-200' : ''}>
                     <td className="py-2 px-3 font-bold text-gray-900">{f.name}</td>
                     <td className="py-2 px-3 text-gray-600">{Math.round(f.score)}</td>
                     <td className={`py-2 px-3 font-bold ${f.level === '높음' ? 'text-[var(--color-hazzi-magenta)]' : f.level === '낮음' ? 'text-gray-400' : 'text-amber-500'}`}>
                        {f.level}
                     </td>
                     <td className="py-2 px-3 text-gray-700 break-keep leading-relaxed">{f.action}</td>
                     <td className="py-2 px-3 text-gray-500 break-keep leading-relaxed">{f.caution}</td>
                     <td className="py-2 px-3 text-gray-900 font-medium break-keep leading-relaxed">{f.strategy}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      <div className="mt-auto flex justify-between gap-3">
         <div className="border border-gray-200 rounded-xl p-3 bg-white flex-1 text-center shadow-sm">
            <div className="text-sm font-bold text-[var(--color-hazzi-magenta)] mb-1">60 이상 · 높음</div>
            <p className="text-[11px] text-gray-500">현재 행동에 비교적 강하게 나타나는 경향</p>
         </div>
         <div className="border border-gray-200 rounded-xl p-3 bg-white flex-1 text-center shadow-sm">
            <div className="text-sm font-bold text-yellow-600 mb-1">40~59 · 보통</div>
            <p className="text-[11px] text-gray-500">환경과 상황에 따라 달라질 수 있는 경향</p>
         </div>
         <div className="border border-gray-200 rounded-xl p-3 bg-white flex-1 text-center shadow-sm">
            <div className="text-sm font-bold text-gray-400 mb-1">39 이하 · 낮음</div>
            <p className="text-[11px] text-gray-500">보완 장치를 두면 효과가 큰 영역</p>
         </div>
      </div>
      
      <div className="text-center text-[10px] text-gray-400 mt-3">
         점수는 절대적 우열이 아니라 습관 설계 시 우선순위를 정하기 위한 상대 지표입니다.
      </div>

    </ReportLayout>
  )
}
