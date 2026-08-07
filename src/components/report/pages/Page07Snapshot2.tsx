"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"
import { getCategoryTopAnswers } from "@/lib/reportData"

export function Page07Snapshot2({ reportData }: { reportData: ReportData }) {
  // Page 7: Section A = cat6 (생활 습관 및 컨디션 확인), Section B = cat7 (사람 관계와 실행 동력)
  const section1 = getCategoryTopAnswers(reportData, "cat6", 3)
  const section2 = getCategoryTopAnswers(reportData, "cat7", 3)

  const cat1Name = "생활 습관 및 컨디션 확인"
  const cat2Name = "사람 관계와 실행 동력"

  const qNumsA = section1.map(q => `Q${String(q.questionNumber).padStart(2, '0')}`).join(', ')
  const qNumsB = section2.map(q => `Q${String(q.questionNumber).padStart(2, '0')}`).join(', ')

  const renderRadios = (answerValue: number) => {
    return (
      <div className="flex justify-between items-center w-64 mx-auto my-3 relative">
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gray-300 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3, 4, 5].map((val) => (
          <div 
            key={val} 
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white
              ${val === answerValue 
                ? 'border-[var(--color-hazzi-magenta)] bg-[var(--color-hazzi-magenta)] text-white shadow-sm shadow-pink-200' 
                : 'border-gray-400'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <ReportLayout pageNumber={7}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase flex items-center gap-2">
          MY ANSWER SNAPSHOT <span className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">2</span>
        </h1>
        <p className="text-gray-500 mt-2 text-xs">나의 선택에서 발견된 유지 방식과 관계 동력 패턴</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-gray-900">
          A. {cat1Name} <span className="text-[10px] text-[var(--color-hazzi-magenta)] tracking-widest font-normal uppercase ml-2">3문항</span>
        </h3>
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
           {section1.length > 0 ? section1.map((ans, idx) => (
              <div key={ans.questionId} className={`p-3 ${idx !== section1.length - 1 ? 'border-b border-gray-200' : ''}`}>
                 <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-[var(--color-hazzi-magenta)] mr-3 mt-0.5 tracking-widest">
                      Q{String(ans.questionNumber).padStart(2, '0')}
                    </span>
                    <p className="flex-1 font-bold text-gray-900 break-keep leading-relaxed text-sm">{ans.question}</p>
                    <span className="text-xs text-gray-400 font-[family-name:var(--font-space)] font-bold">{ans.answer} / 5</span>
                 </div>
                 
                 <div className="px-10 mt-4 relative">
                    <div className="flex justify-between text-[11px] text-gray-400 font-bold absolute left-2 right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                       <span>전혀 아니다</span>
                       <span>매우 그렇다</span>
                    </div>
                    {renderRadios(ans.answer)}
                 </div>
              </div>
           )) : <div className="p-4 text-sm text-gray-500">해당 카테고리의 응답이 없습니다.</div>}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-gray-900">
          B. {cat2Name} <span className="text-[10px] text-[var(--color-hazzi-magenta)] tracking-widest font-normal uppercase ml-2">3문항</span>
        </h3>
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
           {section2.length > 0 ? section2.map((ans, idx) => (
              <div key={ans.questionId} className={`p-3 ${idx !== section2.length - 1 ? 'border-b border-gray-200' : ''}`}>
                 <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-[var(--color-hazzi-magenta)] mr-3 mt-0.5 tracking-widest">
                      Q{String(ans.questionNumber).padStart(2, '0')}
                    </span>
                    <p className="flex-1 font-bold text-gray-900 break-keep leading-relaxed text-sm">{ans.question}</p>
                    <span className="text-xs text-gray-400 font-[family-name:var(--font-space)] font-bold">{ans.answer} / 5</span>
                 </div>
                 
                 <div className="px-10 mt-4 relative">
                    <div className="flex justify-between text-[11px] text-gray-400 font-bold absolute left-2 right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                       <span>전혀 아니다</span>
                       <span>매우 그렇다</span>
                    </div>
                    {renderRadios(ans.answer)}
                 </div>
              </div>
           )) : <div className="p-4 text-sm text-gray-500">해당 카테고리의 응답이 없습니다.</div>}
        </div>
      </div>

      <div className="flex flex-col mt-auto bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm relative">
         <div className="absolute top-4 right-4">
            <span className="bg-[var(--color-hazzi-magenta)]/10 text-[var(--color-hazzi-magenta)] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              BASED ON YOUR RESPONSE
            </span>
         </div>
         <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">RESPONSE SIGNAL</div>
         
         <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-gray-900 leading-relaxed break-keep">
              A그룹의 {qNumsA || "주요 문항"}과 B그룹의 {qNumsB || "주요 문항"} 응답이 유지 및 관계 동력을 결정짓는 핵심 지표입니다.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed break-keep">
              이 선택들은 전체 점수 조합에서 나타난 "{reportData.scores.pressure > 60 ? '강한 책임감 기반 유지' : '외부 환경 변화에 민감한 태도'}와 {reportData.scores.relationship > 60 ? '타인과의 상호작용 의존도' : '독립적인 실행 방식'}"를 가장 잘 설명합니다. 역문항 계산 여부와 무관하게 사용자가 실제 선택한 1~5점 답항 위치를 그대로 보여줍니다.
            </p>
         </div>
      </div>
    </ReportLayout>
  )
}
