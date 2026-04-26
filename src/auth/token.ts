import { fetchAuthSession } from 'aws-amplify/auth'

import { isCognitoConfigured } from './configureAmplify'

export async function getAccessToken(): Promise<string | null> {
	if (!isCognitoConfigured()) return null

	try {
		const session = await fetchAuthSession()
		return session.tokens?.accessToken?.toString() ?? null
	} catch {
		return null
	}
}
