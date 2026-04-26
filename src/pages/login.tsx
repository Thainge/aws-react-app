import { useMemo, useState } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'

type Mode = 'login' | 'signup' | 'confirm'

export default function LoginPage() {
	const navigate = useNavigate()
	const location = useLocation()
	const { login, signup, confirmSignup, needsCognitoConfig } = useAuth()

	const redirectTo = useMemo(() => {
		const state = location.state as { from?: string } | null
		return state?.from || '/'
	}, [location.state])

	const [mode, setMode] = useState<Mode>('login')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [confirmationCode, setConfirmationCode] = useState('')

	async function handleSubmit() {
		setError(null)
		setIsSubmitting(true)
		try {
			if (mode === 'login') {
				await login({ email, password })
				navigate(redirectTo, { replace: true })
				return
			}

			if (mode === 'signup') {
				await signup({ email, password, name: name.trim() || undefined })
				setMode('confirm')
				return
			}

			await confirmSignup({ email, code: confirmationCode })
			setMode('login')
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Unknown error')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Box
			sx={{
				flex: 1,
				minHeight: 'calc(100vh - 64px)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				p: 3,
				background: (theme) =>
					`linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[200]} 55%, ${theme.palette.grey[100]} 100%)`,
			}}
		>
			<Paper
				elevation={0}
				sx={{
					p: 4,
					maxWidth: 520,
					width: '100%',
					border: 1,
					borderColor: 'divider',
					boxShadow: 3,
					backgroundColor: 'background.paper',
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}
			>
				<Typography variant="h5">
					{mode === 'login' ? 'Log In' : mode === 'signup' ? 'Sign Up' : 'Confirm Sign Up'}
				</Typography>

				{needsCognitoConfig ? (
					<Alert severity="warning">
						Cognito is not configured. If you want real auth, set `VITE_AUTH_MODE=cognito` and
						configure `VITE_COGNITO_USER_POOL_ID` + `VITE_COGNITO_USER_POOL_CLIENT_ID`.
					</Alert>
				) : null}

				{error ? <Alert severity="error">{error}</Alert> : null}

				{mode === 'signup' ? (
					<TextField
						label="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isSubmitting}
						fullWidth
					/>
				) : null}

				<TextField
					label="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isSubmitting}
					fullWidth
					autoComplete="email"
				/>

				{mode === 'confirm' ? (
					<TextField
						label="Confirmation Code"
						value={confirmationCode}
						onChange={(e) => setConfirmationCode(e.target.value)}
						disabled={isSubmitting}
						fullWidth
						autoComplete="one-time-code"
					/>
				) : (
					<TextField
						label="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={isSubmitting}
						fullWidth
						autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
					/>
				)}

				<Button
					variant="contained"
					onClick={() => void handleSubmit()}
					disabled={isSubmitting || needsCognitoConfig || !email.trim()}
				>
					{mode === 'login' ? 'Log In' : mode === 'signup' ? 'Create Account' : 'Confirm'}
				</Button>

				{mode === 'login' ? (
					<Button
						variant="text"
						onClick={() => setMode('signup')}
						disabled={isSubmitting}
						sx={{ textTransform: 'none' }}
					>
						Need an account? Sign up
					</Button>
				) : null}

				{mode === 'signup' ? (
					<Button
						variant="text"
						onClick={() => setMode('login')}
						disabled={isSubmitting}
						sx={{ textTransform: 'none' }}
					>
						Already have an account? Log in
					</Button>
				) : null}

				{mode === 'confirm' ? (
					<Button
						variant="text"
						onClick={() => setMode('login')}
						disabled={isSubmitting}
						sx={{ textTransform: 'none' }}
					>
						Back to Log In
					</Button>
				) : null}
			</Paper>
		</Box>
	)
}
