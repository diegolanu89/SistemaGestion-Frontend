import { AppMode } from './EAppMode.m'
import { AuthProvider } from './EAuthProviders.m'
import type { AppProfile } from './AppProfile.m'

const ENV_MODE = (import.meta.env.VITE_APP_MODE ?? '').toLowerCase() as AppMode

const ACTIVE_MODE: AppMode = Object.values(AppMode).includes(ENV_MODE) ? ENV_MODE : AppMode.MOCK

export const APP_PROFILES: Record<AppMode, AppProfile> & {
	__ACTIVE_MODE__: AppMode
} = {
	__ACTIVE_MODE__: ACTIVE_MODE,

	// ==========================
	// MOCK
	// ==========================
	[AppMode.MOCK]: {
		appMode: AppMode.MOCK,
		authProvider: AuthProvider.MOCK,
		apiBaseUrl: 'http://localhost:3001',
		isProd: false,
		isDev: true,
	},

	// ==========================
	// API / REAL
	// ==========================
	[AppMode.ERS]: {
		appMode: AppMode.ERS,
		authProvider: AuthProvider.ERS,
		apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
		isProd: import.meta.env.PROD === true,
		isDev: import.meta.env.PROD !== true,
	},
}
