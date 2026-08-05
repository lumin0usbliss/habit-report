#!/usr/bin/env node

/**
 * Harness Setup Menu (Stage 2)
 * Run with: npm run setup
 *
 * Uses only Node.js built-ins — no extra dependencies required.
 */

import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import readline from 'node:readline'

// ─── Color helpers ────────────────────────────────────────────────────────────
const color = process.stdout.isTTY && process.env.TERM !== 'dumb'
const w = (code) => (s) => color ? `\x1b[${code}m${s}\x1b[0m` : String(s)
const c = {
  gray: w(90), red: w(31), green: w(32), yellow: w(33), cyan: w(36),
  bold: w(1), dim: w(2), cyanBold: (s) => w(1)(w(36)(s)),
}

// ─── readline ─────────────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((r) => rl.question(q, r))

async function askConfirm(msg, defYes = true) {
  const hint = defYes ? '(Y/n)' : '(y/N)'
  const a = (await ask(`  ${msg} ${c.gray(hint)}: `)).trim().toLowerCase()
  if (!a) return defYes
  return a === 'y' || a === 'yes' || a === 'ㅇ'
}

async function askText(msg, hint = '') {
  const h = hint ? c.gray(` ${hint}`) : ''
  return (await ask(`  ${msg}${h}: `)).trim()
}

async function askPassword(msg) {
  console.log(c.dim('  (비밀번호가 화면에 보여요. 주변을 확인하세요)'))
  return (await ask(`  ${msg}: `)).trim()
}

// ─── System helpers ───────────────────────────────────────────────────────────
function cmdExists(cmd) {
  try {
    execSync(process.platform === 'win32' ? `where ${cmd}` : `which ${cmd}`, { stdio: 'pipe' })
    return true
  } catch { return false }
}

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts })
}

function runSilent(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', ...opts }).toString()
}

function openBrowser(url) {
  try {
    const cmd = process.platform === 'win32' ? `start "" "${url}"`
              : process.platform === 'darwin' ? `open "${url}"`
              : `xdg-open "${url}"`
    execSync(cmd, { stdio: 'ignore' })
  } catch {}
}

function addVercelEnv(key, value, env = 'production') {
  return new Promise((resolve) => {
    const child = spawn('vercel', ['env', 'add', key, env], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    })
    child.stdin.write(value + '\n')
    child.stdin.end()
    child.on('close', (code) => resolve(code === 0))
  })
}

