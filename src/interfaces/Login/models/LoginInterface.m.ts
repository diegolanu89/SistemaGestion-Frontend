import type { IUser } from './IUser.m'

export interface LoginInterface {
	login(email: string, password: string): Promise<IUser>

	logout(): Promise<void>

	getUser(): Promise<IUser>
}
