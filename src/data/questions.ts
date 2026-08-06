import type { DimensionId } from "./scoring"

export type TypeCode = "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8" | "T9"
export type LikertScore = 1 | 2 | 3 | 4 | 5

export interface HabitCategory {
  id: string
  name: string
  englishLabel: string
  shortDescription: string
}

export type ScoredQuestion = {
  id: string
  part: number
  order: number
  categoryId: string
  text: string
  responseType: "LIKERT_5"
  scoringRole: "TYPE_SCORE"
  weights: Partial<Record<DimensionId, number>>
}

export type ReferenceQuestion = {
  id: string
  part: number
  order: number
  categoryId: string
  text: string
  responseType: "LIKERT_5" | "MULTI_SELECT"
  scoringRole: "REFERENCE_ONLY"
  signalTag: string
  isSensitive?: boolean
}

export type Question = ScoredQuestion | ReferenceQuestion

export interface Answer {
  questionId: string
  value: LikertScore
}

export const likertLabels: Record<LikertScore, string> = {
  1: "전혀 아니다",
  2: "별로 그렇지 않다",
  3: "보통이다",
  4: "자주 그렇다",
  5: "매우 그렇다",
}

export const categories: HabitCategory[] = [
  { id: "cat1", name: "습관 실행 스타일", englishLabel: "PART 1", shortDescription: "계획과 실행 방식" },
  { id: "cat2", name: "생활 리듬", englishLabel: "PART 2", shortDescription: "일상의 규칙성과 변동성" },
  { id: "cat3", name: "집중을 방해하는 것", englishLabel: "PART 3", shortDescription: "주의를 분산시키는 요소" },
  { id: "cat4", name: "생활환경", englishLabel: "PART 4", shortDescription: "주변 환경과 여건" },
  { id: "cat5", name: "최근 고민과 변화 욕구", englishLabel: "PART 5", shortDescription: "현재 가장 개선하고 싶은 점" },
  { id: "cat6", name: "생활 습관 및 컨디션 확인", englishLabel: "PART 6", shortDescription: "신체 및 정신적 건강 상태" },
  { id: "cat7", name: "사람 관계와 실행 동력", englishLabel: "PART 7", shortDescription: "타인과의 상호작용" },
]