function updateEnvLocal(projectDir, key, value) {
  const envPath = join(projectDir, '.env.local')
  let content = existsSync(envPath) ? readFileSync(envPath, 'utf8') : ''
  const regex = new RegExp(`^${key}=.*$`, 'm')
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`)
  } else {
    content += (content && !content.endsWith('\n') ? '\n' : '') + `${key}=${value}\n`
  }
  writeFileSync(envPath, content)
}

// ─── Project info ─────────────────────────────────────────────────────────────
function getProjectInfo(projectDir) {
  const pkg = JSON.parse(readFileSync(join(projectDir, 'package.json'), 'utf8'))
  const hasRemote = (() => {
    try {
      runSilent('git remote get-url origin', { cwd: projectDir })
      return true
    } catch { return false }
  })()
  return {
    name: pkg.name,
    type: pkg.harness?.type || 'landing',
    vercelLinked: existsSync(join(projectDir, '.vercel', 'project.json')),
    githubLinked: hasRemote,
  }
}

function typeLabel(t) {
  return ({ landing: '랜딩 페이지', company: '회사 홈페이지', test: '성향 테스트' })[t] || t
}

// ─── Menu ─────────────────────────────────────────────────────────────────────
async function showMenu(info) {
  console.log('')
  console.log(c.bold('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'))
  console.log('  ' + c.bold(info.name) + c.gray(`  ·  ${typeLabel(info.type)}`))

  const badges = []
  badges.push(info.githubLinked ? c.green('GitHub 연결됨') : c.gray('GitHub 연결 안 됨'))
  badges.push(info.vercelLinked ? c.green('Vercel 연결됨') : c.gray('Vercel 연결 안 됨'))
  console.log('  ' + badges.join(c.gray('  ·  ')))
  console.log(c.bold('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'))

  console.log(c.bold('\n  뭘 도와드릴까요?\n'))

  const options = []
  let n = 1

  options.push({
    key: String(n++), id: 'deploy',
    label: info.vercelLinked ? '인터넷 재배포' : '인터넷에 올리기',
    desc: info.vercelLinked
      ? '코드 변경사항을 다시 배포합니다'
      : 'GitHub + Vercel로 전 세계에 공개 (무료, 5분)',
  })

  if (info.type !== 'landing') {
    options.push({
      key: String(n++), id: 'database',
      label: '데이터 저장소 설정',
      desc: info.type === 'test'
        ? 'Supabase 무료 DB — 테스트 결과 저장'
        : 'Supabase 무료 DB — 문의 내용 저장',
    })
  }

  if (info.type === 'test') {
    options.push({
      key: String(n++), id: 'admin_password',
      label: '관리자 비밀번호 설정',
      desc: '/admin 페이지 접속 비밀번호',
    })
  }

  options.push({
    key: String(n++), id: 'domain',
    label: '내 도메인 연결 안내',
    desc: '가비아 → Cloudflare → Vercel 연결 방법',
  })

  options.push({ key: String(n++), id: 'exit', label: '나가기', desc: '' })

  for (const o of options) {
    console.log(`  ${c.cyan(`[${o.key}]`)} ${c.bold(o.label)}`)
    if (o.desc) console.log(`      ${c.gray(o.desc)}`)
  }

  const answer = await ask(c.cyan('\n  선택: '))
  return options.find((o) => o.key === answer.trim())?.id
}

// ─── Deploy flow ──────────────────────────────────────────────────────────────
async function deployFlow(projectDir, info) {
  console.log(c.cyanBold('\n  ━━━ 인터넷에 올리기 ━━━\n'))
  console.log('  지금 내 컴퓨터에만 있는 사이트를')
  console.log('  전 세계 누구나 볼 수 있게 만들어요.\n')
  console.log(c.bold('  필요한 것 (둘 다 무료):'))
  console.log('    - GitHub 계정  (코드 저장소)')
  console.log('    - Vercel 계정  (자동 배포 서비스)')
  console.log(c.dim('    → GitHub 계정으로 Vercel도 바로 로그인돼요\n'))
  console.log(c.bold('  작동 방식:'))
  console.log('    1. 코드를 GitHub에 올려요')
  console.log('    2. Vercel이 코드를 가져가서 인터넷에 띄워요')
  console.log('    3. my-site.vercel.app 같은 주소가 생겨요')
  console.log('    4. 다음에 코드를 수정하면 자동으로 재배포돼요\n')
  console.log(c.bold('  예상 시간: 약 5분\n'))

  if (!(await askConfirm('계속할까요?'))) return

  // Check tools
  if (!cmdExists('gh')) {
    console.log(c.yellow('\n  GitHub CLI가 필요해요.'))
    console.log('  설치: ' + c.cyan('https://cli.github.com'))
    console.log(c.gray('  설치 후 "gh auth login" 실행, 그 다음 이 메뉴를 다시 열어주세요.\n'))
    return
  }
  if (!cmdExists('vercel')) {
    console.log(c.yellow('\n  Vercel CLI가 필요해요.'))
    console.log('  터미널에서: ' + c.cyan('npm i -g vercel'))
    console.log(c.gray('  설치 후 "vercel login" 실행, 그 다음 이 메뉴를 다시 열어주세요.\n'))
    return
  }

  // GitHub auth check
  try {
    runSilent('gh auth status')
  } catch {
    console.log(c.yellow('\n  GitHub 로그인이 필요해요.'))
    console.log('  터미널에서 실행: ' + c.cyan('gh auth login'))
    console.log(c.gray('  (브라우저가 열리면서 로그인 화면이 나와요)\n'))
    return
  }

  // GitHub repo create
  if (!info.githubLinked) {
    const pkg = JSON.parse(readFileSync(join(projectDir, 'package.json'), 'utf8'))
    const defaultName = pkg.name

    console.log(c.bold('\n  GitHub 레포 생성\n'))
    const repoName = (await askText(`레포 이름`, `(그냥 Enter 누르면: ${defaultName})`)) || defaultName
    const isPublic = await askConfirm('공개 레포로 만들까요? (아니면 비공개)', false)
    const visibility = isPublic ? '--public' : '--private'

    console.log(c.gray('  레포 생성 중...'))
    try {
      run(`gh repo create ${repoName} ${visibility} --source=. --remote=origin --push`, { cwd: projectDir })
      console.log(c.green('\n  ✓ GitHub 레포 생성 완료'))
      info.githubLinked = true
    } catch {
      console.log(c.yellow('\n  레포 생성 실패. 이미 있는 이름일 수 있어요.\n'))
      return
    }
  } else {
    console.log(c.gray('\n  GitHub 연결 확인됨. 최신 코드 push 중...'))
    try {
      run('git push', { cwd: projectDir, stdio: 'pipe' })
    } catch {}
  }

  // Vercel auth check
  try {
    runSilent('vercel whoami')
  } catch {
    console.log(c.yellow('\n  Vercel 로그인이 필요해요.'))
    console.log('  터미널에서 실행: ' + c.cyan('vercel login'))
    console.log(c.gray('  (이메일로 로그인 링크가 와요)\n'))
    return
  }

  // Vercel link
  if (!info.vercelLinked) {
    console.log(c.bold('\n  Vercel 프로젝트 연결'))
    console.log(c.gray('  (질문이 몇 개 나와요. 대부분 그냥 Enter 눌러도 됩니다)\n'))
    try {
      const child = spawn('vercel', ['link', '--yes'], { cwd: projectDir, stdio: 'inherit', shell: true })
      await new Promise((r) => child.on('close', r))
      info.vercelLinked = existsSync(join(projectDir, '.vercel', 'project.json'))
      if (info.vercelLinked) console.log(c.green('\n  ✓ Vercel 연결 완료'))
    } catch {
      console.log(c.yellow('\n  Vercel 연결 실패'))
      return
    }
  }

  // Deploy
  console.log(c.bold('\n  배포 중... (보통 1~2분)\n'))
  try {
    const output = runSilent('vercel --prod --yes', { cwd: projectDir })
    const urlMatch = output.match(/https:\/\/[^\s]+\.vercel\.app/)
    const url = urlMatch ? urlMatch[0] : null
    if (url) {
      console.log(c.green('  ✓ 배포 완료!'))
      console.log(c.cyanBold(`\n  내 사이트 주소: ${url}\n`))
      if (await askConfirm('브라우저에서 열어볼까요?')) {
        openBrowser(url)
      }
    } else {
      console.log(c.green('  ✓ 배포 완료 — Vercel 대시보드에서 URL 확인하세요\n'))
    }
  } catch {
    console.log(c.yellow('  배포 실패 — Vercel 대시보드에서 로그를 확인하세요'))
    console.log(c.gray('  환경변수가 없으면 배포가 실패할 수 있어요.'))
    console.log(c.gray('  메뉴에서 "데이터 저장소 설정"을 먼저 해보세요.\n'))
  }
}

// ─── Database flow ────────────────────────────────────────────────────────────
async function databaseFlow(projectDir, info) {
  console.log(c.cyanBold('\n  ━━━ 데이터 저장소 설정 ━━━\n'))
  console.log('  Supabase는 무료 데이터베이스 서비스예요.')
  console.log(
    info.type === 'test'
      ? '  테스트 결과가 저장되고, 관리자 페이지에서 볼 수 있어요.\n'
      : '  문의 내용이 저장되고, 관리자 페이지에서 볼 수 있어요.\n'
  )
  console.log(c.bold('  작동 방식:'))
  console.log('    1. supabase.com 에서 프로젝트를 만들어요 (GitHub 계정으로 로그인)')
  console.log('    2. DB 테이블을 만들어요 (SQL 한 번만 실행)')
  console.log('    3. API 키 2개를 복사해서 여기에 붙여넣어요')
  console.log('    4. 자동으로 .env.local에 저장됩니다\n')
  console.log(c.bold('  예상 시간: 5~10분\n'))

  if (!(await askConfirm('계속할까요?'))) return

  console.log(c.gray('\n  supabase.com 을 브라우저에서 엽니다...'))
  openBrowser('https://supabase.com/dashboard')

  console.log(c.bold('\n  1단계 — 프로젝트 만들기\n'))
  console.log('  · 브라우저에서 "New project" 클릭')
  console.log('  · 프로젝트 이름 입력')
  console.log('  · Region: ' + c.cyan('Northeast Asia (Seoul)') + ' 선택')
  console.log('  · 데이터베이스 비밀번호 생성 (Supabase가 제안하는 걸 쓰세요)')
  console.log(c.dim('  · 프로젝트 준비까지 약 1~2분 기다리세요\n'))

  if (!(await askConfirm('프로젝트 생성 완료했어요'))) return

  console.log(c.bold('\n  2단계 — 테이블 만들기\n'))
  console.log('  · 왼쪽 메뉴에서 ' + c.cyan('SQL Editor') + ' 클릭')
  console.log('  · ' + c.cyan('New query') + ' 버튼 클릭')
  console.log('  · 아래 SQL을 전체 복사 → 붙여넣기 → 오른쪽 위 ' + c.cyan('Run') + ' 버튼 클릭\n')
  console.log(c.gray('  ' + '─'.repeat(64)))

  let sql
  if (info.type === 'test') {
    sql = `CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  final_type INTEGER NOT NULL CHECK (final_type BETWEEN 1 AND 9),
  scores JSONB NOT NULL,
  ranking JSONB NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert" ON test_results FOR INSERT WITH CHECK (true);
CREATE POLICY "public_select" ON test_results FOR SELECT USING (true);`
  } else if (info.type === 'company') {
    sql = `CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_select" ON contacts FOR SELECT USING (auth.role() = 'authenticated');`
  }

  sql.split('\n').forEach((l) => console.log(c.cyan('  ' + l)))
  console.log(c.gray('  ' + '─'.repeat(64)))
  console.log(c.dim('\n  "Success. No rows returned" 메시지가 나오면 성공이에요.\n'))

  if (!(await askConfirm('SQL 실행 완료했어요'))) return

  console.log(c.bold('\n  3단계 — API 키 가져오기\n'))
  console.log('  · 왼쪽 메뉴 아래쪽 톱니바퀴 아이콘 클릭')
  console.log('  · ' + c.cyan('Project Settings') + ' → ' + c.cyan('API') + ' 클릭')
  console.log('  · 아래 두 값을 복사해서 여기에 붙여넣으세요:\n')
  console.log('    - ' + c.cyan('Project URL') + c.gray(' (https://...supabase.co 형식)'))
  console.log('    - ' + c.cyan('anon public') + c.gray(' (eyJ로 시작하는 긴 문자열)\n'))

  const url = await askText('Project URL', '(https://...supabase.co)')
  if (!url.startsWith('https://')) {
    console.log(c.yellow('\n  URL은 https://로 시작해야 합니다. 취소합니다.\n'))
    return
  }

  const key = await askPassword('anon public 키')
  if (key.length < 20) {
    console.log(c.yellow('\n  anon 키가 너무 짧습니다. 취소합니다.\n'))
    return
  }

  // Save locally
  updateEnvLocal(projectDir, 'NEXT_PUBLIC_SUPABASE_URL', url)
  updateEnvLocal(projectDir, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', key)
  console.log(c.green('\n  ✓ .env.local에 저장 완료'))

  // Sync to Vercel
  if (info.vercelLinked) {
    console.log('')
    if (await askConfirm('Vercel에도 환경변수를 설정할까요? (배포된 사이트에 필요)')) {
      console.log(c.gray('  Vercel에 설정 중...'))
      const ok1 = await addVercelEnv('NEXT_PUBLIC_SUPABASE_URL', url)
      console.log(ok1 ? c.green('  ✓ URL 설정 완료') : c.yellow('  URL 설정 실패'))
      const ok2 = await addVercelEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', key)
      console.log(ok2 ? c.green('  ✓ 키 설정 완료') : c.yellow('  키 설정 실패'))

      if (ok1 && ok2 && (await askConfirm('\n  지금 재배포할까요?'))) {
        console.log(c.gray('  배포 중...'))
        try {
          const output = runSilent('vercel --prod --yes', { cwd: projectDir })
          const m = output.match(/https:\/\/[^\s]+\.vercel\.app/)
          if (m) console.log(c.green(`  ✓ 재배포 완료: ${m[0]}`))
          else console.log(c.green('  ✓ 재배포 완료'))
        } catch {
          console.log(c.yellow('  재배포 실패'))
        }
      }
    }
  } else {
    console.log(c.dim('\n  (Vercel 연결 전이라 로컬에만 저장됨. 나중에 배포하면 자동 동기화)'))
  }

  console.log(c.green('\n  데이터베이스 설정 완료!'))
  console.log(c.gray('  npm run dev 실행 후 테스트해보세요.\n'))
}

