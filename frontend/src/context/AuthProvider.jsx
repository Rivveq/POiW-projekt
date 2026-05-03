import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/api'

const USER_KEY = 'casino.user'
const AGE_KEY = 'casino.ageConfirmed'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem(USER_KEY)
        return raw ? JSON.parse(raw) : null
    })
    const [ageConfirmed, setAgeConfirmed] = useState(
        () => localStorage.getItem(AGE_KEY) === 'true'
    )

    useEffect(() => {
        if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
        else localStorage.removeItem(USER_KEY)
    }, [user])

    const login = async (credentials) => {
        const { token, user: loggedUser } = await authService.login(credentials)
        tokenStorage.set(token)
        setUser(loggedUser)
        return loggedUser
    }

    const register = async (credentials) => {
        await authService.register(credentials)
        return login(credentials)
    }

    const logout = () => {
        tokenStorage.clear()
        setUser(null)
    }

    const confirmAge = () => {
        localStorage.setItem(AGE_KEY, 'true')
        setAgeConfirmed(true)
    }

    return (
        <AuthContext.Provider
            value={{ user, ageConfirmed, login, register, logout, confirmAge }}
        >
            {children}
        </AuthContext.Provider>
    )
}
