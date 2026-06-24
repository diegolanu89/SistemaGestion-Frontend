// services/HttpClient.s.ts

export class ApiError extends Error {
	public readonly errors: string[]
	public readonly statusCode: number
	public readonly detail?: string

	constructor(message: string, statusCode: number, errors: string[] = [], detail?: string) {
		super(message)
		this.name = 'ApiError'
		this.statusCode = statusCode
		this.errors = errors
		this.detail = detail
	}
}

export class HttpClient {
	static async request<T>(url: string, options?: RequestInit): Promise<T> {
		const response = await fetch(url, {
			credentials: 'include',

			headers: {
				'Content-Type': 'application/json',
				...(options?.headers ?? {}),
			},

			...options,
		})

		if (response.status === 401) {
			localStorage.removeItem('authUserData')

			window.location.href = '/'
			throw new ApiError('UNAUTHORIZED', 401)
		}

		if (!response.ok) {
			const body = await response.json().catch(() => null)

			throw new ApiError(
				body?.message ?? body?.error ?? 'REQUEST_ERROR',
				response.status,
				Array.isArray(body?.errors) ? (body.errors as string[]) : [],
				typeof body?.error === 'string' ? body.error : undefined,
			)
		}

		return response.json()
	}
}
