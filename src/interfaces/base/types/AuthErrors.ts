export type HttpAuthError = {
	type: 'HTTP_ERROR'
	status: number
	message: string
}

export type NetworkAuthError = {
	type: 'NETWORK_ERROR'
	message: string
}

export type AuthError = HttpAuthError | NetworkAuthError
