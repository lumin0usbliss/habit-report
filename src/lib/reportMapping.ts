import type { TypeCode } from "@/data/questions"
import type { ReportData } from "./reportData"
import { results } from "@/data/results"
import type { DimensionId } from "@/data/scoring"

export interface CombinationAnalysis {
  coreMotivation: string
  startTrigger: string
  dropTrigger: string
  maintenanceKey: string
  combinationSignal: {
    reaction: "높음" | "중간" | "낮음"
    changeNeed: "높음" | "중간" | "낮음"
    endurance: "높음" | "중간" | "낮음"
    pressureTolerance: "높음" | "중간" | "낮음"
  }
  scoreSignal: { 
    label: string; 
    scores: { name: string; score: number; trend: "↑" | "↓" | "-" }[]; 
    desc: string 
  }
}

// 1. 유형별 핵심 트리거 매핑
const typeTriggers: Record<TypeCode, { motivation: string, start: string, drop: string, maintain: string }> = {
  T1: { motivation: "완성도와 책임감", start: "명확한 계획과 기준", drop: "실패로 인한 완벽주의 자극", maintain: "작은 실천도 인정하는 기준" },
  T2: { motivation: "누군가에게 도움이 됨", start: "함께하는 약속", drop: "반응이나 피드백 부재", maintain: "가벼운 인증과 상호 응원" },
  T3: { motivation: "눈에 보이는 성과", start: "도전적인 목표", drop: "성과가 보이지 않을 때", maintain: "매일의 작은 실행 기록" },
  T4: { motivation: "개인적인 의미와 가치", start: "새로운 방식과 환경", drop: "의미 상실과 반복", maintain: "의미 발견과 자율성 보장" },
  T5: { motivation: "이해와 원리 파악", start: "충분한 정보와 준비", drop: "정보 부족과 불확실성", maintain: "관찰 중심의 가벼운 기록" },
  T6: { motivation: "안정감과 신뢰", start: "예상 가능한 일정", drop: "갑작스러운 계획 변경", maintain: "비상 계획(플랜 B) 마련" },
  T7: { motivation: "재미와 호기심", start: "새로운 도구와 자극", drop: "익숙함과 지루함", maintain: "정기적인 방식 변경" },
  T8: { motivation: "주도적인 결정", start: "자신만의 규칙 설정", drop: "타인의 간섭과 통제", maintain: "스스로 정한 최소 목표" },
  T9: { motivation: "부담 없는 자연스러움", start: "기존 일정에 연결", drop: "높은 난이도와 갈등", maintain: "하루 1가지 최우선 행동" },
}

