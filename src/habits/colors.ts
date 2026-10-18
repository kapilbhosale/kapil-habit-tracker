// A fixed, curated set of habit colors — users pick from these, never an arbitrary
// RGB value, so every pairing stays reasonably distinct at a glance.
export const HABIT_COLORS = [
  'emerald',
  'sky',
  'amber',
  'violet',
  'rose',
  'orange',
  'cyan',
  'pink',
  'blue',
  'lime',
] as const

export type HabitColor = (typeof HABIT_COLORS)[number]

export const DEFAULT_HABIT_COLOR: HabitColor = 'emerald'

type ColorClasses = {
  text: string
  border: string
  ring: string
  dot: string
  bgSoft: string // low-opacity wash, e.g. for "done" card background
  bgSolid: string // full-strength fill, e.g. for a filled checkmark/cell
  onSolid: string // text/icon color to use on top of bgSolid
  // Density ramp for heatmaps, darkest (empty) to brightest (full), 5 steps.
  ramp: [string, string, string, string, string]
}

const CLASSES: Record<HabitColor, ColorClasses> = {
  emerald: {
    text: 'text-emerald-400',
    border: 'border-emerald-500',
    ring: 'ring-emerald-400',
    dot: 'bg-emerald-400',
    bgSoft: 'bg-emerald-500/10',
    bgSolid: 'bg-emerald-500',
    onSolid: 'text-zinc-950',
    ramp: ['bg-zinc-900', 'bg-emerald-950', 'bg-emerald-800', 'bg-emerald-600', 'bg-emerald-400'],
  },
  sky: {
    text: 'text-sky-400',
    border: 'border-sky-500',
    ring: 'ring-sky-400',
    dot: 'bg-sky-400',
    bgSoft: 'bg-sky-500/10',
    bgSolid: 'bg-sky-500',
    onSolid: 'text-zinc-950',
    ramp: ['bg-zinc-900', 'bg-sky-950', 'bg-sky-800', 'bg-sky-600', 'bg-sky-400'],
  },
  amber: {
    text: 'text-amber-400',
    border: 'border-amber-500',
    ring: 'ring-amber-400',
    dot: 'bg-amber-400',
    bgSoft: 'bg-amber-500/10',
    bgSolid: 'bg-amber-500',
    onSolid: 'text-zinc-950',
    ramp: ['bg-zinc-900', 'bg-amber-950', 'bg-amber-800', 'bg-amber-600', 'bg-amber-400'],
  },
  violet: {
    text: 'text-violet-400',
    border: 'border-violet-500',
    ring: 'ring-violet-400',
    dot: 'bg-violet-400',
    bgSoft: 'bg-violet-500/10',
    bgSolid: 'bg-violet-500',
    onSolid: 'text-zinc-950',
    ramp: ['bg-zinc-900', 'bg-violet-950', 'bg-violet-800', 'bg-violet-600', 'bg-violet-400'],
  },
  rose: {
    text: 'text-rose-400',
    border: 'border-rose-500',
    ring: 'ring-rose-400',
    dot: 'bg-rose-400',
    bgSoft: 'bg-rose-500/10',
    bgSolid: 'bg-rose-500',
    onSolid: 'text-zinc-950',
    ramp: ['bg-zinc-900', 'bg-rose-950', 'bg-rose-800', 'bg-rose-600', 'bg-rose-400'],
  },
  orange: {
    text: 'text-orange-400',
    border: 'border-orange-500',
    ring: 'ring-orange-400',
    dot: 'bg-orange-400',
    bgSoft: 'bg-orange-500/10',
    bgSolid: 'bg-orange-500',
    onSolid: 'text-zinc-950',
    ramp: ['bg-zinc-900', 'bg-orange-950', 'bg-orange-800', 'bg-orange-600', 'bg-orange-400'],
  },
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-500',
    ring: 'ring-cyan-400',
    dot: 'bg-cyan-400',
    bgSoft: 'bg-cyan-500/10',
    bgSolid: 'bg-cyan-500',
    onSolid: 'text-zinc-950',
    ramp: ['bg-zinc-900', 'bg-cyan-950', 'bg-cyan-800', 'bg-cyan-600', 'bg-cyan-400'],
  },
  pink: {
    text: 'text-pink-400',
    border: 'border-pink-500',
    ring: 'ring-pink-400',
    dot: 'bg-pink-400',
    bgSoft: 'bg-pink-500/10',
    bgSolid: 'bg-pink-500',
    onSolid: 'text-zinc-950',
    ramp: ['bg-zinc-900', 'bg-pink-950', 'bg-pink-800', 'bg-pink-600', 'bg-pink-400'],
  },
  blue: {
    text: 'text-blue-400',
    border: 'border-blue-500',
    ring: 'ring-blue-400',
    dot: 'bg-blue-400',
    bgSoft: 'bg-blue-500/10',
    bgSolid: 'bg-blue-500',
    onSolid: 'text-zinc-950',
    ramp: ['bg-zinc-900', 'bg-blue-950', 'bg-blue-800', 'bg-blue-600', 'bg-blue-400'],
  },
  lime: {
    text: 'text-lime-400',
    border: 'border-lime-500',
    ring: 'ring-lime-400',
    dot: 'bg-lime-400',
    bgSoft: 'bg-lime-500/10',
    bgSolid: 'bg-lime-500',
    onSolid: 'text-zinc-950',
    ramp: ['bg-zinc-900', 'bg-lime-950', 'bg-lime-800', 'bg-lime-600', 'bg-lime-400'],
  },
}

// Deterministic suggestion so the same habit name always lands on the same color
// (and different names tend to spread across the palette) — a nice colorful
// default without the user having to think about it.
export function suggestColorForName(name: string): HabitColor {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  const index = Math.abs(hash) % HABIT_COLORS.length
  return HABIT_COLORS[index]
}

export function colorClasses(color: HabitColor | undefined): ColorClasses {
  return CLASSES[color ?? DEFAULT_HABIT_COLOR]
}

// rate: 0..1 -> one of the 5 ramp steps (0 = empty/no data).
export function densityClass(color: HabitColor | undefined, rate: number): string {
  const ramp = colorClasses(color).ramp
  if (rate <= 0) return ramp[0]
  if (rate < 0.25) return ramp[1]
  if (rate < 0.5) return ramp[2]
  if (rate < 0.75) return ramp[3]
  return ramp[4]
}
