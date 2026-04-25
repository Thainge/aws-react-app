import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

import './confirmPopup.css'

type ConfirmPopupProps = {
  open: boolean
  title: string
  onCancel: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export default function ConfirmPopup({
  open,
  title,
  onCancel,
  onConfirm,
  isLoading,
}: ConfirmPopupProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-delete-title"
      className="confirmPopupDialog"
    >
      <DialogTitle id="confirm-delete-title" className="confirmPopupTitle">
        Are you sure you want to delete {title}?
      </DialogTitle>
      <DialogContent dividers>
        <Typography>
          This will permanently delete {title}, are you sure?
        </Typography>
      </DialogContent>
      <DialogActions className="confirmPopupActions">
        <Button
          variant="contained"
          color="primary"
          onClick={onCancel}
          disabled={isLoading}
          className="confirmPopupActionButton"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isLoading}
          className="confirmPopupActionButton"
          endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