export function getCombinationAnalysis(primary: TypeCode, secondary: TypeCode, scores: ReportData["scores"]): CombinationAnalysis {
  const pTrigger = typeTriggers[primary]
  const sTrigger = typeTriggers[secondary]

  let signalLabel = ""
  let signalDesc = ""
  let selectedScores: { name: string; score: number; trend: "↑" | "↓" | "-" }[] = []

  // 특징적인 조합 분석
  if (scores.initiation > 60 && scores.persistence < 50) {
    signalLabel = "빠른 시작과 조기 이탈 패턴"
    signalDesc = `"시작하고 싶은 에너지"는 높지만 반복 구간 관리가 특히 중요하다는 것을 보여줍니다.`
    selectedScores = [
      { name: "시작력", score: Math.round(scores.initiation), trend: "↑" },
      { name: "지속력", score: Math.round(scores.persistence), trend: "↓" }
    ]
  } else if (scores.pressure < 45 && scores.relationship < 45) {
    signalLabel = "자율성 기반 독립 패턴"
    signalDesc = `외부의 강한 압박이나 공유보다 스스로 정한 자율적 기준에서 동기가 유지됩니다.`
    selectedScores = [
      { name: "압력저항", score: Math.round(scores.pressure), trend: "↓" },
      { name: "관계지향", score: Math.round(scores.relationship), trend: "↓" }
    ]
  } else if (scores.achievement > 60 && scores.exploration > 60) {
    signalLabel = "목표 주도형 탐구 패턴"
    signalDesc = `단순한 호기심보다 명확한 목표를 달성하기 위한 도구와 방식을 적극적으로 찾습니다.`
    selectedScores = [
      { name: "목표달성", score: Math.round(scores.achievement), trend: "↑" },
      { name: "탐구력", score: Math.round(scores.exploration), trend: "↑" }
    ]
  } else {
    signalLabel = "균형잡힌 동기 유지 패턴"
    signalDesc = `전반적인 지표가 고르게 분포하여 급격한 이탈 없이 안정적인 유지력을 보여줍니다.`
    selectedScores = [
      { name: "지속력", score: Math.round(scores.persistence), trend: scores.persistence > 55 ? "↑" : "-" },
      { name: "회복력", score: Math.round(scores.recovery), trend: scores.recovery > 55 ? "↑" : "-" }
    ]
  }

  return {
    coreMotivation: pTrigger.motivation,
    startTrigger: sTrigger.start,
    dropTrigger: pTrigger.drop,
    maintenanceKey: `${pTrigger.maintain} + ${sTrigger.maintain.split(" ")[0]}`,
    combinationSignal: {
      reaction: ["T3", "T7", "T4", "T8"].includes(primary) ? "높음" : "중간",
      changeNeed: ["T4", "T7"].includes(primary) || ["T4", "T7"].includes(secondary) ? "높음" : "낮음",
      endurance: ["T1", "T6", "T9"].includes(primary) ? "높음" : "중간",
      pressureTolerance: ["T8", "T3"].includes(primary) ? "높음" : "낮음",
    },
    scoreSignal: {
      label: signalLabel,
      scores: selectedScores,
      desc: signalDesc
    }
  }
}

