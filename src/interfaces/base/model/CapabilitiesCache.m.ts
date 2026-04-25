// src/common/capabilities/CapabilitiesCache.ts
import { AppProfile } from './AppProfile.m'
import type { Capabilities } from './Capabilities.m'

export const CAPABILITIES_STORAGE_KEY = '__APP_CAPABILITIES__'

export interface CachedCapabilities {
	signature: string
	data: Capabilities
}

export const buildCapabilitiesSignature = (profile: AppProfile): string => {
	return [profile.appMode, profile.authProvider, profile.apiBaseUrl, profile.isProd].join('|')
}
