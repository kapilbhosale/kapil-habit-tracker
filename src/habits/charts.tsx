// Lightweight inline-SVG chart primitives — no charting library, keeps the PWA bundle small.
import { githubGreenHex } from './colors'

// Fixed, small categorical set — each stat always maps to the same hue, never generated/cycled.
const STAT_COLORS = {
  emerald: 'text-emerald-400',
  sky: 'text-sky-400',
  amber: 'text-amber-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
  cyan: 'text-cyan-400',
} as const

export function StatTile({
  value,
  total,
  label,
  color,
}: {
  value: string
  total?: string // rendered muted, e.g. "/8" after the value
  label: string
  color: keyof typeof STAT_COLORS
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center">
      <div className="text-xl font-semibold">
        <span className={STAT_COLORS[color]}>{value}</span>
        {total && <span className="text-sm font-normal text-zinc-600">/{total}</span>}
      </div>
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
        const rate = d.max > 0 ? d.value / d.max : 0
        const h = d.max > 0 ? Math.max(2, rate * height) : 2
        const x = i * (barWidth + gap)
        const isMax = d.value === d.max && d.max > 0
        return (
          <g key={i}>
            <rect x={x} y={height - h} width={barWidth} height={h} rx={4} style={{ fill: githubGreenHex(rate) }} />
            <text
              x={x + barWidth / 2}
              y={height - h - 6}
              textAnchor="middle"
              className={isMax ? 'fill-zinc-300 text-[9px]' : 'fill-zinc-600 text-[9px]'}
            >
              {d.value}
            </text>
            <text x={x + barWidth / 2} y={height + 14} textAnchor="middle" className="fill-zinc-500 text-[9px]">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// Catmull-Rom -> cubic Bezier: a smooth curve that still passes through every point.
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }
  return d
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

  const points = data.map((d, i) => ({ x: x(i), y: y(d.value) }))
  const linePath = smoothPath(points)
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
