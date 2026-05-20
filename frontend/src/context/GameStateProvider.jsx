import { useState, useEffect, useCallback } from 'react'
import { GameStateContext } from './GameStateContext'
import { apiFetch } from '../services/api' // Wykorzystujemy Twój pomocnik API

export function GameStateProvider({ children }) {
    const [balance, setBalance] = useState(0) // Startujemy od 0, stan faktyczny pobierzemy z bazy
    const [xp, setXp] = useState(0)
    const [dailyClaimed, setDailyClaimed] = useState(false)
    const [loading, setLoading] = useState(true)

    const level = Math.floor(xp / 50) + 1
    const rank =
        level >= 10 ? '👑 VIP MEMBER' : level >= 5 ? '🌟 HIGH ROLLER' : '🌱 BEGINNER'

    // Funkcja pobierająca aktualny stan portfela z bazu danych
    const syncBalance = useCallback(async () => {
        try {
            const data = await apiFetch('/api/wallet/balance')
            if (data && typeof data.balance === 'number') {
                setBalance(data.balance)
            }
        } catch (err) {
            console.error("Błąd podczas pobierania balansu z backendu:", err)
        } finally {
            setLoading(false)
        }
    }, [])

    // Pobranie balansu automatycznie przy wejściu do aplikacji
    useEffect(() => {
        syncBalance()
    }, [syncBalance])

    // Zmiana topUp na funkcję asynchroniczną modyfikującą bazę danych
    const topUp = async (amount) => {
        try {
            const data = await apiFetch('/api/wallet/deposit', {
                method: 'POST',
                body: { amount }
            })
            // Serwis zwraca zaktualizowany WalletResponse z nowym balansem
            if (data && typeof data.balance === 'number') {
                setBalance(data.balance)
            } else {
                await syncBalance() // Fallback awaryjny
            }
        } catch (err) {
            console.error("Błąd podczas dokonywania depozytu:", err)
        }
    }

    const claimDaily = async () => {
        if (dailyClaimed) return
        // Korzystamy z nowego topUp, żeby zapisać darmowe środki w bazie danych
        await topUp(500)
        setDailyClaimed(true)
    }

    const placeBet = (amount, xpReward) => {
        if (balance < amount) return false
        // Odejmujemy kwotę lokalnie w pamięci na czas kręcenia bębnów (efekt wizualny)
        setBalance((b) => b - amount)
        setXp((x) => x + xpReward)
        return true
    }

    const reset = () => {
        setBalance(0)
        setXp(0)
        setDailyClaimed(false)
        syncBalance()
    }

    return (
        <GameStateContext.Provider
            value={{
                balance,
                xp,
                level,
                rank,
                dailyClaimed,
                loading,
                topUp,
                syncBalance, // Udostępniamy funkcję ręcznej synchronizacji w razie potrzeby
                claimDaily,
                placeBet,
                reset,
            }}
        >
            {children}
        </GameStateContext.Provider>
    )
}