// ─── Admin password flow ──────────────────────────────────────────────────────
async function adminPasswordFlow(projectDir, info) {
  console.log(c.cyanBold('\n  ━━━ 관리자 비밀번호 설정 ━━━\n'))
  console.log('  관리자 페이지(/admin)에 들어갈 때 쓰는 비밀번호예요.')
  console.log(c.dim('  소스 코드에는 저장되지 않고 환경변수로 관리됩니다.\n'))
  console.log(c.yellow('  주의: 영문+숫자 조합 8자 이상 권장'))
  console.log(c.dim('  (단순한 인증이라 민감한 정보는 담지 마세요)\n'))

  const pw = await askPassword('새 관리자 비밀번호')
  if (pw.length < 6) {
    console.log(c.yellow('\n  6자 이상 입력하세요. 취소합니다.\n'))
    return
  }

  const confirm = await askPassword('한 번 더 입력')
  if (pw !== confirm) {
    console.log(c.yellow('\n  두 비밀번호가 다릅니다. 취소합니다.\n'))
    return
  }

  updateEnvLocal(projectDir, 'NEXT_PUBLIC_ADMIN_PASSWORD', pw)
  console.log(c.green('\n  ✓ .env.local에 저장 완료'))

  if (info.vercelLinked) {
    if (await askConfirm('Vercel에도 설정할까요?')) {
      const ok = await addVercelEnv('NEXT_PUBLIC_ADMIN_PASSWORD', pw)
      console.log(ok ? c.green('  ✓ Vercel 설정 완료') : c.yellow('  Vercel 설정 실패'))

      if (ok && (await askConfirm('지금 재배포할까요?'))) {
        try {
          run('vercel --prod --yes', { cwd: projectDir })
          console.log(c.green('\n  ✓ 재배포 완료'))
        } catch {
          console.log(c.yellow('  재배포 실패'))
        }
      }
    }
  }

  console.log(c.gray('\n  /admin 페이지에서 새 비밀번호로 로그인하세요.\n'))
}

