import { useMemo, useState } from 'react'
import ProgressBar from './ProgressBar'
import WeekStrip, { startOfWeek } from './WeekStrip'
import { MACROS, MICRONUTRIENTS, isIncomplete } from '../utils/nutrients'
import { calculateDailyGoals, toDateKey } from '../utils/goals'
import { getMicronutrientGoals } from '../data/nutrientGoals'
import './Dashboard.css'

function sumNutrient(entries, key) {
  return entries.reduce((total, entry) => total + (entry.nutrients?.[key]?.value ?? 0), 0)
}

function weekDates(selectedDate) {
  const weekStart = startOfWeek(selectedDate)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + index)
    return date
  })
}

function Dashboard({ profile, dailyLogs }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('daily')
  const [showMicros, setShowMicros] = useState(false)
  const dates = useMemo(() => (view === 'daily' ? [selectedDate] : weekDates(selectedDate)), [selectedDate, view])
  const entries = useMemo(() => dates.flatMap((date) => dailyLogs[toDateKey(date)] ?? []), [dailyLogs, dates])
  const goals = useMemo(() => dates.map((date) => calculateDailyGoals(profile, date)).reduce((total, daily) => ({ calories: total.calories + daily.calories, protein: total.protein + daily.protein, carbs: total.carbs + daily.carbs, fat: total.fat + daily.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 }), [dates, profile])
  const microGoals = useMemo(() => {
    const dailyGoals = getMicronutrientGoals(profile.sex)
    if (view === 'daily') return dailyGoals
    return Object.fromEntries(Object.entries(dailyGoals).map(([key, goal]) => [key, goal * 7]))
  }, [profile.sex, view])

  return (
    <main className="dashboard">
      <WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} workoutSplit={profile.workoutSplit} />
      <div className="dashboard__toggle" aria-label="Dashboard time range">
        <button type="button" className={view === 'daily' ? 'is-active' : ''} onClick={() => setView('daily')}>Daily</button>
        <button type="button" className={view === 'weekly' ? 'is-active' : ''} onClick={() => setView('weekly')}>Weekly</button>
      </div>
      <section className="dashboard__macros" aria-label="Macronutrients">
        {MACROS.map(({ key, label, unit }) => <ProgressBar key={key} nutrientKey={key} label={label} unit={unit} current={sumNutrient(entries, key)} goal={goals[key]} incomplete={isIncomplete(entries, key)} />)}
      </section>
      <section className="dashboard__micros">
        <button type="button" className="dashboard__micros-toggle" aria-expanded={showMicros} onClick={() => setShowMicros((visible) => !visible)}><span>Micronutrients</span><span className="dashboard__micros-count">{MICRONUTRIENTS.length} tracked</span></button>
        {showMicros && <div className="dashboard__micros-list">{MICRONUTRIENTS.map(({ key, label, unit }) => <ProgressBar key={key} nutrientKey={key} label={label} unit={unit} current={sumNutrient(entries, key)} goal={microGoals[key]} incomplete={isIncomplete(entries, key)} />)}</div>}
      </section>
      <section className="dashboard__log" aria-label="Food log">
        {entries.length === 0 ? <p className="dashboard__empty">Nothing logged yet.</p> : entries.map((entry) => <div key={entry.entryId} className="dashboard__log-item"><span>{entry.name}<span className="dashboard__log-serving">{entry.quantity}{entry.unit}</span></span><span>{Math.round(entry.nutrients?.calories?.value ?? 0)} kcal</span></div>)}
      </section>
      <button type="button" className="dashboard__add-food">+ Add food</button>
    </main>
  )
}

export default Dashboard