export const questions: Question[] = [
  // PART 1
  { id: "q1_1", part: 1, order: 1, categoryId: "cat1", text: "시작은 잘하지만 오래 유지하지 못한다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: 0.8, PERSIST: -1.0, RECOVER: -0.3, STIMULUS: 0.2 } },
  { id: "q1_2", part: 1, order: 2, categoryId: "cat1", text: "계획은 잘 세우지만 실행은 늦어지는 편이다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: -1.0, RECOVER: -0.2, PERFECT: 0.8, EXPLORE: 0.5 } },
  { id: "q1_3", part: 1, order: 3, categoryId: "cat1", text: "하루를 놓치면 전체 계획을 포기하게 된다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: -0.2, PERSIST: -0.5, RECOVER: -1.0, PERFECT: 0.6 } },
  { id: "q1_4", part: 1, order: 4, categoryId: "cat1", text: "조금이라도 실행하면 계속 이어가는 편이다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: 0.3, PERSIST: 1.0, RECOVER: 0.7, PERFECT: -0.4 } },
  { id: "q1_5", part: 1, order: 5, categoryId: "cat1", text: "혼자 하면 해야 할 일을 자주 미룬다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: -0.5, PERSIST: -0.2, SOCIAL: 1.0 } },
  { id: "q1_6", part: 1, order: 6, categoryId: "cat1", text: "새로운 방법이 생기면 바로 해보고 싶어진다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: 0.7, RECOVER: 0.2, PERFECT: -0.3, EXPLORE: 0.4, STIMULUS: 0.9 } },
  { id: "q1_7", part: 1, order: 7, categoryId: "cat1", text: "같은 방식이 반복되면 금방 지루해진다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { PERSIST: -0.6, PERFECT: -0.2, EXPLORE: 0.2, STIMULUS: 1.0 } },
  { id: "q1_8", part: 1, order: 8, categoryId: "cat1", text: "목표를 크게 잡는 편이다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: 0.2, ACHIEVE: 1.0, PERFECT: 0.4 } },
  { id: "q1_9", part: 1, order: 9, categoryId: "cat1", text: "작은 목표부터 시작하는 편이다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: 0.3, PERSIST: 0.6, RECOVER: 0.5, ACHIEVE: -0.3, PERFECT: -0.4, STIMULUS: -0.2 } },
  { id: "q1_10", part: 1, order: 10, categoryId: "cat1", text: "목표는 있고 계획도 세우지만 실제 실행이 잘되지 않는다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: -1.0, PERSIST: -0.2, RECOVER: -0.2, ACHIEVE: 0.2, PERFECT: 0.4, EXPLORE: 0.3 } },

  // PART 2
  { id: "q2_1", part: 2, order: 1, categoryId: "cat2", text: "잠드는 시간이 매일 다르다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "IRREGULAR_SLEEP_TIME" },
  { id: "q2_2", part: 2, order: 2, categoryId: "cat2", text: "식사 시간이 일정하지 않다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "IRREGULAR_MEALS" },
  { id: "q2_3", part: 2, order: 3, categoryId: "cat2", text: "하루 일정이 자주 바뀐다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "VARIABLE_SCHEDULE" },
  { id: "q2_4", part: 2, order: 4, categoryId: "cat2", text: "집보다 밖에서 보내는 시간이 많다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "OUTSIDE_MOST_DAY" },
  { id: "q2_5", part: 2, order: 5, categoryId: "cat2", text: "평소 이동 시간이 긴 편이다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "LONG_COMMUTE" },
  { id: "q2_6", part: 2, order: 6, categoryId: "cat2", text: "약속이 많은 편이다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "MANY_APPOINTMENTS" },
  { id: "q2_7", part: 2, order: 7, categoryId: "cat2", text: "혼자 보내는 시간이 많은 편이다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "MUCH_ALONE_TIME" },
  { id: "q2_8", part: 2, order: 8, categoryId: "cat2", text: "하루가 너무 바쁘다고 느낀다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "FEELS_TOO_BUSY" },
  { id: "q2_9", part: 2, order: 9, categoryId: "cat2", text: "시간이 남아 있어도 해야 할 일을 미룬다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: -1.0, PERSIST: -0.4, RECOVER: -0.2, STIMULUS: 0.2 } },

  // PART 3
  { id: "q3_1", part: 3, order: 1, categoryId: "cat3", text: "휴대폰을 보다가 시간이 많이 흘러간다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: -0.3, PERSIST: -0.5, STIMULUS: 0.8 } },
  { id: "q3_2", part: 3, order: 2, categoryId: "cat3", text: "SNS를 자주 확인한다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { PERSIST: -0.3, SOCIAL: 0.2, STIMULUS: 0.7 } },
  { id: "q3_3", part: 3, order: 3, categoryId: "cat3", text: "유튜브나 영상을 보다 늦게 잠든 적이 있다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: -0.2, PERSIST: -0.4, RECOVER: -0.2, STIMULUS: 0.8 } },
  { id: "q3_4", part: 3, order: 4, categoryId: "cat3", text: "게임을 예상보다 오래 하는 편이다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { PERSIST: -0.5, STIMULUS: 0.8 } },
  { id: "q3_5", part: 3, order: 5, categoryId: "cat3", text: "충동적으로 물건을 구매하는 경우가 있다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { RECOVER: -0.2, STIMULUS: 0.7 } },
  { id: "q3_6", part: 3, order: 6, categoryId: "cat3", text: "해야 할 일보다 당장 재미있는 일을 먼저 한다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: -0.2, PERSIST: -0.4, ACHIEVE: -0.3, STIMULUS: 1.0 } },
  { id: "q3_7", part: 3, order: 7, categoryId: "cat3", text: "알림이 오면 바로 확인하는 편이다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { PERSIST: -0.2, SOCIAL: 0.1, STIMULUS: 0.7 } },

  // PART 4
  { id: "q4_1", part: 4, order: 1, categoryId: "cat4", text: "평소 이동 시간이 길다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "LONG_COMMUTE" },
  { id: "q4_2", part: 4, order: 2, categoryId: "cat4", text: "학교·직장 등 정해진 일정이 많은 편이다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "MANY_FIXED_SCHEDULES" },
  { id: "q4_3", part: 4, order: 3, categoryId: "cat4", text: "아르바이트나 부업을 하고 있다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "HAS_PART_TIME_WORK" },
  { id: "q4_4", part: 4, order: 4, categoryId: "cat4", text: "운동을 정기적으로 하고 있다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "REGULAR_EXERCISE" },
  { id: "q4_5", part: 4, order: 5, categoryId: "cat4", text: "동아리·취미 활동을 하고 있다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "CLUB_OR_HOBBY" },
  { id: "q4_6", part: 4, order: 6, categoryId: "cat4", text: "주말에도 일정이 자주 생긴다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "BUSY_WEEKENDS" },

  // PART 5
  { id: "q5_1", part: 5, order: 1, categoryId: "cat5", text: "진로나 앞으로의 방향이 고민이다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "CAREER_DIRECTION" },
  { id: "q5_2", part: 5, order: 2, categoryId: "cat5", text: "취업 준비가 걱정된다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "JOB_PREPARATION" },
  { id: "q5_3", part: 5, order: 3, categoryId: "cat5", text: "인간관계에서 어려움을 느끼고 있다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "RELATIONSHIP_CONCERN" },
  { id: "q5_4", part: 5, order: 4, categoryId: "cat5", text: "경제적인 문제나 소비 관리가 고민이다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "FINANCE_CONCERN" },
  { id: "q5_5", part: 5, order: 5, categoryId: "cat5", text: "건강관리를 시작해야 한다고 느낀다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "HEALTH_CONCERN" },
  { id: "q5_6", part: 5, order: 6, categoryId: "cat5", text: "시간을 효율적으로 사용하는 것이 어렵다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "TIME_MANAGEMENT" },
  { id: "q5_7", part: 5, order: 7, categoryId: "cat5", text: "공부 습관을 만들고 싶다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "STUDY_HABIT" },
  { id: "q5_8", part: 5, order: 8, categoryId: "cat5", text: "운동 습관을 만들고 싶다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "EXERCISE_HABIT" },
  { id: "q5_9", part: 5, order: 9, categoryId: "cat5", text: "생활이나 자기관리를 더 잘하고 싶다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "SELF_MANAGEMENT" },
  { id: "q5_10", part: 5, order: 10, categoryId: "cat5", text: "지금보다 꾸준한 사람이 되고 싶다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "WANTS_CONSISTENCY" },
  { id: "q5_11", part: 5, order: 11, categoryId: "cat5", text: "해야 할 일은 알지만 어디서부터 시작해야 할지 모르겠다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "DOES_NOT_KNOW_FIRST_STEP" },

  // PART 6
  { id: "q6_1", part: 6, order: 1, categoryId: "cat6", text: "밤을 새우거나 매우 늦게 잠드는 날이 자주 있다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "FREQUENT_LATE_NIGHTS" },
  { id: "q6_2", part: 6, order: 2, categoryId: "cat6", text: "수면 패턴이 불규칙해 수면유도제 등을 복용할 때가 있다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "SLEEP_MEDICATION_REFERENCE", isSensitive: true },
  { id: "q6_3", part: 6, order: 3, categoryId: "cat6", text: "컨디션을 유지하기 위해 정기적으로 챙기는 것이 있다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "REGULAR_HEALTH_PRODUCT", isSensitive: true },
  { id: "q6_4", part: 6, order: 4, categoryId: "cat6", text: "최근 건강상의 이유로 생활 습관을 조절하고 있다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "HEALTH_BASED_ADJUSTMENT", isSensitive: true },
  { id: "q6_5", part: 6, order: 5, categoryId: "cat6", text: "스트레스를 받으면 소비가 늘어나는 편이다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "STRESS_SPENDING" },
  { id: "q6_6", part: 6, order: 6, categoryId: "cat6", text: "스트레스를 받으면 투자 관련 앱을 이용하며 기분을 해소하는 편이다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "STRESS_INVESTMENT_APP", isSensitive: true },
  { id: "q6_7", part: 6, order: 7, categoryId: "cat6", text: "스트레스를 받으면 운동하거나 몸을 쓰면서 해소한다.", responseType: "LIKERT_5", scoringRole: "REFERENCE_ONLY", signalTag: "BODY_BASED_RECOVERY" },
  { id: "q6_8", part: 6, order: 8, categoryId: "cat6", text: "스트레스를 받으면 평소 계획과 다른 행동을 충동적으로 하게 된다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: -0.2, PERSIST: -0.3, RECOVER: -0.6, STIMULUS: 0.8 } },
  { id: "q6_9", part: 6, order: 9, categoryId: "cat6", text: "컨디션에 따라 집중력과 실행력의 차이가 큰 편이다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: -0.3, PERSIST: -0.5, RECOVER: -0.4, STIMULUS: 0.4 } },

  // PART 7
  { id: "q7_1", part: 7, order: 1, categoryId: "cat7", text: "누군가 기다리고 있으면 해야 할 일을 더 잘하게 된다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: 0.4, PERSIST: 0.2, SOCIAL: 1.0 } },
  { id: "q7_2", part: 7, order: 2, categoryId: "cat7", text: "인정받으면 더 잘하게 된다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { ACHIEVE: 0.6, SOCIAL: 0.8 } },
  { id: "q7_3", part: 7, order: 3, categoryId: "cat7", text: "혼자 하는 것이 더 편하다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { PERSIST: 0.1, SOCIAL: -1.0, EXPLORE: 0.3 } },
  { id: "q7_4", part: 7, order: 4, categoryId: "cat7", text: "친구와 경쟁하면 더 열심히 하게 된다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: 0.3, ACHIEVE: 0.8, SOCIAL: 0.6, STIMULUS: 0.2 } },
  { id: "q7_5", part: 7, order: 5, categoryId: "cat7", text: "누군가 실행 여부를 확인해주면 책임감이 생긴다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { PERSIST: 0.5, SOCIAL: 1.0, PERFECT: 0.2 } },
  { id: "q7_6", part: 7, order: 6, categoryId: "cat7", text: "다른 사람과 한 약속은 웬만하면 지키려고 한다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { PERSIST: 0.7, RECOVER: 0.2, ACHIEVE: 0.2, SOCIAL: 0.5, PERFECT: 0.2 } },
  { id: "q7_7", part: 7, order: 7, categoryId: "cat7", text: "친구가 먼저 인증하면 나도 해야겠다는 생각이 든다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { START: 0.3, SOCIAL: 0.9, STIMULUS: 0.2 } },
  { id: "q7_8", part: 7, order: 8, categoryId: "cat7", text: "다른 사람에게 내 습관 과정을 공개하는 것이 부담스럽다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { SOCIAL: -0.8, PERFECT: 0.3, EXPLORE: 0.2 } },
  { id: "q7_9", part: 7, order: 9, categoryId: "cat7", text: "응원이나 반응이 없으면 의욕이 줄어드는 편이다.", responseType: "LIKERT_5", scoringRole: "TYPE_SCORE", weights: { PERSIST: -0.4, RECOVER: -0.2, ACHIEVE: 0.2, SOCIAL: 0.8 } },
]
