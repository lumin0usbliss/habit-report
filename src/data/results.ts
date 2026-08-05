import type { TypeCode } from "./questions"

export interface SevenDayPlanItem {
  day: number
  task: string
  description: string
}

export interface HabitType {
  id: string
  code: TypeCode
  name: string
  oneLineSummary: string
  keywords: string[]
  strengths: string[]
  stopPatterns: string[]
  triggerConditions: string[]
  avoidStrategies: string[]
  recommendedStrategies: string[]
  sevenDayPlanTemplate: SevenDayPlanItem[]
}

// Placeholder for the actual 9 types
export const results: Record<TypeCode, HabitType> = {
  T1: {
    id: "type-1",
    code: "T1",
    name: "기준을 세우는 완성형",
    oneLineSummary: "제대로 해야 의미가 있다.",
    keywords: ["책임감", "완성도", "기준"],
    strengths: [
      "계획을 구체적으로 세울 수 있다.",
      "시작하면 일정한 기준을 유지한다.",
      "잘못된 부분을 빠르게 발견한다."
    ],
    stopPatterns: [
      "하루를 놓치면 전체 계획을 포기한다.",
      "작은 목표보다 완성도 높은 결과를 원한다."
    ],
    triggerConditions: [
      "명확한 가이드라인이 주어질 때",
      "자신의 기준에 부합하는 결과를 상상할 때"
    ],
    avoidStrategies: [
      "한 번의 실패를 전체 실패로 해석하기 쉽다.",
      "준비와 점검이 실제 행동을 대신할 수 있다."
    ],
    recommendedStrategies: [
      "완료가 아니라 시작을 인증한다.",
      "목표량의 20%만 해도 인정한다."
    ],
    sevenDayPlanTemplate: [
      { day: 1, task: "가장 작은 단위로 쪼개기", description: "목표를 1/5로 줄여보세요." }
    ]
  },
  T2: {
    id: "type-2",
    code: "T2",
    name: "함께 움직이는 관계형",
    oneLineSummary: "누군가에게 도움이 되고 함께할 때 더 힘이 난다.",
    keywords: ["관계", "인정", "응원"],
    strengths: [
      "사람을 격려하고 챙기는 능력이 좋다.",
      "함께하는 환경에서 꾸준함이 높다."
    ],
    stopPatterns: [
      "혼자 하면 해야 할 일을 미룬다.",
      "반응이 없으면 의미 없다고 느낀다."
    ],
    triggerConditions: [
      "누군가 기다리거나 인정해줄 때"
    ],
    avoidStrategies: [
      "함께하는 사람이 멈추면 같이 멈출 수 있다."
    ],
    recommendedStrategies: [
      "2~4명의 소규모 방을 사용한다.",
      "응원받는 역할뿐 아니라 응원하는 역할도 만든다."
    ],
    sevenDayPlanTemplate: [
      { day: 1, task: "친구에게 선언하기", description: "가장 친한 친구에게 목표를 말하세요." }
    ]
  },
  T3: {
    id: "type-3",
    code: "T3",
    name: "결과로 증명하는 성취형",
    oneLineSummary: "눈에 보이는 결과가 있어야 계속하고 싶다.",
    keywords: ["성과", "기록", "경쟁"],
    strengths: [
      "단기간에 눈에 보이는 성과를 만들 수 있다.",
      "경쟁이나 기록을 동력으로 활용한다."
    ],
    stopPatterns: [
      "눈에 띄는 변화가 없으면 의욕이 줄어든다."
    ],
    triggerConditions: [
      "명확한 보상이나 경쟁 구도가 있을 때"
    ],
    avoidStrategies: [
      "결과를 빨리 얻기 위해 무리할 수 있다."
    ],
    recommendedStrategies: [
      "결과가 아닌 실행 횟수를 성과로 계산한다."
    ],
    sevenDayPlanTemplate: [
      { day: 1, task: "실행 자체를 기록하기", description: "오늘 해낸 행동 하나를 적으세요." }
    ]
  },
  T4: {
    id: "type-4",
    code: "T4",
    name: "나다운 방식을 찾는 감각형",
    oneLineSummary: "나에게 의미 있고 내 방식이어야 오래 할 수 있다.",
    keywords: ["의미", "감정", "표현"],
    strengths: [
      "창의적인 인증 방식이나 습관 방법을 찾는다."
    ],
    stopPatterns: [
      "목표가 나에게 의미 없다고 느껴지면 계속하기 어렵다."
    ],
    triggerConditions: [
      "자신만의 특별한 의미를 발견했을 때"
    ],
    avoidStrategies: [
      "기분이 좋지 않으면 행동 전체를 멈출 수 있다."
    ],
    recommendedStrategies: [
      "인증 문구와 촬영 방식을 자유롭게 바꾼다."
    ],
    sevenDayPlanTemplate: [
      { day: 1, task: "나만의 인증 방식 정하기", description: "오늘의 감정을 담은 사진을 찍으세요." }
    ]
  },
  T5: {
    id: "type-5",
    code: "T5",
    name: "이해하고 준비하는 탐구형",
    oneLineSummary: "충분히 이해하고 준비해야 움직일 수 있다.",
    keywords: ["정보", "이해", "분석"],
    strengths: [
      "효율적인 방법을 발견할 수 있다."
    ],
    stopPatterns: [
      "정보 수집이나 준비가 길어지면 실행을 놓친다."
    ],
    triggerConditions: [
      "충분한 정보와 납득 가능한 이유가 있을 때"
    ],
    avoidStrategies: [
      "정보 수집이 행동을 대신할 수 있다."
    ],
    recommendedStrategies: [
      "실행을 위한 준비 시간에 제한을 둔다."
    ],
    sevenDayPlanTemplate: [
      { day: 1, task: "3분 만에 시작하기", description: "타이머를 맞추고 일단 행동하세요." }
    ]
  },
  T6: {
    id: "type-6",
    code: "T6",
    name: "안전한 계획을 원하는 점검형",
    oneLineSummary: "계획이 안정적이고 믿을 만해야 꾸준히 할 수 있다.",
    keywords: ["안정", "점검", "신뢰"],
    strengths: [
      "발생할 문제를 미리 예상한다."
    ],
    stopPatterns: [
      "일정이 바뀌면 습관도 흔들린다."
    ],
    triggerConditions: [
      "예측 가능하고 통제 가능한 상황일 때"
    ],
    avoidStrategies: [
      "실패를 피하려다 시도하지 못할 수 있다."
    ],
    recommendedStrategies: [
      "기본 계획과 비상 계획을 함께 만든다."
    ],
    sevenDayPlanTemplate: [
      { day: 1, task: "플랜 B 준비하기", description: "바쁜 날을 대비한 최소 행동을 정하세요." }
    ]
  },
  T7: {
    id: "type-7",
    code: "T7",
    name: "새로움을 즐기는 자극형",
    oneLineSummary: "재미와 변화가 있어야 행동이 살아난다.",
    keywords: ["재미", "새로움", "호기심"],
    strengths: [
      "습관을 재미있게 만드는 아이디어가 많다."
    ],
    stopPatterns: [
      "같은 방식이 반복되면 지루하다."
    ],
    triggerConditions: [
      "새롭고 흥미로운 방식이 제안될 때"
    ],
    avoidStrategies: [
      "새로움이 사라지면 습관을 중단할 수 있다."
    ],
    recommendedStrategies: [
      "한 주에 한 번만 인증 방식을 바꾼다."
    ],
    sevenDayPlanTemplate: [
      { day: 1, task: "평소와 다르게 해보기", description: "항상 하던 장소가 아닌 다른 곳에서 시도해보세요." }
    ]
  },
  T8: {
    id: "type-8",
    code: "T8",
    name: "스스로 밀어붙이는 추진형",
    oneLineSummary: "내가 결정하면 끝까지 해내고 싶다.",
    keywords: ["목표", "주도성", "도전"],
    strengths: [
      "목표를 실행으로 옮기는 힘이 강하다."
    ],
    stopPatterns: [
      "다른 사람이 통제하거나 간섭하면 의욕이 줄어든다."
    ],
    triggerConditions: [
      "도전적이고 자율성이 보장될 때"
    ],
    avoidStrategies: [
      "무리한 목표로 체력이 소진될 수 있다."
    ],
    recommendedStrategies: [
      "강한 목표와 최소 목표를 동시에 만든다."
    ],
    sevenDayPlanTemplate: [
      { day: 1, task: "내가 규칙 정하기", description: "나만의 규칙을 하나 추가해보세요." }
    ]
  },
  T9: {
    id: "type-9",
    code: "T9",
    name: "편안한 흐름을 따르는 조화형",
    oneLineSummary: "부담 없이 자연스럽게 이어질 때 가장 오래 할 수 있다.",
    keywords: ["자연스러움", "흐름", "안정"],
    strengths: [
      "무리하지 않고 안정적으로 이어갈 수 있다."
    ],
    stopPatterns: [
      "목표가 뒤로 밀리며 실행 시기를 놓칠 수 있다."
    ],
    triggerConditions: [
      "부담이 적고 편안한 분위기일 때"
    ],
    avoidStrategies: [
      "자신이 원하는 변화보다 주변 일정에 맞출 수 있다."
    ],
    recommendedStrategies: [
      "하루 중 가장 쉬운 시간에 습관을 고정한다."
    ],
    sevenDayPlanTemplate: [
      { day: 1, task: "기존 습관에 붙이기", description: "원래 하던 일 직후에 짧게 이어붙이세요." }
    ]
  }
}
