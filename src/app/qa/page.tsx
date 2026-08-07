import { Page01Profile } from "@/components/report/pages/Page01Profile"
import { Page02Combination } from "@/components/report/pages/Page02Combination"
import { Page03Snapshot1 } from "@/components/report/pages/Page03Snapshot1"
import { Page04BehaviorPattern } from "@/components/report/pages/Page04BehaviorPattern"
import { Page05FailureMap } from "@/components/report/pages/Page05FailureMap"
import { Page06FactorDetail } from "@/components/report/pages/Page06FactorDetail"
import { Page07Snapshot2 } from "@/components/report/pages/Page07Snapshot2"
import { Page08Environment } from "@/components/report/pages/Page08Environment"
import { Page09Prescription } from "@/components/report/pages/Page09Prescription"
import { Page10Plan } from "@/components/report/pages/Page10Plan"
import { Page11Summary } from "@/components/report/pages/Page11Summary"
import { Page12Blueprint } from "@/components/report/pages/Page12Blueprint"

import type { ReportData } from "@/lib/reportData"
import type { TypeCode } from "@/data/questions"
import { ReportThumbnail } from "@/components/report/ReportThumbnail"

function makeQAData(id: string, primary: TypeCode, secondary: TypeCode, scores: ReportData["scores"]): ReportData {
  return {
    reportId: id,
    reportDate: new Date().toISOString(),
    primaryType: primary,
    secondaryType: secondary,
    scores,
    answers: [
      { questionId: "q1", category: "동기/의미", question: "나는 목표가 중요하다", answer: scores.initiation > 50 ? 5 : 2, reverse: false },
      { questionId: "q2", category: "동기/의미", question: "나는 과정을 즐긴다", answer: scores.persistence > 50 ? 4 : 2, reverse: false },
      { questionId: "q3", category: "동기/의미", question: "나는 의미를 찾는다", answer: scores.exploration > 50 ? 5 : 3, reverse: false },
      { questionId: "q4", category: "시작 행동", question: "나는 계획을 세운다", answer: scores.achievement > 50 ? 4 : 2, reverse: false },
      { questionId: "q5", category: "시작 행동", question: "나는 빠르게 시작한다", answer: scores.initiation > 50 ? 5 : 1, reverse: false },
      { questionId: "q6", category: "시작 행동", question: "나는 준비를 철저히 한다", answer: scores.pressure > 50 ? 4 : 2, reverse: false },
      { questionId: "q7", category: "유지 행동", question: "나는 꾸준히 한다", answer: scores.persistence > 50 ? 5 : 1, reverse: false },
      { questionId: "q8", category: "유지 행동", question: "나는 사람들과 함께한다", answer: scores.relationship > 50 ? 5 : 1, reverse: false },
      { questionId: "q9", category: "유지 행동", question: "나는 회복이 빠르다", answer: scores.recovery > 50 ? 5 : 2, reverse: false },
      { questionId: "q10", category: "이탈 행동", question: "나는 쉽게 포기한다", answer: scores.persistence < 50 ? 5 : 1, reverse: true },
      { questionId: "q11", category: "이탈 행동", question: "나는 재미를 잃는다", answer: scores.stimulation > 50 ? 5 : 2, reverse: false },
      { questionId: "q12", category: "이탈 행동", question: "나는 압박을 피한다", answer: scores.pressure < 50 ? 5 : 2, reverse: false },
    ]
  }
}

const qaCases = [
  makeQAData("CASE_A", "T7", "T4", {
    initiation: 80, persistence: 30, recovery: 40, achievement: 50, relationship: 60, pressure: 40, exploration: 70, stimulation: 85
  }), // 시작력 높음, 지속력 낮음, 자극추구 높음
  makeQAData("CASE_B", "T1", "T2", {
    initiation: 30, persistence: 85, recovery: 60, achievement: 70, relationship: 80, pressure: 70, exploration: 40, stimulation: 30
  }), // 시작력 낮음, 지속력 높음, 관계지향성 높음
  makeQAData("CASE_C", "T8", "T3", {
    initiation: 60, persistence: 50, recovery: 45, achievement: 85, relationship: 30, pressure: 20, exploration: 80, stimulation: 50
  }), // 압력저항성 낮음, 목표달성력 높음, 탐구력 높음
  makeQAData("CASE_D", "T5", "T6", {
    initiation: 50, persistence: 55, recovery: 50, achievement: 45, relationship: 50, pressure: 55, exploration: 50, stimulation: 45
  }), // 모두 중간
  makeQAData("CASE_E", "T9", "T1", {
    initiation: 90, persistence: 85, recovery: 80, achievement: 80, relationship: 85, pressure: 90, exploration: 85, stimulation: 80
  }), // 모두 높음
]

export default function QAPage() {
  return (
    <div className="bg-gray-100 min-h-screen py-10 flex flex-col items-center gap-10">
      {qaCases.map(c => (
        <div key={c.reportId} className="w-[1000px] bg-white p-10 shadow-2xl rounded-2xl flex flex-col gap-10">
          <h1 className="text-4xl font-bold border-b pb-4">{c.reportId} QA</h1>
          <div className="grid grid-cols-2 gap-10">
             <ReportThumbnail><Page01Profile reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page02Combination reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page03Snapshot1 reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page04BehaviorPattern reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page05FailureMap reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page06FactorDetail reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page07Snapshot2 reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page08Environment reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page09Prescription reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page10Plan reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page11Summary reportData={c} /></ReportThumbnail>
             <ReportThumbnail><Page12Blueprint reportData={c} /></ReportThumbnail>
          </div>
        </div>
      ))}
    </div>
  )
}
