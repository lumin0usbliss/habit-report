"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const isResultPage = pathname === "/result"

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[var(--color-hazzi-canvas)]/80 backdrop-blur-md border-b border-[var(--color-hazzi-gray-300)]" data-html2canvas-ignore="true">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center pt-1">
          <img src="/logo_cropped.png" alt="HAZZI" className="h-7 w-auto" />
        </Link>
        <div className="flex gap-6 items-center">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-[var(--color-hazzi-gray-500)]">
            <Link href="/#about" className="hover:text-[var(--color-hazzi-ink)] transition">리포트 소개</Link>
            <Link href="/#preview" className="hover:text-[var(--color-hazzi-ink)] transition">결과 미리보기</Link>
            <Link href="/#beta" className="hover:text-[var(--color-hazzi-ink)] transition">리포트 혜택</Link>
          </nav>
          <Link 
            href="/apply" 
            className={`${isResultPage ? 'hidden sm:inline-flex' : 'inline-flex'} bg-[var(--color-hazzi-ink)] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-black transition-colors`}
          >
            리포트 체크하기
          </Link>
        </div>
      </div>
    </header>
  )
}
