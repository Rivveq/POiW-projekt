import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell/AppShell'
import { useAuth } from '../hooks/useAuth'
import './RegisterPage.css'

export function RegisterPage() {
    const { user, ageConfirmed, register } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    if (!ageConfirmed) return <Navigate to="/" replace />
    if (user) return <Navigate to="/lobby" replace />

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await register({ username, password })
            navigate('/lobby', { replace: true })
        } catch (err) {
            if (err.status === 409) setError('Taka nazwa użytkownika jest już zajęta.')
            else if (err.status === 400)
                setError('Sprawdź dane: login 4-20 znaków, hasło min. 8 znaków.')
            else setError(err.message || 'Nie udało się zarejestrować.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AppShell>
            <div className="view-container glassmorphism slide-in-top">
                <h2 className="neon-title">Create Account</h2>
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
                            autoComplete="new-password"
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
                        {submitting ? 'Creating…' : 'Join the Lounge'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </p>
            </div>
        </AppShell>
    )
}
