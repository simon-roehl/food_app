import './WorkoutSplitEditor.css'

function WorkoutSplitEditor({ workoutSplit, onChange }) {
  function setCycleLength(length) {
    const days = Array.from({ length }, (_, index) => workoutSplit.days[index] ?? { type: 'Rest', calorieBonus: 0 })
    onChange({ ...workoutSplit, cycleLengthDays: length, days })
  }
  function updateDay(index, field, value) {
    onChange({ ...workoutSplit, days: workoutSplit.days.map((day, current) => current === index ? { ...day, [field]: value } : day) })
  }
  return <div className="workout-split-editor">
    <label className="workout-split-editor__cycle"><span>Cycle length (days)</span><input type="number" min="1" max="14" value={workoutSplit.cycleLengthDays} onChange={(event) => setCycleLength(Math.min(14, Math.max(1, Number(event.target.value))))} /></label>
    <div className="workout-split-editor__days">{workoutSplit.days.map((day, index) => <div key={index} className="workout-split-editor__day"><span className="workout-split-editor__day-label">Day {index + 1}</span><input type="text" maxLength="40" placeholder="e.g. Push, Rest" value={day.type} onChange={(event) => updateDay(index, 'type', event.target.value)} /><label className="workout-split-editor__bonus"><input type="number" min="0" max="2000" step="50" value={day.calorieBonus} onChange={(event) => updateDay(index, 'calorieBonus', Number(event.target.value))} /><span>kcal bonus</span></label></div>)}</div>
  </div>
}

export default WorkoutSplitEditor
