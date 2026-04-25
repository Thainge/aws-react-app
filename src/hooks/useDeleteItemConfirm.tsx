import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import ConfirmPopup from '../components/confirmPopup'
import { ApiError } from '../services/api'
import { deleteItem } from '../services/items'

type DeleteTarget = {
  id: number
  title: string
}

type UseDeleteItemConfirmArgs = {
  onDeleted?: (id: number) => void
}

export function useDeleteItemConfirm(args: UseDeleteItemConfirmArgs = {}) {
  const { onDeleted } = args

  const [target, setTarget] = useState<DeleteTarget | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function requestDelete(targetInput: DeleteTarget) {
    setTarget(targetInput)
  }

  function cancelDelete() {
    if (isDeleting) return
    setTarget(null)
  }

  async function confirmDelete() {
    if (!target) return

    setIsDeleting(true)
    try {
      await deleteItem(target.id)
      onDeleted?.(target.id)
      setTarget(null)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? `${error.status} ${error.statusText}: ${error.message}`
          : error instanceof Error
            ? error.message
            : 'Unknown error'

      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmDialog = useMemo(
    () => (
      <ConfirmPopup
        open={target !== null}
        title={target?.title ?? ''}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    ),
    [target, isDeleting],
  )

  return {
    requestDelete,
    confirmDialog,
    isDeleting,
    isOpen: target !== null,
  }
}
