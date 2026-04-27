import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'

const { apiBaseUrl } = resolveCapabilities()

export const Configuration = {
	MESSAGES: {
		INVALID_CREDENTIALS: 'Email o contraseña incorrectos.',
		NETWORK_ERROR: 'No se pudo conectar con el servidor.',
		GENERIC_ERROR: 'Ocurrió un error inesperado.',
	},

	API: {
		BASE_URL: apiBaseUrl,

		STORAGE_KEY: 'authUser',

		ENDPOINTS: {
			LOGIN: '/auth/login',
			LOGOUT: '/auth/logout',
			ME: '/auth/me',
		},
	},
} as const
