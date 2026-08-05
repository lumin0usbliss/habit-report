'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-neutral-900">문제가 발생했습니다</h1>
      <p className="mt-2 text-neutral-600">
        {error.message || '알 수 없는 오류가 발생했습니다.'}
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-600"
      >
        다시 시도
      </button>
    </div>
  )
}
