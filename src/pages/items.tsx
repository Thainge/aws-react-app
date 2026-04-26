import { useEffect, useRef } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import Table from '../components/Table'
import { useDeleteItemConfirm } from '../hooks/useDeleteItemConfirm'
import { useItemPopup } from '../hooks/useItemPopup'
import { ApiError } from '../services/api'
import { getItems, type Item } from '../services/items'
import { toast } from 'react-toastify'
import { useAuth } from '../auth/AuthContext'

export default function ItemsPage() {
	const { user } = useAuth()
	const canEditAndDelete = user?.role === 'admin'
	const queryClient = useQueryClient()
	const lastErrorKeyRef = useRef<string | null>(null)

	const {
		data: items = [],
		isPending: isLoadingItems,
		error,
	} = useQuery({
		queryKey: ['items'],
		queryFn: ({ signal }) => getItems({ signal }),
	})

	useEffect(() => {
		if (!error) return

		const message =
			error instanceof ApiError
				? `${error.status} ${error.statusText}: ${error.message}`
				: error instanceof Error
					? error.message
					: 'Unknown error'

		// Avoid repeating the same toast on re-render/refetch
		if (lastErrorKeyRef.current === message) return
		lastErrorKeyRef.current = message

		toast.error(message)
	}, [error])

	const { requestDelete, confirmDialog } = useDeleteItemConfirm({
		onDeleted: (id) => {
			void queryClient.invalidateQueries({ queryKey: ['items'] })
		},
	})

	const { openAdd, openEdit, dialog: itemDialog } = useItemPopup({
		onSaved: (savedItem, mode) => {
			void queryClient.invalidateQueries({ queryKey: ['items'] })
		},
	})

	return (
		<>
			<Box
				sx={{
					flex: 1,
					minHeight: 'calc(100vh - 64px)',
					p: 2,
					background: (theme) =>
						`linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[200]} 55%, ${theme.palette.grey[100]} 100%)`,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						px: '0.5em',
						mb: 1,
					}}
				>
					<h1>Items</h1>
					<Button variant="contained" color="success" onClick={openAdd}>
						Add Item
					</Button>
				</Box>

				<Table
					items={items}
					isLoading={isLoadingItems}
					{...(canEditAndDelete
						? {
							onEdit: (id: number) => {
								const item = items.find((i) => i.id === id)
								if (!item) return
								openEdit(item)
							},
							onDelete: (id: number) => {
								const item = items.find((i) => i.id === id)
								requestDelete({ id, title: item?.name ?? 'this item' })
							},
						}
						: {})}
				/>
			</Box>

			{confirmDialog}
			{itemDialog}
		</>
	)
}
