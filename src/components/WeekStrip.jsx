import { splitDayForDate } from '../utils/goals'
import './WeekStrip.css'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfWeek(date) {
  const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  return weekStart
}

function WeekStrip({ selectedDate, onSelectDate, workoutSplit }) {
  const weekStart = startOfWeek(selectedDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="week-strip">
      {Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + index)
        const isSelected = date.toDateString() === selectedDate.toDateString()
        const isToday = date.toDateString() === today.toDateString()
        const splitDay = splitDayForDate(workoutSplit, date)

        return <button key={date.getTime()} type="button" className={`week-strip__day${isSelected ? ' is-selected' : ''}`} onClick={() => onSelectDate(date)}>
          <span className="week-strip__weekday">{DAY_LABELS[date.getDay()]}</span>
          <span className={`week-strip__date${isToday ? ' is-today' : ''}`}>{date.getDate()}</span>
          <span className="week-strip__split">{splitDay.type}</span>
        </button>
      })}
    </div>
  )
}

export { startOfWeek }
export default WeekStrip
