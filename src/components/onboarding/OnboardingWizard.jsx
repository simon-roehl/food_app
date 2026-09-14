import { useState } from 'react'
import { useAuth } from '@clerk/react'
import ProfileStatsForm from '../profile/ProfileStatsForm'
import WorkoutSplitEditor from '../profile/WorkoutSplitEditor'
import { emptyProfile } from '../../data/emptyProfile'
import { api } from '../../api/client'
import './OnboardingWizard.css'

function OnboardingWizard({ onComplete }) {
  const { getToken } = useAuth()
  const [profile, setProfile] = useState(emptyProfile())
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  async function finish() {
    setSaving(true); setError(null)
    try { onComplete(await api.saveProfile(getToken, profile)) }
    catch { setError("Couldn't save your profile. Try again.") }
    finally { setSaving(false) }
  }
  return <main className="onboarding">
    <div className="onboarding__progress"><span className={step === 1 ? 'is-active' : ''}>1. About you</span><span className={step === 2 ? 'is-active' : ''}>2. Workout split</span></div>
    {step === 1 && <><h1>Let&apos;s set up your goals</h1><p className="onboarding__subtitle">This drives your calorie and macro targets — you can change it anytime in Settings.</p><ProfileStatsForm profile={profile} onChange={setProfile} /><button type="button" className="onboarding__next" onClick={() => setStep(2)}>Next</button></>}
    {step === 2 && <><h1>Your workout split</h1><p className="onboarding__subtitle">Set a repeating cycle. Its calorie bonuses stay fixed after setup.</p><WorkoutSplitEditor workoutSplit={profile.workoutSplit} onChange={(workoutSplit) => setProfile({ ...profile, workoutSplit })} />{error && <p className="onboarding__error">{error}</p>}<div className="onboarding__actions"><button type="button" className="onboarding__back" onClick={() => setStep(1)}>Back</button><button type="button" className="onboarding__next" onClick={finish} disabled={saving}>{saving ? 'Saving...' : 'Finish setup'}</button></div></>}
  </main>
}
export default OnboardingWizard
