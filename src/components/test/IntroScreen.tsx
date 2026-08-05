"use client"

/**
 * IntroScreen — entry point for the test.
 *
 * DESIGN NOTE: This file ships with minimal neutral styling on purpose.
 * The designer replaces the layout, colors, typography, and motion based
 * on the project's mood (see .harness/agents/designer.md).
 *
 * What MUST stay:
 *  - name is required, phone is optional
 *  - name/phone are stored in sessionStorage before routing to /test
 *  - onStart(name, phone) callback signature
 *  - testConfig.title / subtitle / description / questionCount are read from data
 */

import { useState } from "react"
import { testConfig } from "@/data/config"

interface IntroScreenProps {
  onStart: (name: string, phone: string) => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("이름을 입력해주세요")
      return
    }
    onStart(name.trim(), phone.trim())
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
        {testConfig.title}
      </h1>

      <p className="text-lg text-neutral-700 mb-2">{testConfig.subtitle}</p>

      <p className="text-sm text-neutral-500 mb-8 max-w-sm">
        {testConfig.description}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <div>
          <input
            type="text"
            placeholder="이름 (필수)"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError("")
            }}
            className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors"
          />
          {error && (
            <p className="text-red-600 text-sm mt-1 text-left">{error}</p>
          )}
        </div>

        <input
          type="tel"
          placeholder="연락처 (선택)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors"
        />

        <button
          type="submit"
          className="w-full px-5 py-3 rounded-md bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
        >
          테스트 시작하기
        </button>
      </form>

      <p className="text-xs text-neutral-400 mt-6">
        약 5분 소요 · 총 {testConfig.questionCount}문항
      </p>
    </div>
  )
}
