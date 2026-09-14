import './ProfileStatsForm.css'

const GOAL_TYPES = [{ value: 'cut', label: 'Cut' }, { value: 'maintain', label: 'Maintain' }, { value: 'bulk', label: 'Bulk' }]

function ProfileStatsForm({ profile, onChange }) {
  const update = (field, value) => onChange({ ...profile, [field]: value })
  return <div className="profile-stats-form">
    <label className="profile-stats-form__field"><span>Sex</span><select value={profile.sex} onChange={(event) => update('sex', event.target.value)}><option value="male">Male</option><option value="female">Female</option></select></label>
    <label className="profile-stats-form__field"><span>Age</span><input type="number" min="13" max="100" value={profile.age} onChange={(event) => update('age', Number(event.target.value))} /></label>
    <label className="profile-stats-form__field"><span>Height (cm)</span><input type="number" min="100" max="250" value={profile.heightCm} onChange={(event) => update('heightCm', Number(event.target.value))} /></label>
    <label className="profile-stats-form__field"><span>Weight (kg)</span><input type="number" min="30" max="300" step="0.1" value={profile.weightKg} onChange={(event) => update('weightKg', Number(event.target.value))} /></label>
    <label className="profile-stats-form__field"><span>Average daily steps</span><input type="number" min="0" max="50000" step="500" value={profile.dailySteps} onChange={(event) => update('dailySteps', Number(event.target.value))} /></label>
    <label className="profile-stats-form__field"><span>Goal</span><select value={profile.goalType} onChange={(event) => update('goalType', event.target.value)}>{GOAL_TYPES.map((goal) => <option key={goal.value} value={goal.value}>{goal.label}</option>)}</select></label>
  </div>
}

export default ProfileStatsForm
