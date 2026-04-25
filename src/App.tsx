import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import './App.css'
import Table from './components/Table'
import { ApiError } from './services/api'
import { getItems, type Item } from './services/items'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDeleteItemConfirm } from './hooks/useDeleteItemConfirm'
import { useItemPopup } from './hooks/useItemPopup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

async function loadItemsIntoState(args: {
  isMounted: () => boolean
  setItems: Dispatch<SetStateAction<Item[]>>
}) {
  const { isMounted, setItems } = args

  try {
    const itemsData = await getItems()
    if (!isMounted()) return
    setItems(itemsData)
  } catch (error) {
    if (!isMounted()) return

    const message =
      error instanceof ApiError
        ? `${error.status} ${error.statusText}: ${error.message}`
        : error instanceof Error
          ? error.message
          : 'Unknown error'

    toast.error(message)
    setItems([])
  }
}

export default function App() {
  const [items, setItems] = useState<Item[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(false)

  const { requestDelete, confirmDialog } = useDeleteItemConfirm({
    onDeleted: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
  })

  const { openAdd, openEdit, dialog: itemDialog } = useItemPopup({
    onSaved: (savedItem, mode) => {
      setItems((prev) => {
        if (mode === 'add') return [savedItem, ...prev]
        const index = prev.findIndex((i) => i.id === savedItem.id)
        if (index === -1) return prev
        const next = [...prev]
        next[index] = savedItem
        return next
      })
    },
  })

  useEffect(() => {
    let isMounted = true

    setIsLoadingItems(true)

    // void loadItemsIntoState({
    //   isMounted: () => isMounted,
    //   setItems,
    // })

    const timeoutId = window.setTimeout(() => {
      if (!isMounted) return

      setItems(
        [[...Array(5)].map((_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          date: new Date().toISOString(),
        }))].flat(),
      )
      setIsLoadingItems(false)
    }, 1000)

    return () => {
      isMounted = false
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <>
      <ToastContainer />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: '0.5em',
        }}
      >
        <h1>AWS React App - Items</h1>
        <Button variant="contained" color="success" onClick={openAdd}>
          Add Item
        </Button>
      </Box>

      <Table
        items={items}
        isLoading={isLoadingItems}
        onEdit={(id) => {
          const item = items.find((i) => i.id === id)
          if (!item) return
          openEdit(item)
        }}
        onDelete={(id) => {
          const item = items.find((i) => i.id === id)
          requestDelete({ id, title: item?.name ?? 'this item' })
        }}
      />

      {confirmDialog}
      {itemDialog}
    </>
  )
}
