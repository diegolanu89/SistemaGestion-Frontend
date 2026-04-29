import { IUser } from '../../Login/models/IUser.m'

export interface Capabilities {
	isDev: boolean
	isProd: boolean
	apiBaseUrl: string
	role: string
}

export const buildCapabilities = (user: IUser | null): Capabilities => {
	return {
		isDev: import.meta.env.DEV,
		isProd: import.meta.env.PROD,
		apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
		role: user?.role ?? 'user',
	}
}
