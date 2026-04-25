import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import ItemPopup from '../components/itemPopup'
import { ApiError } from '../services/api'
import { createItem, type Item, updateItem } from '../services/items'

type ItemDraft = {
  name: string
  date: string
}

type ItemPopupTarget =
  | { mode: 'add' }
  | { mode: 'edit'; item: Item }

type UseItemPopupArgs = {
  onSaved?: (item: Item, mode: 'add' | 'edit') => void
}

function toDateInputValue(value: Item['date'] | undefined): string {
  if (!value) return ''
  if (typeof value === 'string') {
    // handles ISO strings; safe fallback keeps first 10 chars (YYYY-MM-DD)
    return value.length >= 10 ? value.slice(0, 10) : value
  }
  return value.toISOString().slice(0, 10)
}

export function useItemPopup(args: UseItemPopupArgs = {}) {
  const { onSaved } = args

  const [target, setTarget] = useState<ItemPopupTarget | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<ItemDraft>({ name: '', date: '' })
  const [isSaving, setIsSaving] = useState(false)

  function openAdd() {
    setDraft({ name: '', date: '' })
    setTarget({ mode: 'add' })
    setIsOpen(true)
  }

  function openEdit(item: Item) {
    setDraft({ name: item.name, date: toDateInputValue(item.date) })
    setTarget({ mode: 'edit', item })
    setIsOpen(true)
  }

  function close() {
    if (isSaving) return
    setIsOpen(false)
  }

  function handleExited() {
    // Prevent “mode/title” flicker during the close transition by only
    // clearing the target once the dialog is fully unmounted.
    if (isOpen) return
    setTarget(null)
  }

  async function save() {
    if (!target) return

    setIsSaving(true)
    try {
      const payload = {
        name: draft.name,
        date: draft.date,
      }

      const saved =
        target.mode === 'add'
          ? await createItem(payload)
          : await updateItem(target.item.id, payload)

      toast.success(
        target.mode === 'add'
          ? `Added ${saved?.name ?? 'item'}`
          : `Updated ${saved?.name ?? 'item'}`,
      )
      onSaved?.(saved, target.mode)
      setIsOpen(false)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? `${error.status} ${error.statusText}: ${error.message}`
          : error instanceof Error
            ? error.message
            : 'Unknown error'

      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const dialog = useMemo(() => {
    if (!target) return null
    const maybeItemProp = target.mode === 'edit' ? { item: target.item } : {}

    return (
      <ItemPopup
        open={isOpen}
        mode={target.mode}
        {...maybeItemProp}
        draft={draft}
        onDraftChange={setDraft}
        onCancel={close}
        onSave={save}
        onExited={handleExited}
        isLoading={isSaving}
      />
    )
  }, [target, isOpen, draft, isSaving])

  return {
    openAdd,
    openEdit,
    dialog,
    isSaving,
    isOpen,
  }
}
