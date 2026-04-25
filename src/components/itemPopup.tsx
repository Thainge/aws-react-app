import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'

import type { Item } from '../services/items'

import './itemPopup.css'

type ItemDraft = {
  name: string
  date: string
}

type ItemPopupProps = {
  open: boolean
  item?: Item
  mode: 'add' | 'edit'
  draft: ItemDraft
  onDraftChange: (next: ItemDraft) => void
  onCancel: () => void
  onSave: () => void
  onExited?: () => void
  isLoading?: boolean
}

export default function ItemPopup({
  open,
  item,
  mode,
  draft,
  onDraftChange,
  onCancel,
  onSave,
  onExited,
  isLoading,
}: ItemPopupProps) {
  const dialogTitle =
    mode === 'add' ? 'Add Item' : `Edit ${item?.name ?? ''}`

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="item-popup-title"
      className="itemPopupDialog"
      slotProps={onExited ? { transition: { onExited } } : undefined}
    >
      <DialogTitle id="item-popup-title" className="itemPopupTitle">
        {dialogTitle}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} className="itemPopupFormStack">
          <TextField
            label="Name"
            value={draft.name}
            onChange={(e) => onDraftChange({ ...draft, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Date"
            type="date"
            value={draft.date}
            onChange={(e) => onDraftChange({ ...draft, date: e.target.value })}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions className="itemPopupActions">
        <Button
          variant="contained"
          color="error"
          onClick={onCancel}
          disabled={isLoading}
          className="itemPopupActionButton"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={isLoading}
          color={mode === 'add' ? 'success' : 'primary'}
          className="itemPopupActionButton"
          endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
