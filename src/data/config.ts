export const testConfig = {
  title: "HAZZI 습관 성향 테스트",
  subtitle: "7개 습관 영역을 분석해 내가 왜 시작하고도 멈추는지 알려주는 테스트",
  description: "의지가 부족한 게 아니라 나에게 맞지 않는 방식으로 하고 있었을지도 몰라요.",
  questionCount: 70, // Placeholder, actual count will depend on provided data
  shareHashtag: "#HAZZI #습관테스트",
  ogImage: "/og-image.png",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
  adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "",
} as const
