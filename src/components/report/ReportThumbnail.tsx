"use client"

import { useRef, useEffect } from "react"

export function ReportThumbnail({ children, blur = true }: { children: React.ReactNode, blur?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        // 210mm is approx 794px at 96dpi. We use 794 as the base width.
        const scale = width / 794
        containerRef.current.style.setProperty('--scale', scale.toString())
      }
    }
    
    // Initial scale and attach resize listener
    updateScale()
    window.addEventListener('resize', updateScale)
    
    // Fallback delay to handle layout shifts
    const timer = setTimeout(updateScale, 100)
    
    return () => {
      window.removeEventListener('resize', updateScale)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full aspect-[210/297] rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white group select-none">
       {/* 
         The inner content is fixed to A4 pixel dimensions (794x1123) and scaled down to fit the container.
         The origin is top-left, so it scales perfectly into the aspect-ratio constrained parent.
       */}
       <div 
         className={`absolute top-0 left-0 w-[794px] h-[1123px] origin-top-left pointer-events-none ${blur ? 'report-blur' : ''}`} 
         style={{ transform: 'scale(var(--scale, 1))' }}
       >
         {children}
       </div>
    </div>
  )
}
