"use client"

import { ReportLayout } from "../ReportLayout"
import type { ReportData } from "@/lib/reportData"
import { results } from "@/data/results"
import { getCorePriorities } from "@/lib/reportMapping"

export function Page09Prescription({ reportData }: { reportData: ReportData }) {
  const primary = results[reportData.primaryType]
  const priorities = getCorePriorities(reportData.scores)
  const isHighChange = reportData.scores.stimulation >= 50 || reportData.scores.exploration >= 50
  
  const actionGuide = [
    { step: "01", title: "시작 전", desc: "습관의 개인적 이유를 1문장으로 작성" },
    { step: "02", title: "시작일", desc: "컨디션이 나빠도 가능한 최소 행동 설정" },
    { step: "03", title: "3일차", desc: "실제 난이도와 부담감을 점검해 조정" },
    { step: "04", title: "7일차", desc: "지루함 방지용 변화 요소 1개 추가" },
    { step: "05", title: "14일차", desc: "유지 여부보다 '나와 맞는 방식' 평가" },
    { step: "06", title: "중단 시", desc: "24시간 안에 최소 행동으로 재시작" },
  ]

  // 맞춤 실천 체크리스트 동적 생성
  const checklist: string[] = []
  if (reportData.scores.persistence < 50) {
    checklist.push("컨디션이 좋지 않은 날의 최소 행동을 미리 정한다.")
    checklist.push("하루를 놓쳐도 다음 날 바로 최소 행동으로 복귀한다.")
  } else {
    checklist.push("안정적인 루틴을 위해 일정한 시간과 장소를 확보한다.")
  }

  if (reportData.scores.stimulation >= 60) {
    checklist.push("같은 목표는 유지하되 방법에 작은 변화를 준다.")
    checklist.push("7~14일마다 장소·도구·방식 중 하나를 바꾼다.")
  }

  if (reportData.scores.pressure < 40) {
    checklist.push("목표를 크게 잡기보다 최소 기준을 먼저 정한다.")
    checklist.push("강제적인 인증보다 가벼운 기록 방식을 선택한다.")
  }

  if (reportData.scores.relationship >= 60) {
    checklist.push("한 명의 파트너에게 진행 상황을 가볍게 공유한다.")
  }

  if (reportData.scores.exploration >= 60) {
    checklist.push("새로운 방법을 시도하되 한 번에 하나만 실험한다.")
  }

  if (reportData.scores.achievement < 50) {
    checklist.push("결과 목표를 단계별 마일스톤으로 나눈다.")
  }

  if (reportData.scores.recovery < 50) {
    checklist.push("중단 후 24시간 안에 최소 행동으로 다시 시작한다.")
  }

  // 항목이 부족할 경우 기본값 추가
  if (checklist.length < 4) checklist.push("인증 방식이나 기록 방식을 주기적으로 바꾼다.")
  if (checklist.length < 4) checklist.push("실행 전후의 기분을 한 단어로 기록한다.")
  if (checklist.length < 4) checklist.push("남의 기록보다 지난 나의 기록과 비교한다.")
  if (checklist.length < 4) checklist.push("작은 성공을 시각적으로 확인할 수 있게 표시한다.")

  const finalChecklist = checklist.slice(0, 4)

  // D-1 첫 행동 동적 생성
  let firstAction = {
    title: "오늘 할 최소 행동 정하기",
    desc: "5분 안에 할 수 있는 행동을 하나 적어보세요."
  }
  if (reportData.primaryType === 'T8' && reportData.secondaryType === 'T1') {
    firstAction = {
      title: "나만의 인증 방식 정하기",
      desc: "오늘의 감정을 담은 사진 한 장을 남겨보세요."
    }
  } else if (reportData.primaryType === 'T1') {
    firstAction = {
      title: "가장 쉬운 시작점 찾기",
      desc: "내일 아침 눈뜨자마자 할 1분짜리 행동을 정해보세요."
    }
  } else if (reportData.scores.relationship >= 60) {
    firstAction = {
      title: "함께할 사람에게 선언하기",
      desc: "가장 편한 친구에게 나의 시작을 가볍게 카톡으로 알려보세요."
    }
  }

  return (
    <ReportLayout pageNumber={9}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase">
          HABIT PRESCRIPTION
        </h1>
        <p className="text-gray-500 mt-2 text-xs">나의 {primary.name.split(' ').pop()}를 위한 맞춤 처방전</p>
      </div>

      <div className="border border-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden mb-5">
         <div className="bg-[#FCFAFC] px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-sm">6-STEP 행동 디자인</h3>
            <span className="text-[11px] font-bold text-[var(--color-hazzi-magenta)] tracking-widest uppercase bg-[var(--color-hazzi-magenta)]/10 px-2 py-1 rounded-full">ACTION GUIDE</span>
         </div>
         <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-6">
            {actionGuide.map((g) => (
               <div key={g.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">{g.step}</div>
                  <div className="flex-1">
                     <h4 className="font-bold text-gray-900 text-xs mb-0.5">{g.title}</h4>
                     <p className="text-[11px] text-gray-600 break-keep leading-tight">{g.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="flex flex-col mt-2">
         <div className="flex items-baseline gap-2 mb-2">
            <h3 className="font-bold text-[16px] text-gray-900">맞춤 실천 체크리스트</h3>
            <span className="text-[11px] text-[var(--color-hazzi-magenta)] font-normal tracking-widest uppercase">Personal Action Checklist</span>
         </div>
         
         <div className="flex gap-2 mb-3">
            <span className="bg-[var(--color-hazzi-magenta)]/10 text-[var(--color-hazzi-magenta)] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              YOUR PRIORITY
            </span>
            <span className="text-[11px] font-bold text-gray-700 flex gap-2">
              <span className="text-[var(--color-hazzi-magenta)]">1.</span> {priorities[0].title} 
              <span className="text-gray-300">|</span> 
              <span className="text-gray-400">2.</span> {priorities[1].title} 
              <span className="text-gray-300">|</span> 
              <span className="text-gray-400">3.</span> {priorities[2].title}
            </span>
         </div>
         
         <div className="flex flex-col gap-2">
            {finalChecklist.map((item, idx) => (
               <div key={idx} className="border border-gray-200 bg-white rounded-xl px-4 py-3 shadow-sm flex items-center gap-4">
                  <div className="text-[var(--color-hazzi-magenta)] font-bold text-sm tracking-wider w-6 shrink-0">0{idx + 1}</div>
                  <div className="text-xs text-gray-900 font-medium break-keep leading-tight">{item}</div>
               </div>
            ))}
            
            {/* D-1 첫 행동 */}
            <div className="border border-pink-200 bg-pink-50 rounded-xl px-4 py-3 shadow-sm flex items-center gap-4 mt-1">
               <div className="flex flex-col items-center w-14 shrink-0">
                  <div className="text-[var(--color-hazzi-magenta)] font-extrabold text-[15px] tracking-wider leading-none mb-1">D-1</div>
                  <div className="text-[10px] bg-[var(--color-hazzi-magenta)] text-white font-bold px-1.5 py-0.5 rounded whitespace-nowrap">수행 전 단계</div>
               </div>
               <div className="flex flex-col">
                  <div className="text-xs font-bold text-gray-900 mb-1">{firstAction.title}</div>
                  <div className="text-[11px] text-gray-600 break-keep leading-tight">"{firstAction.desc}"</div>
               </div>
            </div>
         </div>
      </div>
    </ReportLayout>
  )
}