// 2. 행동 패턴 매핑
export function getBehaviorPatterns(scores: ReportData["scores"]) {
  const patterns = []
  
  // 패턴 1: 시작력과 지속력 관계
  if (scores.initiation >= scores.persistence + 15) {
    patterns.push({
      title: "빠른 시작, 빠른 이탈 패턴",
      observe: "새로운 방식을 발견하면 비교적 쉽게 행동으로 옮깁니다.",
      strength: "기회 포착이 빠르고 첫 행동까지 시간이 짧습니다.",
      risk: "새로운 것을 시작한 만족감이 지속 만족감보다 클 수 있습니다.",
      prescription: "새 습관은 동시에 최대 2개로 제한하세요.",
      scoreSignal: `시작력 ${Math.round(scores.initiation)} ↑ / 지속력 ${Math.round(scores.persistence)} ↓`
    })
  } else if (scores.persistence >= scores.initiation + 15) {
    patterns.push({
      title: "신중한 진입, 강한 유지 패턴",
      observe: "시작은 다소 느리지만 한 번 시작하면 오래 유지합니다.",
      strength: "장기적인 유지 능력과 내구도가 좋습니다.",
      risk: "완벽한 준비를 하려다 시작 자체를 미룰 수 있습니다.",
      prescription: "시작 기준을 5분 이하의 '최소 행동'으로 낮추세요.",
      scoreSignal: `지속력 ${Math.round(scores.persistence)} ↑ / 시작력 ${Math.round(scores.initiation)} ↓`
    })
  } else {
    patterns.push({
      title: "안정적인 흐름 진입 패턴",
      observe: "시작과 유지 사이의 에너지 차이가 적습니다.",
      strength: "시작한 일을 예상된 흐름대로 무난하게 이어갑니다.",
      risk: "익숙해지면 매너리즘에 빠질 수 있습니다.",
      prescription: "한 달에 한 번씩 방식에 작은 변화를 주세요.",
      scoreSignal: `시작력 ${Math.round(scores.initiation)} ≒ 지속력 ${Math.round(scores.persistence)}`
    })
  }

  // 패턴 2: 자극과 목표의 관계
  if (scores.stimulation > 60 && scores.achievement < 50) {
    patterns.push({
      title: "목표보다 과정의 재미를 쫓는 패턴",
      observe: "결과가 멀어도 과정이 흥미로우면 잘 움직입니다.",
      strength: "다양한 시도를 통해 자신만의 방식을 잘 찾습니다.",
      risk: "완료 기준이 모호하면 마무리가 약할 수 있습니다.",
      prescription: "7일 단위로 짧은 성과(마일스톤)를 정해두세요.",
      scoreSignal: `자극추구 ${Math.round(scores.stimulation)} ↑ / 목표달성 ${Math.round(scores.achievement)} ↓`
    })
  } else if (scores.achievement > 60) {
    patterns.push({
      title: "눈앞의 결과를 향해 직진하는 패턴",
      observe: "결과가 명확할 때 강한 에너지를 발휘합니다.",
      strength: "단기 집중력이 뛰어나고 목표 달성률이 높습니다.",
      risk: "결과가 늦게 나오면 쉽게 지칠 수 있습니다.",
      prescription: "결과뿐 아니라 과정 자체에 점수를 부여하세요.",
      scoreSignal: `목표달성 ${Math.round(scores.achievement)} ↑`
    })
  } else {
    patterns.push({
      title: "꾸준히 빈도를 쌓아가는 패턴",
      observe: "결과와 무관하게 반복 자체를 잘 유지합니다.",
      strength: "루틴이 형성되면 쉽게 무너지지 않습니다.",
      risk: "잘못된 방식이라도 습관적으로 반복할 수 있습니다.",
      prescription: "한 달에 한 번은 방향성을 점검하세요.",
      scoreSignal: `목표달성 ${Math.round(scores.achievement)} -`
    })
  }

  // 패턴 3: 압력저항(PERFECT) vs 관계(SOCIAL)
  if (scores.pressure < 45) {
    patterns.push({
      title: "압박보다 가벼운 연결이 효과적인 패턴",
      observe: "강한 감시나 경쟁보다 가벼운 공유에서 행동이 유지됩니다.",
      strength: "자율성이 확보되면 자신의 기준을 잘 찾습니다.",
      risk: "매일 인증, 벌금 등은 장기 피로를 만듭니다.",
      prescription: "주 1~2회만 공유하고 한 일 공유 파트너를 찾으세요.",
      scoreSignal: `압력저항 ${Math.round(scores.pressure)} ↓`
    })
  } else {
    patterns.push({
      title: "책임감으로 기준을 지켜내는 패턴",
      observe: "정해진 규칙과 압박을 동력으로 활용합니다.",
      strength: "약속된 것은 어떻게든 완수하려 합니다.",
      risk: "완벽하지 않으면 아예 하지 않으려는 성향이 나타납니다.",
      prescription: "완벽한 100% 대신 20%의 부분 성공도 인정하세요.",
      scoreSignal: `압력저항 ${Math.round(scores.pressure)} ↑`
    })
  }

  return patterns
}

