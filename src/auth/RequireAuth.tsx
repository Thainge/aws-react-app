import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from './AuthContext'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
	const { status } = useAuth()
	const location = useLocation()

	if (status === 'loading') {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
				<CircularProgress />
			</Box>
		)
	}

	if (status !== 'authenticated') {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />
	}

	return children
}
