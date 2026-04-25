import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'

const { isDev, apiBaseUrl } = resolveCapabilities()

export const Configuration = {
	MESSAGES: {
		INVALID_CREDENTIALS: 'Email o contraseña incorrectos.',
		NETWORK_ERROR: 'No se pudo conectar con el servidor.',
		GENERIC_ERROR: 'Ocurrió un error inesperado.',
	},

	API: {
		BASE_URL: isDev ? apiBaseUrl : 'https://tu-api.com',

		STORAGE_KEY: 'authUser',

		ENDPOINTS: {
			LOGIN: '/auth/login',
			LOGOUT: '/auth/logout',
			ME: '/auth/me',
		},
	},
} as const
