const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const TOKEN_KEY = 'casino.token'

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
    constructor(status, body) {
        super(body?.message || body?.error || `HTTP ${status}`)
        this.status = status
        this.body = body
    }
}

export async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' }
    if (auth) {
        const token = tokenStorage.get()
        if (token) headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    })

    const text = await res.text()
    const data = text ? JSON.parse(text) : null

    if (!res.ok) throw new ApiError(res.status, data)
    return data
}
