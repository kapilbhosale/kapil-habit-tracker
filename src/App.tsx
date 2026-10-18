import { useState } from 'react'
import { useAuth } from './auth/AuthContext'
import { useHabits } from './habits/useHabits'
import { AddHabitModal } from './habits/AddHabitModal'
import { TodayView } from './habits/TodayView'
import { MonthGrid } from './habits/MonthGrid'
import { InsightsView } from './habits/InsightsView'

type Tab = 'today' | 'month' | 'insights'

function SignInScreen() {
  const { signIn } = useAuth()
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
      <button
        onClick={signIn}
        className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-zinc-950 hover:bg-emerald-400"
      >
        Sign in with Google
      </button>
    </div>
  )
}

function HabitApp({ uid }: { uid: string }) {
  const { habits, logsByDate, addHabit, setValue, toggleToday, archiveHabit } = useHabits(uid)
  const [tab, setTab] = useState<Tab>('today')
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950 pb-16 text-zinc-100">
      <main>
        {tab === 'today' && (
          <TodayView
            habits={habits}
            logsByDate={logsByDate}
            onToggle={toggleToday}
            onSetValue={setValue}
            onArchive={archiveHabit}
          />
        )}
        {tab === 'month' && (
          <MonthGrid habits={habits} logsByDate={logsByDate} onSetValue={setValue} />
        )}
        {tab === 'insights' && <InsightsView habits={habits} logsByDate={logsByDate} />}
      </main>

      {tab === 'today' && (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-20 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl font-medium text-zinc-950 shadow-lg"
        >
          +
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 flex border-t border-zinc-800 bg-zinc-950">
        {(
          [
            ['today', 'Today'],
            ['month', 'Month'],
            ['insights', 'Insights'],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-3 text-sm font-medium ${
              tab === key ? 'text-emerald-400' : 'text-zinc-500'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {showAdd && <AddHabitModal onAdd={addHabit} onClose={() => setShowAdd(false)} />}
    </div>
  )
}

function App() {
  const { user, loading, signOutUser } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-zinc-950" />
  }

  if (!user) {
    return <SignInScreen />
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h1 className="text-lg font-semibold">Habits</h1>
        <button onClick={signOutUser} className="text-sm text-zinc-400 hover:text-zinc-200">
          Sign out
        </button>
      </header>
      <HabitApp uid={user.uid} />
    </div>
  )
}

export default App
