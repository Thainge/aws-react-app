export const environment = {
    production: true,
    appTitle: import.meta.env.VITE_APP_TITLE || 'AWS React App',
    baseApiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    auth: {
        mode: (import.meta.env.VITE_AUTH_MODE || 'mock') as 'mock' | 'cognito',
        mockUser: {
            email: import.meta.env.VITE_MOCK_USER_EMAIL || 'admin@example.com',
            name: import.meta.env.VITE_MOCK_USER_NAME || 'Admin User',
            pictureUrl: import.meta.env.VITE_MOCK_USER_PICTURE_URL || '',
            role: (import.meta.env.VITE_MOCK_USER_ROLE || 'admin') as 'admin' | 'user',
        },
    },
    cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
        userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || '',
    },
}