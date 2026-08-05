# Harness Test Template

Reusable psychology test / personality assessment / compatibility quiz template.
The underlying type system (e.g. Enneagram, MBTI-like codes) is NEVER shown to the user.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 (CSS-first config via `@theme`)
- Framer Motion for animations
- Fonts via `next/font/google` — **no fixed font**. Ships with Noto Sans KR
  as a placeholder; designer swaps based on Discovery answers.
- Optional Supabase for result analytics

## Content is fixed, design is replaceable

The **logic** of the test is user-driven — you fill in questions, results,
and scoring rules through the data files. That part is stable.

The **visual design** is not baked in. The bundled components use neutral
placeholder styling (grays, simple borders, no gradient-heavy theme) so the
designer can replace the entire look to match the project's mood. Every
interactive component has a `DESIGN NOTE:` comment at the top explaining
which parts must stay (data contract, flow) and which parts the designer
should rewrite (colors, radius, motion, typography, layout).

## Planning flow (before writing code)

1. Read the user's unstructured description.
2. Infer test type, audience, tone, number of result types, share story.
3. Ask **3–5 smart reverse questions** with option-style choices about:
   - Visual mood (playful quiz / serious analytical / editorial magazine)
   - Number of result types and whether they should feel distinct per-type
   - Font pairing (see `.harness/agents/planner.md`)
4. Only after direction is locked, build out `src/data/` (content) and then
   rewrite the component styling (design).

## Architecture

```
src/data/       - Content layer (questions, results, config)
src/lib/        - Logic layer (score calc, supabase, utils)
src/context/    - State layer (TestContext with sessionStorage persistence)
src/components/ - UI layer (test/, ui/, layout/)
src/app/        - Pages (intro, test, result, ranking)
```

## How to Customize

### Change test questions
Edit `src/data/questions.ts`. Each question has:
- `question`: The text shown to users
- `options[]`: Each option has `text` (shown) and `type` (HIDDEN internal code)

TypeCode values (A, B, C, D) are internal mappings. NEVER display them in the UI.

### Change result descriptions
Edit `src/data/results.ts`. Each result type has:
- `title`, `emoji`, `description` - shown to user
- `strengths[]`, `challenges[]` - bullet points
- `compatibleWith` - which types pair well
- `shareText` - text used when sharing
- `gradient`, `color` - visual theme

### Change test metadata
Edit `src/data/config.ts` for title, subtitle, description, share hashtag.

### Scale to more types (e.g., 16 types)
1. Expand `TypeCode` union in `questions.ts`
2. Add all type entries in `results.ts`
3. Add more questions (recommend 2x the number of types)
4. `testLogic.ts` automatically handles any number of types

### Enable Supabase analytics
1. Create Supabase project
2. Create table: `results` with columns `id` (uuid, default gen_random_uuid()), `type` (text), `created_at` (timestamptz, default now())
3. Enable RLS with insert policy for anon
4. Copy URL and anon key to `.env.local`

## Critical Rules

- NEVER expose TypeCode to users in any UI component
- Questions must always have options for ALL type codes
- Result page reads from sessionStorage (set by TestContext on completion)
- All animations use Framer Motion (no CSS animations for interactive elements)
- Mobile-first design (most users access on mobile)

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
```

## Guidelines

- Never use emoji characters anywhere in the site UI (headings, buttons, labels, cards, etc.). Use Lucide React icons instead.

## Deployment

### GitHub → Vercel 자동 배포
1. GitHub에 코드 push
2. https://vercel.com → New Project → GitHub 레포 Import
3. Environment Variables에 `.env.example`의 키 입력 (Supabase 쓰는 경우)
4. Deploy 버튼 클릭

---

## SEO 설정 가이드

### 구글 검색 등록
1. https://search.google.com/search-console 접속
2. 'URL 접두어'로 사이트 추가
3. '다른 확인 방법' → 'HTML 태그' 선택
4. `content="XXXX"` 안의 값을 `.env.local`의 `GOOGLE_SITE_VERIFICATION`에 입력
5. 배포 후 '확인' 클릭
6. Sitemaps 메뉴에서 `sitemap.xml` 등록

### 네이버 검색 등록
1. https://searchadvisor.naver.com 접속
2. 웹마스터 도구 → 사이트 등록
3. 'HTML 태그' 방식 선택
4. `content="XXXX"` 안의 값을 `.env.local`의 `NAVER_SITE_VERIFICATION`에 입력
5. 배포 후 '소유 확인' 클릭
6. 요청 → 사이트맵 제출 → `https://your-domain.com/sitemap.xml`

### OG 이미지 (카카오톡/SNS 공유 미리보기)
- `public/og-image.png` 파일 추가 (권장 크기: 1200×630px)
- `src/data/config.ts`의 `ogImage` 경로도 함께 업데이트하세요

---

## 도메인 연결 가이드 (가비아 → Cloudflare → Vercel)

### 1단계: 가비아에서 도메인 구매
https://gabia.com → 원하는 도메인 검색 및 구매

### 2단계: Cloudflare에 도메인 등록
1. https://cloudflare.com → Add a Site → 도메인 입력
2. 무료 플랜 선택
3. Cloudflare가 제공하는 **네임서버 2개** 복사

### 3단계: 가비아 네임서버 변경
가비아 로그인 → My가비아 → 도메인 관리 → 네임서버 → 직접입력 → Cloudflare 네임서버로 교체 (반영 최대 48시간)

### 4단계: Vercel에 도메인 연결
Vercel 대시보드 → 프로젝트 → Settings → Domains → 도메인 입력 후 Add

### 5단계: Cloudflare DNS 레코드 추가
- Type: `CNAME`, Name: `@`, Target: Vercel CNAME 값, Proxy: DNS only
- Type: `CNAME`, Name: `www`, Target: Vercel CNAME 값, Proxy: DNS only

### 6단계: .env.local 업데이트
`NEXT_PUBLIC_SITE_URL=https://실제도메인.com`으로 변경 후 재배포
