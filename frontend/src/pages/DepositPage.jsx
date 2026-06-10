import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell/AppShell'
import { useGameState } from '../hooks/useGameState'
import { apiFetch } from '../services/api'
import './DepositPage.css'

const PRESET_CARDS = [
    { id: 'custom', label: 'Użyj nowej karty...', value: '' },
    { id: 'card1', label: 'Visa Gold Corporate (•••• 4321)', value: '4321-5678-9012-4321' },
    { id: 'card2', label: 'Mastercard Platinum (•••• 8888)', value: '5412-7512-3412-8888' }
]

export function DepositPage() {
    const navigate = useNavigate()
    const { balance, setBalance } = useGameState()

    const [amount, setAmount] = useState('')
    const [bank, setBank] = useState('V-Bank')
    const [selectedCard, setSelectedCard] = useState('custom')
    const [cardNumber, setCardNumber] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleCardSelect = (e) => {
        const cardId = e.target.value
        setSelectedCard(cardId)
        const found = PRESET_CARDS.find(c => c.id === cardId)
        if (found) {
            setCardNumber(found.value)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProcessing(true)
        setErrorMsg('')

        try {
            const response = await apiFetch('/api/wallet/deposit', {
                method: 'POST',
                body: { amount: Number(amount) }
            })

            if (response && response.balance !== undefined) {
                if (setBalance) setBalance(response.balance)
            }

            setSuccessMsg(`Pomyślnie zdeponowano $${amount} z ${bank}!`)
            setAmount('')
            setCardNumber('')

            setTimeout(() => {
                navigate('/lobby')
            }, 2000)

        } catch (err) {
            console.error('Błąd depozytu:', err)
            setErrorMsg('Wystąpił błąd podczas komunikacji z serwerem. Wpłata odrzucona.')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <AppShell>
            <div className="view-container glassmorphism slide-in-top">
                <h2 className="neon-title">Deposit Funds</h2>

                <div className="wallet-panel glassmorphism-dark mini-wallet">
                    <p className="balance-label">Current Balance:</p>
                    <strong className="balance-amount neon-green mini">
                        ${balance.toFixed(2)}
                    </strong>
                </div>

                {errorMsg && (
                    <div className="text-red-500 font-bold mb-4 text-center">
                        {errorMsg}
                    </div>
                )}

                {successMsg ? (
                    <div className="deposit-success fade-in">{successMsg}</div>
                ) : (
                    <form className="deposit-form fade-in" onSubmit={handleSubmit}>
                        <label className="deposit-field">
                            <span className="balance-label">Wybierz Bank</span>
                            <select
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                                required
                            >
                                <option value="V-Bank">V-Bank (Błyskawicznie)</option>
                                <option value="Neon Finance">Neon Finance</option>
                                <option value="Cyber Trust Bank">Cyber Trust Bank</option>
                            </select>
                        </label>

                        <label className="deposit-field">
                            <span className="balance-label">Szybki Wybór Metody Płatności</span>
                            <select
                                value={selectedCard}
                                onChange={handleCardSelect}
                            >
                                {PRESET_CARDS.map(card => (
                                    <option key={card.id} value={card.id}>{card.label}</option>
                                ))}
                            </select>
                        </label>

                        <label className="deposit-field">
                            <span className="balance-label">Numer Karty / Rachunku</span>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="1234-5678-9012-3456"
                                required
                                minLength={16}
                                maxLength={19}
                                disabled={selectedCard !== 'custom'}
                            />
                        </label>

                        <label className="deposit-field">
                            <span className="balance-label">Kwota wpłaty ($)</span>
                            <input
                                type="number"
                                min="10"
                                max="10000"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Minimalnie $10.00"
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            className="btn-success neon-green-btn mt-3"
                            disabled={isProcessing}
                            style={{ padding: '18px', fontSize: '1.2rem' }}
                        >
                            {isProcessing ? 'Przetwarzanie płatności...' : 'Potwierdź Wpłatę'}
                        </button>
                    </form>
                )}

                <button
                    className="btn-secondary neon-btn-outline mt-3"
                    onClick={() => navigate('/lobby')}
                    disabled={isProcessing}
                >
                    Powrót do Lobby
                </button>
            </div>
        </AppShell>
    )
}