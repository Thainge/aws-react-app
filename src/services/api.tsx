import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'

import { getAccessToken } from '../auth/token'
import { environment } from '../environments/environment'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type QueryParams = Record<
	string,
	| string
	| number
	| boolean
	| null
	| undefined
	| Array<string | number | boolean>
>

export type ApiRequestOptions<TBody = unknown> = {
	url: string
	baseUrl?: string
	params?: QueryParams
	body?: TBody
	headers?: HeadersInit
	signal?: AbortSignal
	credentials?: RequestCredentials
}

export class ApiError extends Error {
	readonly name = 'ApiError'
	readonly status: number
	readonly statusText: string
	readonly url: string
	readonly method: HttpMethod
	readonly data?: unknown

	constructor(args: {
		message: string
		status: number
		statusText: string
		url: string
		method: HttpMethod
		data?: unknown
	}) {
		super(args.message)
		this.status = args.status
		this.statusText = args.statusText
		this.url = args.url
		this.method = args.method
		this.data = args.data
	}
}

type ApiClientOptions = {
	baseUrl?: string
	defaultHeaders?: HeadersInit
	axiosInstance?: AxiosInstance
}

function joinUrl(base: string, path: string): string {
	if (!base) return path
	if (path.startsWith('http')) return path

	const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base
	const trimmedPath = path.startsWith('/') ? path.slice(1) : path
	return `${trimmedBase}/${trimmedPath}`
}

function normalizeHeaders(...headerSets: Array<HeadersInit | undefined>): Record<string, string> {
	const headers = new Headers()
	for (const headerSet of headerSets) {
		if (!headerSet) continue
		new Headers(headerSet).forEach((value, key) => headers.set(key, value))
	}
	const result: Record<string, string> = {}
	headers.forEach((value, key) => {
		result[key] = value
	})
	return result
}

function serializeParams(params: QueryParams): string {
	const search = new URLSearchParams()
	for (const [key, rawValue] of Object.entries(params)) {
		if (rawValue === undefined || rawValue === null) continue
		if (Array.isArray(rawValue)) {
			for (const entry of rawValue) search.append(key, String(entry))
		} else {
			search.set(key, String(rawValue))
		}
	}
	return search.toString()
}

export function createApiClient(options: ApiClientOptions = {}) {
	const baseUrl = options.baseUrl ?? ''
	const defaultHeaders = options.defaultHeaders
	const instance =
		options.axiosInstance ??
		axios.create({
			...(baseUrl ? { baseURL: baseUrl } : {}),
			...(defaultHeaders ? { headers: normalizeHeaders(defaultHeaders) } : {}),
		})

	async function request<TResponse, TBody = unknown>(
		method: HttpMethod,
		requestOptions: ApiRequestOptions<TBody>,
	): Promise<TResponse> {
		const finalUrl = joinUrl(requestOptions.baseUrl ?? baseUrl, requestOptions.url)
		const headers = normalizeHeaders(defaultHeaders, requestOptions.headers)

		const config: AxiosRequestConfig = { url: finalUrl, method, headers }
		if (requestOptions.body !== undefined) config.data = requestOptions.body
		if (requestOptions.signal) config.signal = requestOptions.signal
		if (requestOptions.credentials === 'include') config.withCredentials = true
		if (requestOptions.params) {
			config.params = requestOptions.params
			config.paramsSerializer = (params) => serializeParams(params as QueryParams)
		}

		try {
			const response = await instance.request<TResponse>(config)
			return response.data
		} catch (rawError) {
			const error = rawError as AxiosError

			const status = error.response?.status ?? 0
			const statusText = error.response?.statusText ?? (status === 0 ? 'NETWORK_ERROR' : '')
			const data = error.response?.data
			const message =
				(typeof data === 'string' && data.trim().length > 0
					? data
					: error.message) || `Request failed with ${status} ${statusText}`

			throw new ApiError({
				message,
				status,
				statusText,
				url: finalUrl,
				method,
				data,
			})
		}
	}

	return {
		request,
		get: <TResponse,>(options: Omit<ApiRequestOptions<never>, 'body'>) =>
			request<TResponse, never>('GET', options),
		post: <TResponse, TBody = unknown,>(options: ApiRequestOptions<TBody>) =>
			request<TResponse, TBody>('POST', options),
		put: <TResponse, TBody = unknown,>(options: ApiRequestOptions<TBody>) =>
			request<TResponse, TBody>('PUT', options),
		del: <TResponse, TBody = unknown,>(options: ApiRequestOptions<TBody>) =>
			request<TResponse, TBody>('DELETE', options),
	}
}
const authenticatedAxios: AxiosInstance = axios.create()

authenticatedAxios.interceptors.request.use(async (config) => {
	const token = await getAccessToken()
	if (!token) return config

	const currentHeaders = config.headers ?? {}
	const headerBag = new Headers(currentHeaders as HeadersInit)
	if (!headerBag.get('Authorization')) {
		headerBag.set('Authorization', `Bearer ${token}`)
	}
	config.headers = Object.fromEntries(headerBag.entries())
	return config
})

export const api = createApiClient({
	baseUrl: environment.baseApiUrl,
	axiosInstance: authenticatedAxios,
})

