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

export default function Table({ items, isLoading, onEdit, onDelete }: TableProps) {
  return (
    <TableContainer component={Paper} sx={{ borderTop: 1, borderColor: 'divider' }}>
      {isLoading ? <LinearProgress /> : null}
      <MuiTable className="itemsTableTable" aria-label="items Table" size="small">
        <TableHead>
          <TableRow className="itemsTableRow">
            <TableCell className="itemsTableCell itemsTableHeaderCell">ID</TableCell>
            <TableCell className="itemsTableCell itemsTableHeaderCell">Name</TableCell>
            <TableCell
              className="itemsTableCell itemsTableHeaderCell itemsTableActionsCell"
              sx={{
                boxShadow: (theme) => `inset 1px 0 0 0 ${theme.palette.divider}`,
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="itemsTableRow">
              <TableCell component="th" scope="row" className="itemsTableCell">
                {item.id}
              </TableCell>
              <TableCell className="itemsTableCell">{item.name}</TableCell>
              <TableCell
                className="itemsTableActionsCell"
                sx={{
                  p: 0,
                  boxShadow: (theme) => `inset 1px 0 0 0 ${theme.palette.divider}`,
                }}
              >
                <Box className="itemsTableActionsBox">
                  <IconButton
                    aria-label="Edit"
                    color="primary"
                    onClick={() => onEdit?.(item.id)}
                    size="small"
                    className="itemsTableIconButton"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    color="error"
                    onClick={() => onDelete?.(item.id)}
                    size="small"
                    className="itemsTableIconButton"
                    sx={{
                      boxShadow: (theme) => `inset 1px 0 0 0 ${theme.palette.divider}`,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}
