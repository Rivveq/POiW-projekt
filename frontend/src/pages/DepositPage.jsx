import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell/AppShell'
import { useGameState } from '../hooks/useGameState'
import './DepositPage.css'

export function DepositPage() {
    const navigate = useNavigate()
    const { balance, topUp } = useGameState()

    const [amount, setAmount] = useState('')
    const [bank, setBank] = useState('V-Bank')
    const [cardNumber, setCardNumber] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsProcessing(true)

        setTimeout(() => {
            topUp(Number(amount)) // Zwiększa stan konta w naszym kontekście
            setSuccessMsg(`Pomyślnie zdeponowano $${amount} z ${bank}!`)
            setIsProcessing(false)
            setAmount('')
            setCardNumber('')

            setTimeout(() => {
                navigate('/lobby')
            }, 2000)
        }, 1500)
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
                            <span className="balance-label">Numer Karty / Rachunku</span>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="1234-5678-9012-3456"
                                required
                                minLength={16}
                                maxLength={19}
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
                            {isProcessing ? 'Przetwarzanie płatności...' : '💸 Potwierdź Wpłatę'}
                        </button>
                    </form>
                )}

                <button
                    className="btn-secondary neon-btn-outline mt-3"
                    onClick={() => navigate('/lobby')}
                    disabled={isProcessing}
                >
                    🔙 Powrót do Lobby
                </button>
            </div>
        </AppShell>
    )
}