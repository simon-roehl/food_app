import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/react'
import ProgressBar from './ProgressBar'
import WeekStrip, { startOfWeek } from './WeekStrip'
import AddFoodModal from './addfood/AddFoodModal'
import { MACROS, MICRONUTRIENTS, isIncomplete } from '../utils/nutrients'
import { calculateDailyGoals, toDateKey } from '../utils/goals'
import { getMicronutrientGoals } from '../data/nutrientGoals'
import { api } from '../api/client'
import './Dashboard.css'

const sum = (entries, key) => entries.reduce((total, item) => total + (item.nutrients?.[key]?.value ?? 0), 0)
function datesFor(date, view) { if (view === 'daily') return [date]; const start = startOfWeek(date); return Array.from({ length: 7 }, (_, i) => { const day = new Date(start); day.setDate(start.getDate() + i); return day }) }

function Dashboard({ profile }) {
  const { getToken } = useAuth(); const [selectedDate, setSelectedDate] = useState(new Date()); const [view, setView] = useState('daily'); const [micros, setMicros] = useState(false); const [modal, setModal] = useState(false); const [logs, setLogs] = useState({}); const [error, setError] = useState(null)
  const dates = useMemo(() => datesFor(selectedDate, view), [selectedDate, view]); const keys = useMemo(() => dates.map(toDateKey), [dates])
  useEffect(() => { let cancelled = false; const missing = keys.filter((key) => !(key in logs)); if (!missing.length) return; Promise.all(missing.map((key) => api.getLog(getToken, key).then((value) => [key, value]))).then((pairs) => { if (!cancelled) setLogs((old) => ({ ...old, ...Object.fromEntries(pairs) })) }).catch(() => { if (!cancelled) setError("Couldn't load food logs.") }); return () => { cancelled = true } }, [getToken, keys, logs])
  const entries = useMemo(() => keys.flatMap((key) => logs[key] ?? []), [keys, logs])
  const goals = useMemo(() => dates.map((day) => calculateDailyGoals(profile, day)).reduce((total, goal) => ({ calories: total.calories + goal.calories, protein: total.protein + goal.protein, carbs: total.carbs + goal.carbs, fat: total.fat + goal.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 }), [dates, profile])
  const microGoals = useMemo(() => { const daily = getMicronutrientGoals(profile.sex); return view === 'daily' ? daily : Object.fromEntries(Object.entries(daily).map(([key, value]) => [key, value * 7])) }, [profile.sex, view])
  async function add(entry) { const key = toDateKey(selectedDate); const saved = await api.addLogEntry(getToken, key, entry); setLogs((old) => ({ ...old, [key]: [...(old[key] ?? []), saved] })) }
  return <main className="dashboard"><WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} workoutSplit={profile.workoutSplit} /><div className="dashboard__toggle"><button type="button" className={view === 'daily' ? 'is-active' : ''} onClick={() => setView('daily')}>Daily</button><button type="button" className={view === 'weekly' ? 'is-active' : ''} onClick={() => setView('weekly')}>Weekly</button></div><section className="dashboard__macros">{MACROS.map(({ key, label, unit }) => <ProgressBar key={key} nutrientKey={key} label={label} unit={unit} current={sum(entries, key)} goal={goals[key]} incomplete={isIncomplete(entries, key)} />)}</section><section className="dashboard__micros"><button type="button" className="dashboard__micros-toggle" aria-expanded={micros} onClick={() => setMicros(!micros)}><span>Micronutrients</span><span className="dashboard__micros-count">{MICRONUTRIENTS.length} tracked</span></button>{micros && <div className="dashboard__micros-list">{MICRONUTRIENTS.map(({ key, label, unit }) => <ProgressBar key={key} nutrientKey={key} label={label} unit={unit} current={sum(entries, key)} goal={microGoals[key]} incomplete={isIncomplete(entries, key)} />)}</div>}</section><section className="dashboard__log">{error && <p className="dashboard__empty">{error}</p>}{!error && entries.length === 0 && <p className="dashboard__empty">Nothing logged yet.</p>}{entries.map((entry) => <div key={entry.entryId} className="dashboard__log-item"><span>{entry.name}<span className="dashboard__log-serving">{entry.quantity}{entry.unit}</span></span><span>{Math.round(entry.nutrients?.calories?.value ?? 0)} kcal</span></div>)}</section><button type="button" className="dashboard__add-food" onClick={() => setModal(true)}>+ Add food</button>{modal && <AddFoodModal onClose={() => setModal(false)} onAddEntry={add} />}</main>
}
export default Dashboard
