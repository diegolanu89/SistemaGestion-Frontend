// services/HttpClient.s.ts

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
			throw new Error('UNAUTHORIZED')
		}

		if (!response.ok) {
			const error = await response.json().catch(() => null)

			throw new Error(error?.message ?? 'REQUEST_ERROR')
		}

		return response.json()
	}
}
