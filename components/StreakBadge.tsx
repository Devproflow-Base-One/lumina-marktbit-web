'use client'

/**
 * StreakBadge — "Login 7 days = badge + priority"
 * Tracks daily dashboard visits, shows streak counter
 */

import { useState, useEffect } from 'react'
import { Flame, Trophy } from 'lucide-react'

const STREAK_KEY = 'marktbit_streak'
const STREAK_DATE_KEY = 'marktbit_streak_date'
const STREAK_MAX_KEY = 'marktbit_streak_max'

function todayStr(): string {
  return new Date().toDateString()
}

function yesterdayStr(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toDateString()
}

function loadStreak(): { current: number; max: number } {
  if (typeof window === 'undefined') return { current: 0, max: 0 }

  const lastDate = localStorage.getItem(STREAK_DATE_KEY)
  const current = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10)
  const max = parseInt(localStorage.getItem(STREAK_MAX_KEY) || '0', 10)

  if (lastDate === todayStr()) {
    return { current, max }
  }

  if (lastDate === yesterdayStr()) {
    const newStreak = current + 1
    const newMax = Math.max(max, newStreak)
    localStorage.setItem(STREAK_KEY, newStreak.toString())
    localStorage.setItem(STREAK_DATE_KEY, todayStr())
    localStorage.setItem(STREAK_MAX_KEY, newMax.toString())
    return { current: newStreak, max: newMax }
  }

  localStorage.setItem(STREAK_KEY, '1')
  localStorage.setItem(STREAK_DATE_KEY, todayStr())
  localStorage.setItem(STREAK_MAX_KEY, Math.max(max, 1).toString())
  return { current: 1, max: Math.max(max, 1) }
}

export function StreakBadge() {
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  useEffect(() => {
    const { current, max } = loadStreak()
    setStreak(current)
    setMaxStreak(max)
  }, [])

  if (streak === 0) return null

  const isWeekStreak = streak >= 7
  const isMonthStreak = streak >= 30

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        isMonthStreak
          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
          : isWeekStreak
          ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
          : 'bg-muted text-muted-foreground border-border'
      }`}
      title={`Current streak: ${streak} days | Best: ${maxStreak} days`}
    >
      <Flame
        className={`h-5 w-5 ${isWeekStreak ? 'text-yellow-500 animate-pulse' : ''}`}
      />
      <span>{streak} day streak</span>
      {isMonthStreak && <Trophy className="h-4 w-4 text-yellow-500" />}
      {isWeekStreak && !isMonthStreak && (
        <span className="text-yellow-500/70 hidden sm:inline text-sm">+ priority</span>
      )}
    </div>
  )
}
