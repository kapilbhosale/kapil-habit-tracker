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

export function MonthLineChart({
  data,
  max,
}: {
  data: { label: string; value: number }[] // oldest first, one point per elapsed day
  max: number
}) {
  const width = 300
  const height = 64
  const padTop = 10
  const padBottom = 16
  const plotHeight = height - padTop - padBottom
  const n = data.length

  const x = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * width)
  const y = (v: number) => padTop + plotHeight - (max > 0 ? (v / max) * plotHeight : 0)

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)},${y(d.value)}`).join(' ')
  const areaPath = `${linePath} L ${x(n - 1)},${padTop + plotHeight} L ${x(0)},${padTop + plotHeight} Z`

  const last = data[n - 1]

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {/* recessive baseline */}
      <line x1={0} y1={padTop + plotHeight} x2={width} y2={padTop + plotHeight} className="stroke-zinc-800" strokeWidth={1} />
      {n > 1 && (
        <>
          <path d={areaPath} className="fill-emerald-400/10" />
          <path d={linePath} fill="none" className="stroke-emerald-400" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        </>
      )}
      {last && (
        <>
          <circle cx={x(n - 1)} cy={y(last.value)} r={4} className="fill-emerald-400 stroke-zinc-950" strokeWidth={2} />
          <text x={x(n - 1)} y={y(last.value) - 8} textAnchor="end" className="fill-zinc-300 text-[9px]">
            {last.value}
          </text>
        </>
      )}
      <text x={0} y={height - 2} className="fill-zinc-600 text-[9px]">
        {data[0]?.label}
      </text>
      <text x={width} y={height - 2} textAnchor="end" className="fill-zinc-600 text-[9px]">
        {last?.label}
      </text>
    </svg>
  )
}
