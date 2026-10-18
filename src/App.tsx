import { useState } from 'react'
import { useAuth } from './auth/AuthContext'
import { useHabits } from './habits/useHabits'
import { Dashboard } from './habits/Dashboard'
import { MonthView } from './habits/MonthView'
import { SettingsView } from './habits/SettingsView'
import { LogSheet } from './habits/LogSheet'

type Tab = 'dashboard' | 'month' | 'settings'

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
  const {
    habits,
    logsByDate,
    addHabit,
    setValue,
    toggleToday,
    archiveHabit,
    unarchiveHabit,
    renameHabit,
  } = useHabits(uid)
  const { signOutUser } = useAuth()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [showLog, setShowLog] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 text-zinc-100">
      <main>
        {tab === 'dashboard' && (
          <Dashboard habits={habits} logsByDate={logsByDate} onOpenLog={() => setShowLog(true)} />
        )}
        {tab === 'month' && (
          <MonthView habits={habits} logsByDate={logsByDate} onSetValue={setValue} />
        )}
        {tab === 'settings' && (
          <SettingsView
            habits={habits}
            onAdd={addHabit}
            onArchive={archiveHabit}
            onUnarchive={unarchiveHabit}
            onRename={renameHabit}
            onSignOut={signOutUser}
          />
        )}
      </main>

      {tab !== 'settings' && (
        <button
          onClick={() => setShowLog(true)}
          className="fixed bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-3xl font-medium text-zinc-950 shadow-lg"
        >
          +
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 flex border-t border-zinc-800 bg-zinc-950">
        {(
          [
            ['dashboard', 'Dashboard'],
            ['month', 'Month'],
            ['settings', 'Settings'],
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

      {showLog && (
        <LogSheet
          habits={habits}
          logsByDate={logsByDate}
          onToggle={toggleToday}
          onSetValue={setValue}
          onClose={() => setShowLog(false)}
        />
      )}
    </div>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-zinc-950" />
  }

  if (!user) {
    return <SignInScreen />
  }

  return <HabitApp uid={user.uid} />
}

export default App
