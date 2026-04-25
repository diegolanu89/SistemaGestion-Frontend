import { AuthLogEvent } from './AuthLogEvent.m'

export const AuthLogMessages: Record<AuthLogEvent, string> = {
	// FLOW
	[AuthLogEvent.SUBMIT_START]: '[AUTH] Submit started',

	// REQUEST
	[AuthLogEvent.LOGIN_REQUEST]: '[AUTH] Login request',

	// VALIDATION
	[AuthLogEvent.INVALID_EMAIL]: '[AUTH] Invalid email',
	[AuthLogEvent.INVALID_PASSWORD]: '[AUTH] Invalid password',

	// ERRORS
	[AuthLogEvent.NETWORK_ERROR]: '[AUTH] Network error',
	[AuthLogEvent.UNKNOWN_ERROR]: '[AUTH] Unknown error',
}
