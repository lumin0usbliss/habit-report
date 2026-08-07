"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"
import { results } from "@/data/results"
import { getCoreFormula } from "@/lib/reportMapping"

export function Page12Blueprint({ reportData }: { reportData: ReportData }) {
  const primary = results[reportData.primaryType]
  const coreFormula = getCoreFormula(reportData.primaryType, reportData.secondaryType, reportData.scores)

  return (
    <ReportLayout pageNumber={12}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase">
          MY HABIT BLUEPRINT
        </h1>
        <p className="text-gray-500 mt-2 text-xs">리포트 결과를 내 습관 하나에 바로 적용하는 설계도</p>
        <p className="text-gray-400 mt-1 text-[11px]">출력 후 직접 작성하거나, 앞으로 만들고 싶은 습관을 떠올리며 채워보세요.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 mb-6">
         <div className="border border-gray-400 bg-white rounded-2xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-900 text-sm mb-2">1. 내가 만들고 싶은 습관</h3>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-6"></div>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-6"></div>
         </div>
         <div className="border border-gray-400 bg-white rounded-2xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-900 text-sm mb-2">2. 이 습관이 나에게 중요한 이유</h3>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-6"></div>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-6"></div>
         </div>
         
         <div className="border border-gray-400 bg-white rounded-2xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-900 text-sm mb-1">3. 나의 최소 행동</h3>
            <p className="text-[11px] text-gray-500 mb-6">컨디션이 가장 나쁜 날에도 할 수 있는 수준</p>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-2"></div>
            <div className="flex gap-2 mt-4 flex-wrap">
               {["1분", "5분", "10분", "1회", "1페이지"].map(t => (
                  <div key={t} className="px-3 py-1 rounded-full bg-gray-100 text-[11px] text-gray-500 font-medium">{t}</div>
               ))}
            </div>
         </div>
         <div className="border border-gray-400 bg-white rounded-2xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-900 text-sm mb-1">4. 정상 루틴</h3>
            <p className="text-[11px] text-gray-500 mb-6">평소 컨디션일 때의 기본 행동</p>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-2"></div>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-6"></div>
         </div>

         <div className="border border-gray-400 bg-white rounded-2xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-900 text-sm mb-2">5. 지루해졌을 때 줄 변화 3가지</h3>
            <div className="space-y-3 flex-1 mt-2">
               <div className="text-xs text-gray-400">1. <span className="inline-block w-[90%] border-b border-gray-400 border-solid"></span></div>
               <div className="text-xs text-gray-400">2. <span className="inline-block w-[90%] border-b border-gray-400 border-solid"></span></div>
               <div className="text-xs text-gray-400">3. <span className="inline-block w-[90%] border-b border-gray-400 border-solid"></span></div>
            </div>
            <p className="text-[11px] text-gray-400 mt-3">예: 장소 / 시간 / 콘텐츠 / 도구 / 순서 / 동반자</p>
         </div>
         <div className="border border-gray-400 bg-white rounded-2xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-900 text-sm mb-2">6. 무너졌을 때 다시 시작하는 기준</h3>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-6 mb-3"></div>
            <div className="text-[11px] text-gray-400">추천: 24시간 안에 최소 행동 1회</div>
         </div>

         <div className="border border-gray-400 bg-white rounded-2xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-900 text-sm mb-4">7. 진행 상황을 확인할 방법</h3>
            <div className="flex gap-2 mb-6 flex-wrap">
               {["체크표", "사진", "한 줄 기록", "친구 공유", "앱"].map(t => (
                  <div key={t} className="px-3 py-1 rounded-full bg-gray-100 text-[11px] text-gray-500 font-medium">{t}</div>
               ))}
            </div>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-auto"></div>
         </div>
         <div className="border border-gray-400 bg-white rounded-2xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-900 text-sm mb-2">8. 이번 달 성공 기준</h3>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-4"></div>
            <div className="flex-1 border-b border-dashed border-gray-400 mt-6"></div>
         </div>
      </div>

      <div className="bg-[var(--color-hazzi-magenta)]/5 border border-[var(--color-hazzi-magenta)]/10 p-4 rounded-2xl shadow-sm mt-auto flex justify-between items-center">
         <div className="w-1/2">
            <div className="text-[11px] text-gray-500 font-bold tracking-widest uppercase mb-1">MY HABIT CONTRACT</div>
            <p className="text-xs font-bold text-gray-800 break-keep leading-relaxed">
               나는 완벽하게 지키는 것보다, 나에게 맞는 방식을 계속 조정하는 것을 목표로 한다.<br/>
               놓쳐도 다시 돌아오고, 지루하면 방법을 바꾸되 목표 자체는 버리지 않는다.
            </p>
         </div>
         <div className="w-1/2 text-center">
            <div className="text-lg font-bold text-[var(--color-hazzi-magenta)] mb-4">
               {coreFormula}
            </div>
            <div className="flex justify-center gap-4 text-[11px] text-gray-400 font-bold tracking-widest font-[family-name:var(--font-space)]">
               <div>SIGNED <span className="inline-block w-20 border-b border-gray-400 ml-1"></span></div>
               <div>DATE <span className="inline-block w-20 border-b border-gray-400 ml-1"></span></div>
            </div>
         </div>
      </div>
      
      <div className="text-center text-[11px] text-gray-300 mt-4 font-[family-name:var(--font-space)]">
         © 2026 HAZZI · PERSONAL HABIT PROFILE REPORT
      </div>

    </ReportLayout>
  )
}