// ─── Domain guide ─────────────────────────────────────────────────────────────
function domainGuide() {
  console.log(c.cyanBold('\n  ━━━ 내 도메인 연결하기 ━━━\n'))
  console.log('  my-site.vercel.app 같은 기본 주소 대신')
  console.log('  my-brand.com 같은 내 도메인을 쓰는 방법이에요.\n')
  console.log(c.bold('  필요한 것:'))
  console.log('    - 가비아 계정 — 도메인 구매처')
  console.log('    - Cloudflare 계정 — DNS 관리 (무료)')
  console.log('    - 도메인 가격: 보통 연 1~3만원\n')

  console.log(c.bold('  순서:\n'))

  console.log(c.bold('  1. 가비아에서 도메인 구매'))
  console.log('     ' + c.cyan('gabia.com') + ' → 도메인 검색 → 결제\n')

  console.log(c.bold('  2. Cloudflare에 도메인 등록'))
  console.log('     ' + c.cyan('cloudflare.com') + ' → Add a Site → 무료 플랜')
  console.log(c.gray('     → Cloudflare가 네임서버 2개를 알려줘요 (복사해두기)\n'))

  console.log(c.bold('  3. 가비아 네임서버 교체'))
  console.log('     가비아 → My가비아 → 도메인 관리 → 네임서버')
  console.log('     → 직접입력 → Cloudflare 네임서버 2개 입력')
  console.log(c.dim('     (전파 최대 48시간, 보통 몇 시간)\n'))

  console.log(c.bold('  4. Vercel에 도메인 추가'))
  console.log('     Vercel 대시보드 → 프로젝트 → Settings → Domains')
  console.log('     → 도메인 입력 → Add\n')

  console.log(c.bold('  5. Cloudflare DNS 레코드 추가'))
  console.log('     Cloudflare → 내 도메인 → DNS → 레코드 추가:')
  console.log(c.gray('       CNAME  @    cname.vercel-dns.com    Proxy: DNS only'))
  console.log(c.gray('       CNAME  www  cname.vercel-dns.com    Proxy: DNS only\n'))

  console.log('  몇 분 기다리면 내 도메인으로 접속됩니다.\n')
  console.log(c.dim('  자세한 안내는 프로젝트 루트의 CLAUDE.md → "도메인 연결 가이드" 참고\n'))
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const projectDir = process.cwd()

  if (!existsSync(join(projectDir, 'package.json'))) {
    console.log(c.red('\n  package.json이 없어요.'))
    console.log(c.gray('  프로젝트 폴더에서 실행하세요:'))
    console.log(c.cyan('    cd 내프로젝트 && npm run setup\n'))
    rl.close()
    process.exit(1)
  }

  const info = getProjectInfo(projectDir)

  while (true) {
    const choice = await showMenu(info)

    if (!choice || choice === 'exit') {
      console.log(c.gray('\n  또 봐요!\n'))
      break
    }

    try {
      if (choice === 'deploy') await deployFlow(projectDir, info)
      else if (choice === 'database') await databaseFlow(projectDir, info)
      else if (choice === 'admin_password') await adminPasswordFlow(projectDir, info)
      else if (choice === 'domain') domainGuide()
    } catch (e) {
      console.log(c.red('\n  오류: ') + e.message + '\n')
    }

    // Refresh state after each action
    Object.assign(info, getProjectInfo(projectDir))
  }

  rl.close()
}

main().catch((e) => {
  console.error(c.red('\n  오류: '), e.message)
  rl.close()
  process.exit(1)
})
