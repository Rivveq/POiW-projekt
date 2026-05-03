import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }) {
    const { user, ageConfirmed } = useAuth()
    const location = useLocation()

    if (!ageConfirmed) {
        return <Navigate to="/" replace />
    }
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children
}
