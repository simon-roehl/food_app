import { colorForPercent, widthForPercent } from '../utils/nutrients'
import './ProgressBar.css'

function ProgressBar({ nutrientKey, label, unit, current, goal, incomplete }) {
  const percent = goal > 0 ? (current / goal) * 100 : 0

  return (
    <div className="progress-bar">
      <div className="progress-bar__labels">
        <span>
          {label}
          {incomplete && <span className="progress-bar__asterisk" title="Incomplete nutrient data for one or more logged items">*</span>}
        </span>
        <span className="progress-bar__amount">{Math.round(current)}{unit} / {Math.round(goal)}{unit}</span>
      </div>
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: widthForPercent(percent), backgroundColor: colorForPercent(percent, nutrientKey) }} />
      </div>
    </div>
  )
}

export default ProgressBar
