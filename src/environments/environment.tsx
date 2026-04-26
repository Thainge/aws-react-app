type AuthMode = 'mock' | 'cognito'
type UserRole = 'admin' | 'user'

type Environment = {
	production: boolean
	appTitle: string
	baseApiUrl: string
	auth: {
		mode: AuthMode
		mockUser: {
			email: string
			name: string
			pictureUrl: string
			role: UserRole
		}
	}
	cognito: {
		userPoolId: string
		userPoolClientId: string
	}
}

function authModeFromEnv(value: string | undefined): AuthMode {
	return value === 'cognito' ? 'cognito' : 'mock'
}

function roleFromEnv(value: string | undefined): UserRole {
	return value === 'user' ? 'user' : 'admin'
}

const mode = import.meta.env.MODE || 'development'

// Vite loads `.env`, `.env.local`, `.env.<mode>`, `.env.<mode>.local`.
// Only vars prefixed with `VITE_` are exposed to the client.
export const environment: Environment = {
	production: mode === 'prod' || mode === 'uat',
	appTitle: import.meta.env.VITE_APP_TITLE || 'AWS React App',
	baseApiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
	auth: {
		mode: authModeFromEnv(import.meta.env.VITE_AUTH_MODE),
		mockUser: {
			email: import.meta.env.VITE_MOCK_USER_EMAIL || 'admin@example.com',
			name: import.meta.env.VITE_MOCK_USER_NAME || 'Admin User',
			pictureUrl: import.meta.env.VITE_MOCK_USER_PICTURE_URL || '',
			role: roleFromEnv(import.meta.env.VITE_MOCK_USER_ROLE),
		},
	},
	cognito: {
		userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
		userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || '',
	},
}

