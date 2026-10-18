// Lightweight inline-SVG chart primitives — no charting library, keeps the PWA bundle small.

// Fixed, small categorical set — each stat always maps to the same hue, never generated/cycled.
const STAT_COLORS = {
  emerald: 'text-emerald-400',
  sky: 'text-sky-400',
  amber: 'text-amber-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
} as const

export function StatTile({
  value,
  label,
  color,
}: {
  value: string
  label: string
  color: keyof typeof STAT_COLORS
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center">
      <div className={`text-xl font-semibold ${STAT_COLORS[color]}`}>{value}</div>
      <div className="mt-1 text-[11px] leading-tight text-zinc-500">{label}</div>
    </div>
  )
}

export function RingMeter({
  value,
  size = 128,
  stroke = 12,
  label,
  sublabel,
}: {
  value: number // 0..1
  size?: number
  stroke?: number
  label: string
  sublabel?: string
}) {
  const r = (size - stroke) / 2
  const c = size / 2
  const circumference = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(1, value))
  const dash = circumference * clamped

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={c} cy={c} r={r} stroke="currentColor" strokeWidth={stroke} fill="none" className="text-zinc-800" />
        <circle
          cx={c}
          cy={c}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className="text-emerald-400 transition-[stroke-dasharray] duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-semibold text-zinc-50">{label}</span>
        {sublabel && <span className="text-xs text-zinc-500">{sublabel}</span>}
      </div>
    </div>
  )
}

export function WeekBars({ data }: { data: { label: string; value: number; max: number }[] }) {
  const barWidth = 20
  const gap = 10
  const height = 56
  const width = data.length * (barWidth + gap)

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height + 20}`} className="overflow-visible">
      {data.map((d, i) => {
        const h = d.max > 0 ? Math.max(2, (d.value / d.max) * height) : 2
        const x = i * (barWidth + gap)
        const isMax = d.value === d.max && d.max > 0
        return (
          <g key={i}>
            <rect
              x={x}
              y={height - h}
              width={barWidth}
              height={h}
              rx={4}
              className={isMax ? 'fill-emerald-400' : 'fill-zinc-700'}
            />
            {isMax && (
              <text x={x + barWidth / 2} y={height - h - 6} textAnchor="middle" className="fill-zinc-400 text-[9px]">
                {d.value}
              </text>
            )}
            <text x={x + barWidth / 2} y={height + 14} textAnchor="middle" className="fill-zinc-500 text-[9px]">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function heatColor(rate: number): string {
  if (rate <= 0) return 'bg-zinc-900'
  if (rate < 0.25) return 'bg-emerald-950'
  if (rate < 0.5) return 'bg-emerald-800'
  if (rate < 0.75) return 'bg-emerald-600'
  return 'bg-emerald-400'
}

export function RecentHeatmap({
  dates,
  rateByDate,
  todayKey,
}: {
  dates: string[] // oldest first
  rateByDate: (date: string) => number
  todayKey: string
}) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {dates.map((date) => (
        <div
          key={date}
          title={date}
          className={`aspect-square w-full rounded-md ${heatColor(rateByDate(date))} ${
            date === todayKey ? 'ring-1 ring-zinc-400' : ''
          }`}
        />
      ))}
    </div>
  )
}
