import { Configuration } from '../models/Configuration.m'
import { IUser } from '../models/IUser.m'
import { LoginInterface } from '../models/LoginInterface.m'

export class LoginBDT implements LoginInterface {
	private readonly baseUrl = Configuration.API.BASE_URL
	private readonly storageKey = Configuration.API.STORAGE_KEY

	// ==========================
	// LOGIN
	// ==========================
	async login(email: string, password: string): Promise<IUser> {
		const response = await fetch(`${this.baseUrl}${Configuration.API.ENDPOINTS.LOGIN}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})

		if (!response.ok) {
			throw new Error(Configuration.MESSAGES.INVALID_CREDENTIALS)
		}

		const data = await response.json()

		localStorage.setItem(this.storageKey, data.token)

		return data.user as IUser
	}

	// ==========================
	// LOGOUT
	// ==========================
	async logout(): Promise<void> {
		const token = localStorage.getItem(this.storageKey)

		if (token) {
			try {
				await fetch(`${this.baseUrl}${Configuration.API.ENDPOINTS.LOGOUT}`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
			} catch {
				// ignore
			}
		}

		localStorage.removeItem(this.storageKey)
	}

	// ==========================
	// GET USER (/me)
	// ==========================
	async getUser(): Promise<IUser> {
		const token = localStorage.getItem(this.storageKey)

		if (!token) {
			throw new Error('UNAUTHORIZED')
		}

		const response = await fetch(`${this.baseUrl}${Configuration.API.ENDPOINTS.ME}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			localStorage.removeItem(this.storageKey)
			throw new Error('UNAUTHORIZED')
		}

		return (await response.json()) as IUser
	}
}
