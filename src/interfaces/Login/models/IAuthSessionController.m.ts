import { IAuthSession } from './IAuthSesion.m'

export interface IAuthSessionController {
	getSession(): Promise<IAuthSession | null>
	getAccessToken(): Promise<string | null>
	updateAccessToken(newAccessToken: string): Promise<void>
	clearSession(): Promise<void>
}
