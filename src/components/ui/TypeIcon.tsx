"use client"

import {
  Scale, Heart, Trophy, Waves, Compass, Shield, Sparkles, Flame, Cloud,
  type LucideProps,
} from "lucide-react"
import type { ComponentType } from "react"

const iconMap: Record<string, ComponentType<LucideProps>> = {
  Scale, Heart, Trophy, Waves, Compass, Shield, Sparkles, Flame, Cloud,
}

interface TypeIconProps extends LucideProps {
  name: string
}

export function TypeIcon({ name, ...props }: TypeIconProps) {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon {...props} />
}
