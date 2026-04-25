/**
 * Representa una sesión de autenticación válida.
 * Es devuelta por el backend en login / refresh.
 */
export interface IAuthSession {
	/** Access token JWT */
	accessToken: string

	/** Refresh token */
	refreshToken: string

	/** Identificador único de esta sesión */
	sessionId: string

	/** Fecha de expiración del access token (ISO string) */
	expiresAt: string

	/** Información del dispositivo (opcional) */
	device?: string

	/** Fecha de última actividad registrada por backend (opcional) */
	lastActivity?: string
}
