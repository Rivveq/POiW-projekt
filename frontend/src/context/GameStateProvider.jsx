import { useState } from 'react'
import { GameStateContext } from './GameStateContext'

export function GameStateProvider({ children }) {
    const [balance, setBalance] = useState(1000)
    const [xp, setXp] = useState(0)
    const [dailyClaimed, setDailyClaimed] = useState(false)

    const level = Math.floor(xp / 50) + 1
    const rank =
        level >= 10 ? '👑 VIP MEMBER' : level >= 5 ? '🌟 HIGH ROLLER' : '🌱 BEGINNER'

    const topUp = (amount) => setBalance((b) => b + amount)
    const claimDaily = () => {
        if (dailyClaimed) return
        setBalance((b) => b + 500)
        setDailyClaimed(true)
    }
    const placeBet = (amount, xpReward) => {
        if (balance < amount) return false
        setBalance((b) => b - amount)
        setXp((x) => x + xpReward)
        return true
    }
    const reset = () => {
        setBalance(1000)
        setXp(0)
        setDailyClaimed(false)
    }

    return (
        <GameStateContext.Provider
            value={{
                balance,
                xp,
                level,
                rank,
                dailyClaimed,
                topUp,
                claimDaily,
                placeBet,
                reset,
            }}
        >
            {children}
        </GameStateContext.Provider>
    )
}
