import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
	confirmSignUp,
	fetchAuthSession,
	fetchUserAttributes,
	getCurrentUser,
	signIn,
	signOut,
	signUp,
	type SignUpInput,
} from 'aws-amplify/auth'

import { environment } from '../environments/environment'
import { isCognitoConfigured } from './configureAmplify'

export type UserRole = 'admin' | 'user'

export type AuthUser = {
	email: string
	name?: string
	pictureUrl?: string
	role: UserRole
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type AuthContextValue = {
	status: AuthStatus
	isAuthenticated: boolean
	user: AuthUser | null
	refresh: () => Promise<void>
	logout: () => Promise<void>
	login: (args: { email: string; password: string }) => Promise<void>
	signup: (args: { email: string; password: string; name?: string }) => Promise<void>
	confirmSignup: (args: { email: string; code: string }) => Promise<void>
	needsCognitoConfig: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isMockMode(): boolean {
	return environment.auth?.mode !== 'cognito'
}

function getMockUser(): AuthUser {
	const mock = environment.auth?.mockUser
	return {
		email: mock?.email || 'admin@example.com',
		name: mock?.name || 'Admin User',
		pictureUrl: mock?.pictureUrl || undefined,
		role: mock?.role === 'user' ? 'user' : 'admin',
	}
}

function roleFromGroups(groups: unknown): UserRole {
	if (Array.isArray(groups) && groups.includes('admin')) return 'admin'
	return 'user'
}

async function loadCurrentUser(): Promise<AuthUser | null> {
	if (isMockMode()) return getMockUser()
	if (!isCognitoConfigured()) return null

	try {
		await getCurrentUser()
	} catch {
		return null
	}

	const [attributes, session] = await Promise.all([
		fetchUserAttributes(),
		fetchAuthSession(),
	])

	const email = attributes.email
	if (!email) return null

	const name = attributes.name ?? attributes.given_name
	const pictureUrl = attributes.picture
	const groups = session.tokens?.idToken?.payload?.['cognito:groups']

	return {
		email,
		name,
		pictureUrl,
		role: roleFromGroups(groups),
	}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [status, setStatus] = useState<AuthStatus>('loading')
	const [user, setUser] = useState<AuthUser | null>(null)

	const refresh = useCallback(async () => {
		setStatus('loading')
		const loaded = await loadCurrentUser()
		setUser(loaded)
		setStatus(loaded ? 'authenticated' : 'unauthenticated')
	}, [])

	useEffect(() => {
		void refresh()
	}, [refresh])

	const logout = useCallback(async () => {
		if (isMockMode()) {
			// Keep the app usable without any auth/IAM setup.
			setUser(getMockUser())
			setStatus('authenticated')
			return
		}
		if (!isCognitoConfigured()) {
			setUser(null)
			setStatus('unauthenticated')
			return
		}
		await signOut()
		await refresh()
	}, [refresh])

	const login = useCallback(
		async ({ email, password }: { email: string; password: string }) => {
			if (isMockMode()) {
				setUser({ ...getMockUser(), email: email.trim() || getMockUser().email })
				setStatus('authenticated')
				return
			}
			if (!isCognitoConfigured()) throw new Error('Cognito is not configured')
			await signIn({ username: email, password })
			await refresh()
		},
		[refresh],
	)

	const signup = useCallback(
		async ({ email, password, name }: { email: string; password: string; name?: string }) => {
			if (isMockMode()) return
			if (!isCognitoConfigured()) throw new Error('Cognito is not configured')
			const input: SignUpInput = {
				username: email,
				password,
				options: {
					userAttributes: {
						email,
						...(name ? { name } : {}),
					},
				},
			}
			await signUp(input)
		},
		[],
	)

	const confirmSignup = useCallback(async ({ email, code }: { email: string; code: string }) => {
		if (isMockMode()) return
		if (!isCognitoConfigured()) throw new Error('Cognito is not configured')
		await confirmSignUp({ username: email, confirmationCode: code })
	}, [])

	const value = useMemo<AuthContextValue>(
		() => ({
			status,
			isAuthenticated: status === 'authenticated',
			user,
			refresh,
			logout,
			login,
			signup,
			confirmSignup,
			needsCognitoConfig: !isMockMode() && !isCognitoConfigured(),
		}),
		[confirmSignup, login, logout, refresh, signup, status, user],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
