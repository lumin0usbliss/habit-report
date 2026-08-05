"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { Button } from "@/components/ui/Button"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAdminAuth()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      const ok = login(password)
      if (ok) {
        router.replace("/admin")
      } else {
        setError("비밀번호가 올바르지 않습니다")
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-white/60" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">관리자 로그인</h1>
          <p className="text-white/40 text-sm">비밀번호를 입력하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError("") }}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-400/60 transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "확인 중..." : "로그인"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-white/30 text-xs hover:text-white/50 transition-colors">
            ← 테스트로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
