import { api, type QueryParams } from './api'

export type Item = {
	id: number
	name: string
    date: Date | string
}

export type CreateItemBody = {
	name: string
    date: Date | string
}

export type UpdateItemBody = {
	name?: string
    date?: Date | string
}

export async function getItems(options?: { params?: QueryParams }): Promise<Item[]> {
	const data = await api.get<unknown>({
		url: '/api/items',
		...(options?.params ? { params: options.params } : {}),
	})

	if (Array.isArray(data)) return data as Item[]
	if (data && typeof data === 'object') {
		const maybeItems = (data as { items?: unknown; data?: unknown }).items ??
			(data as { items?: unknown; data?: unknown }).data
		if (Array.isArray(maybeItems)) return maybeItems as Item[]
	}

	throw new Error('Unexpected response shape from GET /api/items')
}

export function createItem(body: CreateItemBody) {
	return api.post<Item, CreateItemBody>({ url: '/api/items', body })
}

export function updateItem(id: number, body: UpdateItemBody) {
	return api.put<Item, UpdateItemBody>({ url: `/api/items/${id}`, body })
}

export function deleteItem(id: number) {
	return api.del<void>({ url: `/api/items/${id}` })
}
