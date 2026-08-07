"use client"

import { ReactNode, useEffect, useRef } from "react"

interface ReportLayoutProps {
  children: ReactNode
  pageNumber: number
}

export function ReportLayout({ children, pageNumber }: ReportLayoutProps) {
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (innerRef.current) {
      // 6. 디버깅용으로 overflow 검사 추가
      const { scrollHeight, clientHeight } = innerRef.current
      if (scrollHeight > clientHeight) {
         console.warn(`Page ${pageNumber.toString().padStart(2, '0')} overflow: scrollHeight(${scrollHeight}) > clientHeight(${clientHeight})`)
      } else {
         console.log(`Page ${pageNumber.toString().padStart(2, '0')} OK`)
      }
    }
  }, [pageNumber, children])

  return (
    <div 
      className="report-page bg-white relative mx-auto shrink-0 border border-gray-300 shadow-md mb-8"
      style={{
        width: "210mm",
        height: "297mm",
        boxSizing: "border-box",
        overflow: "visible", // 2. 개발 화면에서는 overflow를 숨기지 마
      }}
    >
      {/* 얇은 연핑크 테두리 (안쪽 safe area와 동일하거나 약간 밖) */}
      <div 
         className="absolute pointer-events-none border border-[var(--color-hazzi-magenta)]/20"
         style={{ inset: "8mm 8mm 8mm 8mm" }}
      />

      <div 
         ref={innerRef}
         className="report-page-inner absolute flex flex-col font-[family-name:var(--font-sans)] text-gray-900"
         style={{
            inset: "12mm 10mm 10mm 10mm", // 3. 페이지 내부에 Safe Area를 만들어
            boxSizing: "border-box",
         }}
      >
         {/* 헤더 (페이지 번호 및 로고 텍스트) */}
         <header className="flex justify-between items-center text-xs font-bold tracking-widest font-[family-name:var(--font-space)] shrink-0 mb-6 px-2">
            <span className="text-[var(--color-hazzi-magenta)]">{pageNumber.toString().padStart(2, '0')}</span>
            <span className="text-gray-900">HAZZI</span>
         </header>

         {/* 메인 콘텐츠 영역 */}
         <main className="flex-1 flex flex-col px-2 pb-2">
            {children}
         </main>
      </div>
    </div>
  )
}
