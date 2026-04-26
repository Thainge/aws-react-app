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

type UpdateItemRequestBody = UpdateItemBody & { id: number }

export async function getItems(options?: { params?: QueryParams; signal?: AbortSignal }): Promise<Item[]> {
	const data = await api.get<unknown>({
		url: '/items',
		...(options?.params ? { params: options.params } : {}),
		...(options?.signal ? { signal: options.signal } : {}),
	})

	if (Array.isArray(data)) return data as Item[]
	if (data && typeof data === 'object') {
		const maybeItems = (data as { items?: unknown; data?: unknown }).items ??
			(data as { items?: unknown; data?: unknown }).data
		if (Array.isArray(maybeItems)) return maybeItems as Item[]
	}

	throw new Error('Unexpected response shape from GET /items')
}

export function createItem(body: CreateItemBody) {
	return api.post<Item, CreateItemBody>({ url: '/items', body })
}

export function updateItem(id: number, body: UpdateItemBody) {
	const requestBody: UpdateItemRequestBody = { id, ...body }
	return api.put<Item, UpdateItemRequestBody>({ url: `/items/${id}`, body: requestBody })
}

export function deleteItem(id: number) {
	return api.del<void>({ url: `/items/${id}` })
}
