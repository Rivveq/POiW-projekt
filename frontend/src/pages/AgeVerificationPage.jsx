import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell/AppShell'
import { useAuth } from '../hooks/useAuth'
import './AgeVerificationPage.css'

export function AgeVerificationPage() {
    const navigate = useNavigate()
    const { confirmAge } = useAuth()

    const handleConfirm = () => {
        confirmAge()
        navigate('/login')
    }

    return (
        <AppShell>
            <div className="view-container glassmorphism slide-in-top">
                <h2 className="neon-title">V-Casino Access</h2>
                <div className="warning-box">
                    <p>Hazard wiąże się z ryzykiem. Musisz mieć ukończone 18 lat, aby zagrać.</p>
                    <p className="age-notice">Access restricted to adults only.</p>
                </div>
                <button className="btn-primary neon-btn" onClick={handleConfirm}>
                    Confirm Identity & Enter Lounge
                </button>
            </div>
        </AppShell>
    )
}
