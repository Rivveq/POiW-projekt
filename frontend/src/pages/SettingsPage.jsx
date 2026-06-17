import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell/AppShell'
import { useAuth } from '../hooks/useAuth'
import './SettingsPage.css'

export function SettingsPage() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <AppShell>
            <div className="view-container glassmorphism slide-in-top">
                <h2 className="neon-title">Lounge Settings</h2>
                <div className="settings-options-luxe">
                    <label className="toggle-switch-luxe">
                        <input type="checkbox" defaultChecked />
                        <span className="slider round"></span>
                        <span className="toggle-label">Ambient Sound</span>
                    </label>
                    <label className="toggle-switch-luxe">
                        <input type="checkbox" defaultChecked />
                        <span className="slider round"></span>
                        <span className="toggle-label">Win Notifications</span>
                    </label>
                </div>

                <button
                    className="btn-primary danger neon-red-btn"
                    onClick={handleLogout}
                >
                    🚪 Log Out & Reset Account
                </button>
                <button
                    className="btn-secondary neon-btn-outline mt-3"
                    onClick={() => navigate('/lobby')}
                >
                    🔙 Return
                </button>
            </div>
        </AppShell>
    )
}
