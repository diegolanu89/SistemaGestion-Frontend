import { APP_PROFILES } from './AppProfileConfig.m'

export const resolveCapabilities = () => {
	const mode = APP_PROFILES.__ACTIVE_MODE__
	const profile = APP_PROFILES[mode]

	if (!profile) {
		throw new Error('[Capabilities] Invalid profile configuration')
	}

	return {
		isDev: profile.isDev,
		isProd: profile.isProd,
		apiBaseUrl: profile.apiBaseUrl,
		provider: profile.authProvider,
		modeApp: profile.appMode,
	}
}
