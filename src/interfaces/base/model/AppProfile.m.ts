// src/common/config/AppProfile.m.ts
import { AppMode } from './EAppMode.m'
import { AuthProvider } from './EAuthProviders.m'

export interface FirebaseConfig {
	apiKey: string
	authDomain: string
	projectId: string
	storageBucket: string
	messagingSenderId: string
	appId: string
}

export interface AppProfile {
	appMode: AppMode
	authProvider: AuthProvider
	apiBaseUrl: string
	isProd: boolean
	isDev: boolean
	captchaToken?: string
}
