// services/HttpClient.s.ts

export class ApiError extends Error {
	public readonly errors: string[]
	public readonly statusCode: number

	constructor(message: string, statusCode: number, errors: string[] = []) {
		super(message)
		this.name = 'ApiError'
		this.statusCode = statusCode
		this.errors = errors
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
				body?.message ?? 'REQUEST_ERROR',
				response.status,
				Array.isArray(body?.errors) ? (body.errors as string[]) : [],
			)
		}

		return response.json()
	}
}
