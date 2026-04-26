import Box from '@mui/material/Box'

import { Outlet } from 'react-router-dom'

import HeaderNav from './HeaderNav'

export default function AppLayout() {
	return (
		<Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
			<HeaderNav />
			<Box sx={{ flex: 1 }}>
				<Outlet />
			</Box>
		</Box>
	)
}
