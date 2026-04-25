import { IUser } from './IUser.m'

/** Contrato local para storage seguro */
export interface AuthSecureStorageService {
	getItem(key: string): Promise<string | null>
	setItem(key: string, value: string): Promise<void>
	removeItem(key: string): Promise<void>
}

/** Contrato local para acciones de auth */
export interface AuthActions {
	changePassword(input: { currentPassword: string; newPassword: string }): Promise<void>
}

export type LoginUiState = {
	loginSuccessAnimating: boolean
	playLoginSuccess: () => void
	stopLoginSuccess: () => void
}

export interface IAuthContext {
	user: IUser | null

	login(email: string, password: string): Promise<void>
	logout(): Promise<void>

	setUser: (user: IUser | null) => void

	loading: boolean
}
