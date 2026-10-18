import { useAuth } from './AuthContext'
import { RingMeter, MonthLineChart } from '../habits/charts'
import { colorClasses, type HabitColor } from '../habits/colors'

const DEMO_LINE = [2, 2, 3, 2, 4, 5, 4, 6, 5, 7, 6, 8, 7].map((value, i) => ({
  label: `${i}`,
  value,
}))

const DEMO_HEATMAP: HabitColor[] = [
  'emerald', 'emerald', 'sky', 'emerald', 'amber', 'emerald', 'violet',
  'sky', 'emerald', 'rose', 'emerald', 'emerald', 'sky', 'emerald',
]

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35.2 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C40.4 36.6 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  )
}

export function SignInScreen() {
  const { signIn } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-2xl">
            🔥
          </div>
          <h1 className="text-2xl font-semibold text-zinc-50">Habits</h1>
          <p className="mt-1 text-sm text-zinc-500">Build habits that stick, one day at a time.</p>
        </div>

        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex justify-center">
            <RingMeter value={0.75} size={104} label="6/8" sublabel="today" />
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1.5">
            {DEMO_HEATMAP.map((color, i) => (
              <div key={i} className={`aspect-square rounded-[3px] ${colorClasses(color).dot}`} />
            ))}
          </div>

          <div className="mt-5 border-t border-zinc-800 pt-4">
            <MonthLineChart data={DEMO_LINE} max={8} />
          </div>
        </div>

        <button
          onClick={signIn}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 font-medium text-zinc-900 shadow-lg transition hover:bg-zinc-100"
        >
          <GoogleLogo />
          Continue with Google
        </button>

        <p className="mt-4 text-center text-xs text-zinc-600">
          Private to your account — only you can see your data.
        </p>

        <blockquote className="mt-8 border-t border-zinc-900 pt-6 text-center">
          <p className="text-sm italic text-zinc-500">
            "You do not rise to the level of your goals. You fall to the level of your systems."
          </p>
          <footer className="mt-2 text-xs text-zinc-600">— James Clear, Atomic Habits</footer>
        </blockquote>
      </div>
    </div>
  )
}
