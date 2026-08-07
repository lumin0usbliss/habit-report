"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"
import { getEnvironmentLevels } from "@/lib/reportMapping"

export function Page08Environment({ reportData }: { reportData: ReportData }) {
  const levels = getEnvironmentLevels(reportData.scores)

  const items = [
    { label: "자율성 필요도", score: levels.autonomy },
    { label: "변화 필요도", score: levels.change },
    { label: "외부 압박 허용도", score: levels.pressureTolerance },
    { label: "사회적 연결 필요도", score: levels.social },
    { label: "기록 적합도", score: levels.record },
  ]

  // 행동 패턴 동적 생성
  const patterns: string[] = []
  
  if (reportData.scores.stimulation >= 60) patterns.push("새로운 방법이 보이면 바로 시도해보고 싶어집니다.")
  if (reportData.scores.persistence < 50) patterns.push("같은 방식이 반복되면 쉽게 지루해질 수 있습니다.")
  if (reportData.scores.pressure < 50) patterns.push("강한 압박을 받을수록 행동 의지가 떨어질 수 있습니다.")
  if (reportData.scores.relationship >= 60) patterns.push("혼자보다 누군가와 가볍게 공유할 때 유지가 잘 됩니다.")
  if (reportData.scores.exploration >= 60) patterns.push("새로운 정보나 방법을 발견하면 직접 실험해보고 싶어집니다.")
  if (reportData.scores.achievement < 50) patterns.push("목표가 너무 크면 시작보다 부담이 먼저 느껴질 수 있습니다.")
  if (reportData.scores.recovery < 50) patterns.push("한 번 루틴이 끊기면 다시 시작하는 데 시간이 걸릴 수 있습니다.")
  if (reportData.scores.initiation >= 60) patterns.push("관심이 생긴 목표는 비교적 빠르게 시작하는 편입니다.")
  if (reportData.scores.pressure >= 60) patterns.push("적당한 데드라인과 외부의 기대가 있을 때 집중이 잘 됩니다.")
  if (reportData.scores.persistence >= 60) patterns.push("한 번 정해진 루틴을 꾸준히 반복하는 것을 선호합니다.")
  if (reportData.scores.initiation < 50) patterns.push("시작하기 전 완벽한 준비와 정보를 갖추고 싶어합니다.")

  if (patterns.length < 5) patterns.push("기분과 컨디션에 따라 실행력 차이가 큰 편입니다.")
  if (patterns.length < 5) patterns.push("목표가 나에게 의미 없다고 느껴지면 지속하기 어렵습니다.")
  if (patterns.length < 5) patterns.push("현재의 나를 변화시키고 싶다는 생각이 많습니다.")
  if (patterns.length < 5) patterns.push("나에게 딱 맞는 최적의 방식을 찾고 싶어합니다.")

  const finalPatterns = patterns.slice(0, 5)

  return (
    <ReportLayout pageNumber={8}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase">
          ENVIRONMENT GUIDE
        </h1>
        <p className="text-gray-500 mt-1 text-[11px]">나에게 필요한 환경 조건과 적합한 관리 방식</p>
      </div>

      <div className="border border-gray-200 bg-white rounded-2xl p-5 mb-4 shadow-sm">
         <div className="space-y-4">
            {items.map(item => (
               <div key={item.label} className="flex items-center gap-4">
                  <div className="w-32 font-bold text-gray-900 text-sm">{item.label}</div>
                  <div className="text-[10px] text-gray-400 font-bold font-[family-name:var(--font-space)] w-8">LOW</div>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full relative">
                     <div 
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--color-hazzi-magenta)] rounded-full shadow-sm"
                        style={{ left: `calc(${Math.max(5, Math.min(95, item.score))}% - 8px)` }}
                     />
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold font-[family-name:var(--font-space)] w-8 text-right">HIGH</div>
               </div>
            ))}
         </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-sm mb-2 text-gray-900 flex items-center gap-2">
           이런 모습이 자주 나타나요
           <span className="text-[10px] text-[var(--color-hazzi-magenta)] tracking-widest uppercase font-normal">Common Patterns</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
           {finalPatterns.map((p, idx) => (
              <div key={idx} className="border border-gray-200 bg-white rounded-lg p-2.5 shadow-sm flex gap-2 items-start">
                 <span className="text-[var(--color-hazzi-magenta)] font-bold text-[10px] mt-0.5">✓</span>
                 <span className="text-[11px] text-gray-700 break-keep leading-tight font-medium">{p}</span>
              </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
         <div className="border border-gray-200 bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-[13px] mb-3 text-gray-900">BEST CONDITION</h3>
            <ul className="space-y-2.5 text-[11px] text-gray-700 font-medium">
               {levels.autonomy > 50 && <li className="flex gap-2"><span className="text-[var(--color-hazzi-magenta)] font-bold">✓</span> 내가 직접 고른 목표와 방식</li>}
               {levels.change > 50 && <li className="flex gap-2"><span className="text-[var(--color-hazzi-magenta)] font-bold">✓</span> 주 1회 정도 변화 요소 추가</li>}
               {levels.social > 50 && <li className="flex gap-2"><span className="text-[var(--color-hazzi-magenta)] font-bold">✓</span> 가벼운 진행 공유가 가능한 사람</li>}
               {levels.record > 50 && <li className="flex gap-2"><span className="text-[var(--color-hazzi-magenta)] font-bold">✓</span> 결과뿐 아니라 과정도 명확히 기록</li>}
               <li className="flex gap-2"><span className="text-[var(--color-hazzi-magenta)] font-bold">✓</span> 목적이 한 문장으로 설명 가능</li>
            </ul>
         </div>
         <div className="border border-gray-200 bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-[13px] mb-3 text-gray-900">AVOID CONDITION</h3>
            <ul className="space-y-2.5 text-[11px] text-gray-700 font-medium">
               {levels.pressureTolerance < 50 && <li className="flex gap-2"><span className="text-gray-400 font-bold">×</span> 지나친 통제와 압박</li>}
               {levels.change > 50 && <li className="flex gap-2"><span className="text-gray-400 font-bold">×</span> 매일 똑같은 방식만 반복</li>}
               {levels.pressureTolerance < 50 && <li className="flex gap-2"><span className="text-gray-400 font-bold">×</span> 실패 시 벌금·처벌 중심</li>}
               <li className="flex gap-2"><span className="text-gray-400 font-bold">×</span> 한 번 놓치면 전체 계획 초기화</li>
               {levels.record < 50 && <li className="flex gap-2"><span className="text-gray-400 font-bold">×</span> 숫자 성과만으로 자기 평가</li>}
            </ul>
         </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-base mb-3 text-gray-900">환경 레시피</h3>
        <div className="grid grid-cols-2 gap-4">
           <div className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm">
              <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">SPACE</div>
              <div className="font-bold text-gray-900 text-sm mb-1 leading-tight">
                 익숙함 {100 - Math.round(levels.change)} / 새로움 {Math.round(levels.change)}
              </div>
              <p className="text-[11px] text-gray-500 break-keep">완전히 낯선 환경보다 한 요소씩 바꾸는 것이 유리합니다.</p>
           </div>
           <div className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm">
              <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">FEEDBACK</div>
              <div className="font-bold text-gray-900 text-sm mb-1 leading-tight">
                 주 {Math.max(1, Math.round(levels.social / 20))}~{Math.max(2, Math.round(levels.social / 15))}회 체크인
              </div>
              <p className="text-[11px] text-gray-500 break-keep">매일 강박적인 인증 대신 짧은 체크인이 적합합니다.</p>
           </div>
        </div>
      </div>

      <div className="bg-[var(--color-hazzi-magenta)]/5 border border-[var(--color-hazzi-magenta)]/20 rounded-2xl p-4 mt-6 relative">
         <div className="absolute top-4 right-4">
            <span className="bg-white text-[var(--color-hazzi-magenta)] border border-[var(--color-hazzi-magenta)]/20 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              PERSONALIZED ANALYSIS
            </span>
         </div>
         <div className="text-[10px] font-bold text-[var(--color-hazzi-magenta)] tracking-widest uppercase mb-1">ENVIRONMENT SUMMARY</div>
         <p className="text-xs text-gray-800 break-keep leading-relaxed pr-24">
            {levels.autonomy > 60 ? "자율성이 확보되었을 때 행동 동기가 가장 잘 유지됩니다." : "자율성보다 명확하게 정해진 룰과 시스템이 필요합니다."} {levels.change > 60 ? "환경을 크게 바꾸기보다 작은 요소라도 정기적인 변화가 일어나는 구조를 만들어두세요." : "매번 환경이 바뀌는 것보다 안정적으로 고정된 상황에서 지속력이 높아집니다."}
         </p>
      </div>

    </ReportLayout>
  )
}