// 3. Meaningful Gap (Biggest Gap Analysis)
export function getMeaningfulGap(scores: ReportData["scores"]) {
  const pairs = [
    { p1: "initiation", p2: "persistence", label1: "시작력", label2: "지속력", desc: "시작의 에너지가 반복의 에너지로 온전히 이어지지 않을 수 있습니다." },
    { p1: "initiation", p2: "achievement", label1: "시작력", label2: "목표달성", desc: "초기 의욕은 좋으나 마무리를 위한 기준 설정이 필요합니다." },
    { p1: "stimulation", p2: "persistence", label1: "자극추구", label2: "지속력", desc: "새로운 방식이 없으면 기존 방식을 지루하게 느낄 가능성이 큽니다." },
    { p1: "pressure", p2: "achievement", label1: "압력저항", label2: "목표달성", desc: "목표는 원하지만 강제적인 통제나 압박은 역효과를 낼 수 있습니다." },
    { p1: "exploration", p2: "persistence", label1: "탐구력", label2: "지속력", desc: "최적의 방법을 찾으려다 실행 자체를 반복하는 힘이 떨어질 수 있습니다." },
  ] as const

  let maxGap = -1
  let selectedPair: typeof pairs[number] = pairs[0]
  let s1 = 0, s2 = 0

  pairs.forEach(pair => {
    const val1 = scores[pair.p1]
    const val2 = scores[pair.p2]
    const diff = Math.abs(val1 - val2)
    if (diff > maxGap) {
      maxGap = diff
      selectedPair = pair
      s1 = val1
      s2 = val2
    }
  })

  // 만약 모든 차이가 10 미만이면 기본 쌍 반환
  if (maxGap < 10) {
    return { valid: false, ...selectedPair, diff: maxGap, score1: s1, score2: s2 }
  }

  return { valid: true, ...selectedPair, diff: Math.round(maxGap), score1: Math.round(s1), score2: Math.round(s2) }
}

// 4. 8 Factor Detail 해석 (Contextual Strategies 적용)
export function getFactorDetail(dim: keyof ReportData["scores"], score: number, scores: ReportData["scores"]) {
  const level = score >= 60 ? "높음" : score >= 40 ? "보통" : "낮음"
  
  let strategy = ""
  
  if (dim === "persistence") {
    if (score < 50 && scores.stimulation > 60) strategy = "억지로 참기보다 정기적인 변화 슬롯 활용"
    else if (score < 50 && scores.exploration > 60) strategy = "새로운 방법 탐색을 멈추고 최소 행동 고정"
    else strategy = "7일마다 작은 변화 주기"
  } else if (dim === "initiation") {
    if (score > 60 && scores.persistence < 50) strategy = "동시 신규 습관 최대 2개로 제한"
    else strategy = "첫 행동의 저항 최소화"
  } else if (dim === "achievement") {
    strategy = score < 50 ? "과정 자체에 점수를 부여" : "주간 마일스톤 설정"
  } else if (dim === "pressure") {
    strategy = score < 50 ? "강제적인 벌금/내기 피하기" : "적절한 외부 통제 활용"
  } else if (dim === "relationship") {
    strategy = score < 50 ? "혼자 확인할 수 있는 기록 선호" : "주 1~2회 가벼운 공유"
  } else if (dim === "recovery") {
    strategy = score < 50 ? "중단 사유보다 24시간 복귀 규칙 선호" : "놓친 후 24시간 내 1회 복귀"
  } else if (dim === "stimulation") {
    strategy = score > 60 ? "목표를 유지한 채 방식만 변경" : "변화보다 안정성 유지"
  } else if (dim === "exploration") {
    strategy = score > 60 ? "탐색 시간 상한선 설정" : "필요한 정보만 습득 후 실행"
  }

  const details = {
    initiation: { name: "시작력", interp: "진입 장벽 체감도", action: "흥미가 생기면 첫 행동까지 비교적 빠릅니다.", caution: "시작의 수가 많아질 수 있음" },
    persistence: { name: "지속력", interp: "반복 내구도", action: "반복이 익숙해질 때 동기가 변할 수 있습니다.", caution: "2~3주차 이탈 주의" },
    recovery: { name: "회복력", interp: "재시작 능력", action: "중단 후 재시작은 가능하지만 계기가 필요합니다.", caution: "하루 놓친 뒤 지연" },
    achievement: { name: "목표달성", interp: "완료 기준 명확화", action: "긴 목표보다 짧은 완료 단위에 반응합니다.", caution: "끝이 멀면 회피" },
    relationship: { name: "관계지향", interp: "가벼운 공유 도움", action: "가벼운 연결과 피드백이 동기를 보완합니다.", caution: "과한 경쟁 피로" },
    pressure: { name: "압력저항", interp: "과한 압박 주의", action: "강한 압박이나 실패 비용이 에너지를 낮춥니다.", caution: "자책·회피" },
    exploration: { name: "탐구력", interp: "필요 시 탐색", action: "필요한 만큼 정보를 찾고 바로 적용합니다.", caution: "도구 탐색에 시간 사용" },
    stimulation: { name: "자극추구", interp: "변화가 동기", action: "새로운 경험과 변화가 에너지를 높입니다.", caution: "익숙함을 가치 없음으로 오해" }
  }
  
  return { ...details[dim], level, score, strategy }
}

