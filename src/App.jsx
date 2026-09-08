import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/react'
import Dashboard from './components/Dashboard'
import { mockDailyLogs, mockProfile } from './data/mockDashboard'
import './App.css'

function App() {
  return (
    <>
      <nav className="auth-controls" aria-label="Account">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button type="button" className="auth-button secondary">Sign in</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button type="button" className="auth-button primary">Sign up</button>
          </SignUpButton>
        </Show>
        <Show when="signed-in"><UserButton /></Show>
      </nav>
      <Dashboard profile={mockProfile} dailyLogs={mockDailyLogs} />
    </>
  )
}

export default App
