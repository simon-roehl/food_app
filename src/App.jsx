import { useEffect, useState } from 'react'
import { Show, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/react'
import Dashboard from './components/Dashboard'
import OnboardingWizard from './components/onboarding/OnboardingWizard'
import SettingsPage from './components/settings/SettingsPage'
import { api } from './api/client'
import { mockDailyLogs } from './data/mockDashboard'
import './App.css'

function App() {
  const { isSignedIn, getToken } = useAuth()
  const [profile, setProfile] = useState(undefined)
  const [view, setView] = useState('dashboard')
  const [profileError, setProfileError] = useState(null)

  useEffect(() => {
    if (!isSignedIn) { setProfile(undefined); setProfileError(null); return }
    let cancelled = false
    setProfile(undefined); setProfileError(null)
    api.getProfile(getToken).then((savedProfile) => {
      if (!cancelled) setProfile(savedProfile)
    }).catch(() => {
      if (!cancelled) setProfileError("Couldn't load your profile. Please refresh and try again.")
    })
    return () => { cancelled = true }
  }, [isSignedIn, getToken])

  return <>
    <nav className="auth-controls" aria-label="Account">
      <span className="brand">Weekday</span>
      <div className="auth-controls__actions">
        <Show when="signed-out"><SignInButton mode="modal"><button type="button" className="auth-button secondary">Sign in</button></SignInButton><SignUpButton mode="modal"><button type="button" className="auth-button primary">Sign up</button></SignUpButton></Show>
        <Show when="signed-in">{profile && <button type="button" className="auth-button secondary" onClick={() => setView('settings')}>Settings</button>}<UserButton /></Show>
      </div>
    </nav>
    <Show when="signed-out"><section id="center"><h1>Track your nutrition, on your schedule</h1><p>Sign in to set up your goals and start logging.</p></section></Show>
    <Show when="signed-in">
      {profileError && <p className="app__loading">{profileError}</p>}
      {!profileError && profile === undefined && <p className="app__loading">Loading...</p>}
      {!profileError && profile === null && <OnboardingWizard onComplete={setProfile} />}
      {profile && view === 'dashboard' && <Dashboard profile={profile} dailyLogs={mockDailyLogs} />}
      {profile && view === 'settings' && <SettingsPage initialProfile={profile} onSaved={setProfile} onClose={() => setView('dashboard')} />}
    </Show>
  </>
}
export default App
