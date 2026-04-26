/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE?: string
	readonly VITE_API_URL?: string
	readonly VITE_AUTH_MODE?: 'mock' | 'cognito'
	readonly VITE_MOCK_USER_EMAIL?: string
	readonly VITE_MOCK_USER_NAME?: string
	readonly VITE_MOCK_USER_PICTURE_URL?: string
	readonly VITE_MOCK_USER_ROLE?: 'admin' | 'user'
	readonly VITE_COGNITO_USER_POOL_ID?: string
	readonly VITE_COGNITO_USER_POOL_CLIENT_ID?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
