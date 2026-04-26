import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'

export default function HomePage() {
	const navigate = useNavigate()
	const { status, user } = useAuth()

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
				}}
			>
				<Typography variant="h4" sx={{ mb: 1 }}>
					Welcome
				</Typography>

				{status === 'authenticated' && user ? (
					<>
						<Typography variant="body1" sx={{ mb: 2 }}>
							Signed in as:
						</Typography>
						<Typography variant="body2" sx={{ fontWeight: 700 }}>
							{user.name ?? 'User'}
						</Typography>
						<Typography variant="body2" sx={{ mb: 2 }}>
							{user.email}
						</Typography>
						<Typography variant="caption">Role: {user.role}</Typography>
					</>
				) : (
					<>
						<Typography variant="body1" sx={{ mb: 2 }}>
							You are not logged in.
						</Typography>
						<Button variant="contained" onClick={() => navigate('/login')}>
							Log In
						</Button>
					</>
				)}
			</Paper>
		</Box>
	)
}
