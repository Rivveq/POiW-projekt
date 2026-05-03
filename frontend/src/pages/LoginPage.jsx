import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell/AppShell'
import { useAuth } from '../hooks/useAuth'
import './LoginPage.css'

export function LoginPage() {
    const { user, ageConfirmed, login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    if (!ageConfirmed) return <Navigate to="/" replace />
    if (user) return <Navigate to="/lobby" replace />

    const from = location.state?.from?.pathname || '/lobby'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await login({ username, password })
            navigate(from, { replace: true })
        } catch (err) {
            setError(
                err.status === 401
                    ? 'Niepoprawna nazwa użytkownika lub hasło.'
                    : err.message || 'Nie udało się zalogować.'
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AppShell>
            <div className="view-container glassmorphism slide-in-top">
                <h2 className="neon-title">Sign In</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-field">
                        <span className="balance-label">Username</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            required
                            minLength={4}
                            maxLength={20}
                        />
                    </label>
                    <label className="auth-field">
                        <span className="balance-label">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            minLength={8}
                        />
                    </label>

                    {error && <p className="auth-error">{error}</p>}

                    <button
                        type="submit"
                        className="btn-primary neon-btn"
                        disabled={submitting}
                    >
                        {submitting ? 'Signing in…' : 'Enter Lounge'}
                    </button>
                </form>

                <p className="auth-switch">
                    No account yet?{' '}
                    <Link to="/register" className="auth-link">
                        Create one
                    </Link>
                </p>
            </div>
        </AppShell>
    )
}
