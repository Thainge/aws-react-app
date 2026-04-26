import { Amplify } from 'aws-amplify'

import { environment } from '../environments/environment'

export function isCognitoConfigured(): boolean {
	return Boolean(
		environment.cognito?.userPoolId && environment.cognito?.userPoolClientId,
	)
}

export function configureAmplify(): void {
	if (!isCognitoConfigured()) return

	Amplify.configure({
		Auth: {
			Cognito: {
				userPoolId: environment.cognito.userPoolId,
				userPoolClientId: environment.cognito.userPoolClientId,
				loginWith: {
					email: true,
				},
			},
		},
	})
}
