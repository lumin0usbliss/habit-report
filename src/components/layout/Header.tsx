"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { label: "리포트 소개", href: "/#about" },
  { label: "결과 미리보기", href: "/#preview" },
  { label: "리포트 혜택", href: "/#beta" },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[var(--color-hazzi-canvas)]/80 backdrop-blur-md border-b border-[var(--color-hazzi-gray-300)]" data-html2canvas-ignore="true">
      <div className="max-w-5xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center pt-0.5">
          <img src="/logo_cropped.png" alt="HAZZI" className="h-6 md:h-7 w-auto max-w-[105px] md:max-w-none" />
        </Link>

        {/* DESKTOP NAVIGATION & CTA (md+) */}
        <div className="hidden md:flex gap-6 items-center">
          <nav className="flex gap-6 text-sm font-medium text-[var(--color-hazzi-gray-500)]">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="hover:text-[var(--color-hazzi-ink)] transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link 
            href="/apply" 
            className="bg-[var(--color-hazzi-ink)] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-black transition-colors"
          >
            리포트 체크하기
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON (<md) */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isOpen}
          className="md:hidden p-2 -mr-2 text-[var(--color-hazzi-ink)] focus:outline-none flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE DROPDOWN PANEL (<md) */}
      {isOpen && (
        <>
          {/* Backdrop for click outside */}
          <div 
            className="fixed inset-0 top-14 bg-black/20 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          {/* Panel */}
          <div className="absolute top-14 left-0 right-0 w-full z-50 bg-[var(--color-hazzi-canvas)] border-b border-[var(--color-hazzi-gray-300)] shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col p-4 gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center h-11 px-3 text-sm font-semibold text-[var(--color-hazzi-ink)] hover:bg-gray-100/70 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 mt-1 border-t border-gray-200">
                <Link
                  href="/apply"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full h-11 bg-[var(--color-hazzi-ink)] text-white text-sm font-bold rounded-xl hover:bg-black transition-colors shadow-sm"
                >
                  리포트 체크하기
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
