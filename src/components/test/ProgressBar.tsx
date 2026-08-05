"use client"

/**
 * ProgressBar — shows test progress.
 *
 * DESIGN NOTE: Neutral styling. Designer replaces height, color,
 * animation, and label treatment per project mood.
 */

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-neutral-600 font-medium">
          {current + 1} / {total}
        </span>
        <span className="text-sm text-neutral-600 font-medium">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-neutral-900 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
