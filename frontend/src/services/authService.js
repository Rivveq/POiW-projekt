import { apiFetch } from './api'

export const authService = {
    login: ({ username, password }) =>
        apiFetch('/api/auth/login', {
            method: 'POST',
            body: { username, password },
            auth: false,
        }),

    register: ({ username, password }) =>
        apiFetch('/api/auth/register', {
            method: 'POST',
            body: { username, password },
            auth: false,
        }),

    me: () => apiFetch('/api/users/me'),
}
