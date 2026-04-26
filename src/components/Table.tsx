import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Item } from '../services/items'

import './Table.css'

type TableProps = {
  items: Item[]
  isLoading?: boolean
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

function formatItemDate(value: Item['date'] | undefined): string {
	if (!value) return ''
	const pad2 = (n: number) => String(n).padStart(2, '0')
	if (typeof value === 'string') {
		// If we get YYYY-MM-DD (or ISO with time), format without timezone shifts.
		const head = value.length >= 10 ? value.slice(0, 10) : value
		if (/^\d{4}-\d{2}-\d{2}$/.test(head)) {
			const [yyyy, mm, dd] = head.split('-')
			return `${mm}/${dd}/${yyyy}`
		}

		// Fallback: try parsing any other date-like string.
		const parsed = new Date(value)
		if (!Number.isNaN(parsed.getTime())) {
			const mm = pad2(parsed.getMonth() + 1)
			const dd = pad2(parsed.getDate())
			const yyyy = String(parsed.getFullYear())
			return `${mm}/${dd}/${yyyy}`
		}

		return value
	}
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) return ''
		const mm = pad2(value.getMonth() + 1)
		const dd = pad2(value.getDate())
		const yyyy = String(value.getFullYear())
		return `${mm}/${dd}/${yyyy}`
	}
	return String(value)
}

export default function Table({ items, isLoading, onEdit, onDelete }: TableProps) {
	const showActions = Boolean(onEdit || onDelete)

  return (
    <TableContainer
			component={Paper}
			sx={{ borderTop: 1, borderColor: 'divider', boxShadow: 3 }}
		>
      {isLoading ? <LinearProgress /> : null}
      <MuiTable className="itemsTableTable" aria-label="items Table" size="small">
        <TableHead>
          <TableRow className="itemsTableRow">
            <TableCell className="itemsTableCell itemsTableHeaderCell">ID</TableCell>
            <TableCell className="itemsTableCell itemsTableHeaderCell">Name</TableCell>
            <TableCell className="itemsTableCell itemsTableHeaderCell">Date</TableCell>
				{showActions ? (
					<TableCell
						className="itemsTableCell itemsTableHeaderCell itemsTableActionsCell"
						sx={{
							boxShadow: (theme) => `inset 1px 0 0 0 ${theme.palette.divider}`,
						}}
					>
						Actions
					</TableCell>
				) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="itemsTableRow">
              <TableCell component="th" scope="row" className="itemsTableCell">
                {item.id}
              </TableCell>
			  <TableCell className="itemsTableCell">{item.name}</TableCell>
			  <TableCell className="itemsTableCell">{formatItemDate(item.date)}</TableCell>
				{showActions ? (
					<TableCell
						className="itemsTableActionsCell"
						sx={{
							p: 0,
							boxShadow: (theme) => `inset 1px 0 0 0 ${theme.palette.divider}`,
						}}
					>
						<Box className="itemsTableActionsBox">
							{onEdit ? (
								<IconButton
									aria-label="Edit"
									color="primary"
									onClick={() => onEdit(item.id)}
									size="small"
									className="itemsTableIconButton"
								>
									<EditIcon fontSize="small" />
								</IconButton>
							) : null}
							{onDelete ? (
								<IconButton
									aria-label="Delete"
									color="error"
									onClick={() => onDelete(item.id)}
									size="small"
									className="itemsTableIconButton"
									sx={{
										boxShadow: (theme) => `inset 1px 0 0 0 ${theme.palette.divider}`,
									}}
								>
									<DeleteIcon fontSize="small" />
								</IconButton>
							) : null}
						</Box>
					</TableCell>
				) : null}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}
