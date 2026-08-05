"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Footer } from "@/components/layout/Footer"
import { categories } from "@/data/questions"
import { results } from "@/data/results"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export default function HomePage() {
  const partialTypes = Object.values(results).slice(0, 3) // Show first 3

  return (
    <div className="flex-1 flex flex-col font-[family-name:var(--font-ibm-plex)] bg-[var(--color-hazzi-canvas)] text-[var(--color-hazzi-ink)] overflow-x-hidden">
      
      {/* 4-1. Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-hazzi-canvas)]/80 backdrop-blur-md border-b border-[var(--color-hazzi-gray-300)]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-[family-name:var(--font-space)] font-bold text-xl tracking-tighter text-[var(--color-hazzi-magenta)]">
            HAZZI
          </div>
          <div className="flex gap-6 items-center">
            <nav className="hidden md:flex gap-6 text-sm font-medium text-[var(--color-hazzi-gray-500)]">
              <a href="#about" className="hover:text-[var(--color-hazzi-ink)] transition">리포트 소개</a>
              <a href="#preview" className="hover:text-[var(--color-hazzi-ink)] transition">결과 미리보기</a>
              <a href="#beta" className="hover:text-[var(--color-hazzi-ink)] transition">리포트 혜택</a>
            </nav>
            <Link 
              href="/apply" 
              className="bg-[var(--color-hazzi-ink)] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-black transition-colors"
            >
              리포트 체크하기
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        
        {/* 4-2. Hero */}
        <section className="pt-20 pb-32 px-4 max-w-5xl mx-auto text-center border-b border-[var(--color-hazzi-gray-300)]">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="font-[family-name:var(--font-space)] text-xs font-bold tracking-[0.2em] text-[var(--color-hazzi-gray-500)] mb-6">
              HAZZI HABIT REPORT
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-[1.3] break-keep">
              습관도, <br />
              나에게 맞는 방식이 있다.
            </h1>
            <p className="text-[var(--color-hazzi-gray-500)] text-lg md:text-xl mb-12 leading-relaxed break-keep">
              계획은 잘 세우는데 시작하기 어렵고,<br className="hidden md:block"/> 
              며칠 잘하다가 다시 멈추고 있나요?<br/><br className="hidden md:block"/>
              7개 습관 영역을 통해 내가 움직이는 방식과<br className="hidden md:block"/> 
              반복해서 멈추는 이유를 확인해보세요.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {['7개 진단 영역', '9가지 습관 유형', '대표·보조 유형 분석', '약 8~10분'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-white border border-[var(--color-hazzi-gray-300)] rounded-full text-sm font-bold shadow-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="p-6 bg-white border border-[var(--color-hazzi-gray-300)] rounded-2xl mb-12 inline-block max-w-xl mx-auto shadow-sm">
              <p className="font-bold text-[var(--color-hazzi-magenta)] break-keep">
                문항을 체크하고 나만의 상세 리포트와 7일 체크리스트를 확인해보세요.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
              <Link 
                href="/apply" 
                className="w-full bg-[var(--color-hazzi-magenta)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[var(--color-hazzi-deep)] transition-colors shadow-md"
              >
                나의 리포트 체크하기
              </Link>
              <a 
                href="#preview" 
                className="w-full bg-white text-[var(--color-hazzi-ink)] py-4 rounded-xl font-bold text-lg border border-[var(--color-hazzi-gray-300)] hover:border-[var(--color-hazzi-ink)] transition-colors"
              >
                결과 리포트 미리보기
              </a>
            </div>
            
            <p className="mt-8 text-sm text-[var(--color-hazzi-gray-500)]">
              이번에도 의지를 탓하기 전에, 나에게 맞는 방법부터 찾아보세요.
            </p>
          </motion.div>
        </section>

        {/* 4-3. 문제 공감 */}
        <section id="about" className="py-24 px-4 max-w-5xl mx-auto border-b border-[var(--color-hazzi-gray-300)]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center break-keep">
              왜 나는 늘 시작하고도 멈출까요?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                {
                  title: '계획만 커지는 날',
                  desc: '의욕이 앞서 무리한 목표를 세웠다가 막상 시작조차 하지 못하고 계속 미루기만 합니다.'
                },
                {
                  title: '하루 놓치고 전부 포기한 날',
                  desc: '한 번의 실수를 실패로 여기고, 완벽하게 해내지 못했다는 실망감에 모두 놓아버립니다.'
                },
                {
                  title: '혼자 하다가 흐지부지된 날',
                  desc: '아무도 지켜보지 않으면 긴장이 풀리고, 결국 바쁜 일상에 밀려 우선순위에서 사라집니다.'
                }
              ].map((scene, i) => (
                <div key={i} className="bg-white border border-[var(--color-hazzi-gray-300)] rounded-3xl p-8 pt-24 flex flex-col shadow-sm relative overflow-hidden group hover:border-[var(--color-hazzi-magenta)] transition-colors">
                  <p className="font-[family-name:var(--font-space)] text-[var(--color-hazzi-gray-100)] text-8xl font-bold absolute -top-2 -left-2 tracking-tighter group-hover:text-fuchsia-50 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <div className="z-10 flex flex-col h-full">
                    <p className="text-xl font-bold mb-3">{scene.title}</p>
                    <p className="text-sm text-[var(--color-hazzi-gray-500)] leading-relaxed break-keep">
                      {scene.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center max-w-2xl mx-auto">
              <p className="text-lg leading-relaxed text-[var(--color-hazzi-gray-500)] mb-8 break-keep">
                처음에는 의욕이 넘치지만 며칠 뒤 잊어버리고, <br/>
                계획을 세우는 데 시간을 다 쓰거나, <br/>
                한 번 실패하면 아예 포기해버리기도 합니다. <br/><br/>
                하지만 모든 사람이 같은 이유로 습관에 실패하는 것은 아닙니다. <br/>
                누군가는 시작할 계기가 필요하고, <br/>
                누군가는 함께 확인해줄 사람이 필요하고, <br/>
                누군가는 목표를 더 작게 나눠야 합니다.
              </p>
              <p className="text-xl font-bold text-[var(--color-hazzi-magenta)] break-keep">
                의지가 부족한 게 아니라<br/>
                나에게 맞지 않는 방식으로 하고 있었을지도 몰라요.
              </p>
            </div>
          </motion.div>
        </section>

        {/* 4-4. 테스트에서 알 수 있는 것 */}
        <section className="py-24 px-4 max-w-5xl mx-auto border-b border-[var(--color-hazzi-gray-300)]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center break-keep">
              유형 이름만 알려주는 테스트가 아닙니다.
            </h2>
            <p className="text-center text-[var(--color-hazzi-gray-500)] mb-16 max-w-2xl mx-auto break-keep leading-relaxed">
              HAZZI는 습관을 시작하고 유지하는 과정에서 나타나는 나의 패턴을 분석하고, 실제로 적용할 수 있는 실행 방법을 제안합니다.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-[var(--color-hazzi-gray-300)] p-8 rounded-2xl shadow-sm">
                <h3 className="font-[family-name:var(--font-space)] text-[var(--color-hazzi-magenta)] font-bold text-sm tracking-widest mb-4">TYPE</h3>
                <p className="font-bold text-lg mb-2">대표·보조 유형 분석</p>
                <p className="text-[var(--color-hazzi-gray-500)] text-sm">나를 이끄는 핵심 동력과 서브 동력의 조합</p>
              </div>
              <div className="bg-white border border-[var(--color-hazzi-gray-300)] p-8 rounded-2xl shadow-sm">
                <h3 className="font-[family-name:var(--font-space)] text-[var(--color-hazzi-magenta)] font-bold text-sm tracking-widest mb-4">PATTERN</h3>
                <p className="font-bold text-lg mb-2">시작과 중단 패턴</p>
                <p className="text-[var(--color-hazzi-gray-500)] text-sm">7개 영역별 분석 및 자주 무너지는 순간 파악</p>
              </div>
              <div className="bg-white border border-[var(--color-hazzi-gray-300)] p-8 rounded-2xl shadow-sm">
                <h3 className="font-[family-name:var(--font-space)] text-[var(--color-hazzi-magenta)] font-bold text-sm tracking-widest mb-4">STRATEGY</h3>
                <p className="font-bold text-lg mb-2">맞춤 실행 전략</p>
                <p className="text-[var(--color-hazzi-gray-500)] text-sm">나를 움직이게 만드는 조건과 피해야 할 설계 방식</p>
              </div>
              <div className="bg-white border border-[var(--color-hazzi-gray-300)] p-8 rounded-2xl shadow-sm">
                <h3 className="font-[family-name:var(--font-space)] text-[var(--color-hazzi-magenta)] font-bold text-sm tracking-widest mb-4">7 DAYS</h3>
                <p className="font-bold text-lg mb-2">7일 체크리스트</p>
                <p className="text-[var(--color-hazzi-gray-500)] text-sm">결과를 즉시 삶에 적용할 수 있는 7일 맞춤 미션</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4-5. 7개 진단 영역 */}
        <section className="py-24 px-4 max-w-5xl mx-auto border-b border-[var(--color-hazzi-gray-300)]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 break-keep">
                습관을 만드는 7개의 장면을 살펴봅니다.
              </h2>
              <p className="text-[var(--color-hazzi-gray-500)] max-w-2xl mx-auto leading-relaxed break-keep">
                습관은 단순히 부지런함이나 의지만으로 결정되지 않습니다. 시작, 계획, 환경, 지속, 회복 등 여러 영역을 함께 살펴봐야 합니다.
              </p>
            </div>

            <div className="grid gap-4 max-w-3xl mx-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="flex flex-col md:flex-row md:items-center gap-4 bg-white border border-[var(--color-hazzi-gray-300)] p-6 rounded-2xl shadow-sm">
                  <div className="w-24 shrink-0">
                    <span className="font-[family-name:var(--font-space)] text-[var(--color-hazzi-magenta)] font-bold text-sm tracking-widest">
                      {cat.englishLabel}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                    <p className="text-sm text-[var(--color-hazzi-gray-500)]">{cat.shortDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 4-6. 9가지 유형 미리보기 */}
        <section className="py-24 px-4 max-w-5xl mx-auto border-b border-[var(--color-hazzi-gray-300)] bg-[var(--color-hazzi-ink)] text-white -mx-4 rounded-3xl my-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="text-center mb-16">
              <p className="font-[family-name:var(--font-space)] text-[var(--color-hazzi-lime)] font-bold tracking-widest mb-4 text-sm">
                9 TYPES / WHICH ONE ARE YOU?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 break-keep">
                같은 목표도, 실행하는 방식은 다릅니다.
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed break-keep">
                HAZZI는 테스트 결과를 바탕으로 9가지 유형 중 나를 가장 잘 설명하는 대표 유형과 보조 유형을 보여줍니다.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
              {partialTypes.map(type => (
                <div key={type.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                  <p className="font-[family-name:var(--font-space)] text-neutral-500 text-xs mb-4 font-bold">{type.code}</p>
                  <h3 className="font-bold text-lg mb-2">{type.name}</h3>
                  <p className="text-sm text-[var(--color-hazzi-lime)] mb-4">"{type.oneLineSummary}"</p>
                  <div className="flex gap-2">
                    {type.keywords.slice(0, 2).map(k => (
                      <span key={k} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">#{k}</span>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex items-center justify-center col-span-full md:col-span-3">
                <p className="text-neutral-500 font-bold">그리고 숨겨진 6가지 유형들...</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4-7. 결과 리포트 미리보기 */}
        <section id="preview" className="py-24 px-4 max-w-5xl mx-auto border-b border-[var(--color-hazzi-gray-300)]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 break-keep">
                결과를 읽고 끝나지 않도록,<br />
                7일간 실행할 방법까지 담았습니다.
              </h2>
              <p className="text-[var(--color-hazzi-gray-500)] max-w-2xl mx-auto leading-relaxed break-keep">
                상세 리포트에서는 대표 유형과 보조 유형의 조합을 분석하고, 나에게 맞는 습관 설계 방식과 7일 체크리스트를 제공합니다.
              </p>
            </div>
            
            {/* Visual representation of a report */}
            <div className="max-w-3xl mx-auto bg-white border border-[var(--color-hazzi-gray-300)] rounded-2xl shadow-xl overflow-hidden mb-12">
              <div className="bg-[var(--color-hazzi-gray-100)] px-6 py-3 border-b border-[var(--color-hazzi-gray-300)] flex justify-between items-center">
                <span className="font-[family-name:var(--font-space)] text-xs font-bold tracking-widest">SAMPLE REPORT</span>
                <span className="text-[var(--color-hazzi-magenta)] text-xs font-bold px-2 py-1 bg-fuchsia-100 rounded">SAMPLE</span>
              </div>
              <div className="p-8 md:p-12">
                <div className="h-4 bg-[var(--color-hazzi-gray-300)] w-1/3 rounded mb-4" />
                <div className="h-8 bg-[var(--color-hazzi-ink)] w-2/3 rounded mb-12" />
                
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="h-40 bg-[var(--color-hazzi-canvas)] rounded-xl border border-[var(--color-hazzi-gray-100)]" />
                  <div className="h-40 bg-[var(--color-hazzi-canvas)] rounded-xl border border-[var(--color-hazzi-gray-100)]" />
                </div>
                
                <div className="space-y-4 mb-12">
                  <div className="h-3 bg-[var(--color-hazzi-gray-300)] w-full rounded" />
                  <div className="h-3 bg-[var(--color-hazzi-gray-300)] w-5/6 rounded" />
                  <div className="h-3 bg-[var(--color-hazzi-gray-300)] w-4/6 rounded" />
                </div>
                
                <div className="h-32 bg-[var(--color-hazzi-canvas)] rounded-xl border border-[var(--color-hazzi-gray-100)] mb-4 flex items-center justify-center">
                  <span className="font-bold text-[var(--color-hazzi-gray-500)]">7일 체크리스트 미리보기</span>
                </div>
              </div>
            </div>
            
          </motion.div>
        </section>

        {/* 4-8. 리포트 혜택 */}
        <section id="beta" className="py-24 px-4 max-w-5xl mx-auto border-b border-[var(--color-hazzi-gray-300)]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="bg-[var(--color-hazzi-magenta)] text-white p-8 md:p-16 rounded-3xl">
              <p className="font-[family-name:var(--font-space)] text-[var(--color-hazzi-lime)] font-bold tracking-widest mb-4 text-sm">
                REPORT BENEFIT
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 break-keep">
                리포트를 통해 나의 습관 유형을 확인해보세요.
              </h2>
              <p className="text-fuchsia-100 mb-12 leading-relaxed max-w-2xl break-keep">
                체크리스트를 완료하면 아래의 항목들이 포함된 상세 리포트를 확인하실 수 있습니다.
              </p>
              
              <ul className="grid md:grid-cols-2 gap-4 mb-12 text-sm md:text-base font-medium">
                <li className="flex items-center gap-3"><span className="text-[var(--color-hazzi-lime)]">✓</span> 대표 유형과 보조 유형 분석</li>
                <li className="flex items-center gap-3"><span className="text-[var(--color-hazzi-lime)]">✓</span> 대표·보조 유형 조합 해석</li>
                <li className="flex items-center gap-3"><span className="text-[var(--color-hazzi-lime)]">✓</span> 7개 습관 영역 결과</li>
                <li className="flex items-center gap-3"><span className="text-[var(--color-hazzi-lime)]">✓</span> 결과 공유 이미지</li>
                <li className="flex items-center gap-3"><span className="text-[var(--color-hazzi-lime)]">✓</span> 개인 맞춤 PDF 리포트</li>
                <li className="flex items-center gap-3"><span className="text-[var(--color-hazzi-lime)]">✓</span> 7일 습관 실행 체크리스트</li>
              </ul>
              
              <div className="bg-black/20 p-6 rounded-2xl mb-8">
                <p className="text-sm text-fuchsia-100 mb-2">리포트 결과와 체크리스트는 언제든 다시 확인할 수 있습니다.</p>
                <p className="text-xs text-fuchsia-200">나에게 맞는 습관 전략을 찾고 오늘부터 바로 시작해보세요.</p>
              </div>
              
              <Link 
                href="/apply" 
                className="inline-block bg-[var(--color-hazzi-lime)] text-[var(--color-hazzi-ink)] px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors"
              >
                나의 리포트 체크하기
              </Link>
            </div>
          </motion.div>
        </section>
        
        {/* 4-11. 마지막 CTA */}
        <section className="py-32 px-4 max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight break-keep">
              이번에도 의지를 탓하기 전에,<br />
              나에게 맞는 방식을 찾아보세요.
            </h2>
            <p className="text-xl text-[var(--color-hazzi-gray-500)] mb-12">
              내가 왜 멈추는지 알면, 다시 시작하는 방법도 달라집니다.
            </p>
            
            <Link 
              href="/apply" 
              className="inline-block bg-[var(--color-hazzi-ink)] text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-black transition-transform hover:-translate-y-1 shadow-xl"
            >
              HAZZI 리포트 체크하기
            </Link>
            <p className="mt-6 text-[var(--color-hazzi-gray-500)] font-medium">
              나는 왜 아직 못 했지? 이제 HAZZI에서 확인해보세요.
            </p>
          </motion.div>
        </section>

      </main>
      
      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-hazzi-canvas)] to-transparent z-40">
        <Link 
          href="/apply" 
          className="block w-full bg-[var(--color-hazzi-magenta)] text-white text-center py-4 rounded-xl font-bold shadow-lg"
        >
          리포트 체크하기
        </Link>
      </div>

      <Footer />
    </div>
  )
}
