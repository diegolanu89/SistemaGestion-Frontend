import { APP_PROFILES } from './AppProfileConfig.m'
import { AppMode } from './EAppMode.m'

export const resolveRuntimeConfig = () => {
	const mode = (import.meta.env.VITE_APP_MODE as AppMode) ?? AppMode.ERS

	const config = APP_PROFILES[mode]

	if (!config) {
		throw new Error(`No RuntimeConfig profile for APP_MODE=${mode}`)
	}

	return config
}

export const runtimeConfig = resolveRuntimeConfig()