// 5. 환경 가이드 레벨
export function getEnvironmentLevels(scores: ReportData["scores"]) {
  return {
    autonomy: (scores.initiation + (100 - scores.pressure)) / 2,
    change: scores.stimulation,
    pressureTolerance: scores.pressure,
    social: scores.relationship,
    record: scores.achievement
  }
}

// 6. 우선순위 산정 (Core Priorities)
export type PriorityKey = "지속력 관리" | "시작 장벽 제거" | "자극 관리" | "압력 방식 조절" | "회복 탄력성" | "과정 보상"
export function getCorePriorities(scores: ReportData["scores"]): { title: PriorityKey, reason: string, tip: string }[] {
  const cands = []
  
  if (scores.persistence < 50) cands.push({ score: 100 - scores.persistence, title: "지속력 관리", reason: "반복 유지력이 상대적으로 낮음", tip: "최소 행동 고정" })
  if (scores.stimulation > 60) cands.push({ score: scores.stimulation, title: "자극 관리", reason: "새로운 자극이 지속의 핵심 동력", tip: "주기적인 방식 변화" })
  if (scores.initiation < 45) cands.push({ score: 100 - scores.initiation, title: "시작 장벽 제거", reason: "첫 진입의 저항감이 높음", tip: "5분 단위 시작" })
  if (scores.pressure < 40) cands.push({ score: 100 - scores.pressure, title: "압력 방식 조절", reason: "강제성이나 압박에 대한 저항이 강함", tip: "자율적인 목표 설정" })
  if (scores.recovery < 50) cands.push({ score: 100 - scores.recovery, title: "회복 탄력성", reason: "이탈 후 재시작 지연 가능성", tip: "24시간 내 1회 복귀 규칙" })
  if (scores.achievement < 50) cands.push({ score: 100 - scores.achievement, title: "과정 보상", reason: "명확한 결과가 없으면 흥미 하락", tip: "과정 자체를 기록하고 보상" })

  cands.sort((a, b) => b.score - a.score)
  
  // 만약 부족하면 기본값 추가
  if (cands.length < 3) {
    if (!cands.find(c => c.title === "지속력 관리")) cands.push({ score: 50, title: "지속력 관리", reason: "기본적인 반복 유지력 강화", tip: "주 3회 기준 설정" })
    if (!cands.find(c => c.title === "회복 탄력성")) cands.push({ score: 49, title: "회복 탄력성", reason: "안정적인 복귀 패턴 확립", tip: "실패 시 즉시 재개" })
    if (!cands.find(c => c.title === "자극 관리")) cands.push({ score: 48, title: "자극 관리", reason: "적절한 동기 부여 요소 배치", tip: "환경 요소 변경" })
  }

  return cands.slice(0, 3) as any
}

