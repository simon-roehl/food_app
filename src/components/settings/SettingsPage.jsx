import { useState } from 'react'
import { useAuth } from '@clerk/react'
import ProfileStatsForm from '../profile/ProfileStatsForm'
import WorkoutSplitEditor from '../profile/WorkoutSplitEditor'
import { api } from '../../api/client'
import './SettingsPage.css'

function SettingsPage({ initialProfile, onClose, onSaved }) {
  const { getToken } = useAuth()
  const [profile, setProfile] = useState(initialProfile)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  async function save() {
    setSaving(true); setError(null)
    try { const saved = await api.saveProfile(getToken, profile); onSaved(saved); onClose() }
    catch { setError("Couldn't save your changes. Try again.") }
    finally { setSaving(false) }
  }
  return <main className="settings"><div className="settings__header"><h1>Settings</h1><button type="button" className="settings__close" onClick={onClose}>Done</button></div><section className="settings__section"><h2>About you</h2><ProfileStatsForm profile={profile} onChange={setProfile} /></section><section className="settings__section"><h2>Workout split</h2><WorkoutSplitEditor workoutSplit={profile.workoutSplit} onChange={(workoutSplit) => setProfile({ ...profile, workoutSplit })} /></section>{error && <p className="settings__error">{error}</p>}<button type="button" className="settings__save" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button></main>
}
export default SettingsPage
