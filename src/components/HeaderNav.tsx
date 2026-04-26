import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { environment } from '../environments/environment'

export default function HeaderNav() { 
	const navigate = useNavigate()
	const { status, user } = useAuth()

	const isAuthed = status === 'authenticated' && user
	const initials = (user?.name?.trim()?.[0] || user?.email?.trim()?.[0] || '?').toUpperCase()

	return (
		<AppBar position="sticky" color="primary" elevation={0}>
			<Toolbar sx={{ display: 'flex', gap: 2 }}>
				<Typography
					variant="h6"
					component="div"
					sx={{ pl: '1em', whiteSpace: 'nowrap' }}
				>
					{environment.appTitle}
				</Typography>

				<Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
					<Button
						component={NavLink}
						to="/"
						color="inherit"
						sx={{ textTransform: 'none' }}
					>
						Home
					</Button>
					<Button
						component={NavLink}
						to="/items"
						color="inherit"
						sx={{ textTransform: 'none' }}
					>
						Items
					</Button>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 240 }}>
					{isAuthed ? (
						<>
							<Avatar
								src={user.pictureUrl}
								alt={user.name ?? user.email}
								sx={{ width: 36, height: 36 }}
							>
								{initials}
							</Avatar>
							<Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
								<Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
									{user.name ?? 'User'}
								</Typography>
								<Typography variant="caption" sx={{ opacity: 0.9 }} noWrap>
									{user.email}
								</Typography>
							</Box>
						</>
					) : (
						<Button
							variant="contained"
							color="secondary"
							onClick={() => navigate('/login')}
							sx={{ ml: 'auto' }}
						>
							Log In
						</Button>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	)
}