// 7. 30일 플랜 (우선순위 기반 동적 생성)
export function get30DayPlan(primary: TypeCode, scores: ReportData["scores"]) {
  const priorities = getCorePriorities(scores)
  const p1 = priorities[0].title
  
  // 기본 골격
  const plan = [
    { week: "WEEK 01", name: "START", goal: "시작 장벽 낮추기", actions: ["최소 행동을 실제로 3회 이상 실행", "매번 실행 후 기분을 1~5점으로 기록"], question: "무엇을 줄였을 때 가장 쉽게 시작했나?" },
    { week: "WEEK 02", name: "ADAPT", goal: "나에게 맞는 방식 찾기", actions: ["장소·시간·도구 중 1개를 바꿔 실험", "가장 잘 맞는 조합 2개 후보 만들기"], question: "어떤 조건에서 실행 의지가 가장 자연스럽게 생겼나?" },
    { week: "WEEK 03", name: "MAINTAIN", goal: "지루함 관리하기", actions: ["목표는 유지하고 방식에만 변화 넣기", "한 번 놓쳐도 24시간 안에 복귀"], question: "지루함이 왔을 때 어떤 변화가 실제로 도움이 됐나?" },
    { week: "WEEK 04", name: "STABILIZE", goal: "반복 가능한 구조로 고정", actions: ["가장 잘 맞은 루틴 1개를 기본형으로 선정", "다음 달에 바꿀 변화 슬롯 2개 미리 예약"], question: "이 습관을 3개월 유지하려면 무엇을 남기고 버려야 하나?" }
  ]

  // Priority 1 기반으로 행동 1개씩 주입
  if (p1 === "지속력 관리") {
    plan[2].actions.push("최소 행동 기준을 절반으로 낮춰 유지")
  } else if (p1 === "시작 장벽 제거") {
    plan[0].actions.push("무조건 2분 안에 끝낼 수 있는 행동 세팅")
  } else if (p1 === "자극 관리") {
    plan[1].actions.push("완전히 새로운 장소에서 1회 시도하기")
  } else if (p1 === "압력 방식 조절") {
    plan[0].actions.push("내가 스스로 통제할 수 있는 규칙 1개 추가")
  } else if (p1 === "회복 탄력성") {
    plan[2].actions.push("실패했을 때 자책 대신 원인 1줄 기록하기")
  } else if (p1 === "과정 보상") {
    plan[3].actions.push("결과와 무관하게 3주 유지에 대한 보상 제공")
  } else {
    plan[1].actions.push("현재 방식에 대한 만족도 중간 점검")
  }

  // 글자 수 제한 고려 (45자)
  return plan
}

// 8. Summary 데이터 동기화
export function getAnalysisSummary(scores: ReportData["scores"]) {
  const priorities = getCorePriorities(scores)
  
  let keyMessage = ""
  if (priorities[0].title === "지속력 관리") keyMessage = "새로운 시작보다 무너진 후의 복귀 규칙이 당신의 가장 큰 무기입니다."
  else if (priorities[0].title === "자극 관리") keyMessage = "지루함을 견디지 마세요. 목표는 그대로 두고 방식만 계속 바꾸면 됩니다."
  else if (priorities[0].title === "압력 방식 조절") keyMessage = "강제적인 100%보다 내가 통제할 수 있는 자율적인 20%가 훨씬 강력합니다."
  else if (priorities[0].title === "회복 탄력성") keyMessage = "가장 중요한 것은 완벽하게 유지하는 것이 아니라 빨리 복귀하는 능력입니다."
  else keyMessage = "작은 성공의 반복이 가장 확실한 지속의 동력이 됩니다."

  const top3 = priorities.map((p, idx) => {
    let action = ""
    if (p.title === "지속력 관리") action = "반복 구간 진입 시 최소 행동으로 즉시 전환"
    else if (p.title === "시작 장벽 제거") action = "무조건 5분 안에 끝나는 단위로 목표 쪼개기"
    else if (p.title === "자극 관리") action = "장소나 도구 등 환경 요소를 정기적으로 변경"
    else if (p.title === "압력 방식 조절") action = "벌금이나 과도한 인증 대신 가벼운 셀프 체크"
    else if (p.title === "회복 탄력성") action = "하루를 놓쳤을 때 '24시간 내 1회 복귀' 룰 적용"
    else action = "결과가 아닌 행동 과정 자체에 점수 매기기"
    return { title: p.title, action }
  })

  return { keyMessage, top3 }
}
