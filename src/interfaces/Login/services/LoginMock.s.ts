import { IUser } from '../models/IUser.m'
import { LoginInterface } from '../models/LoginInterface.m'

const AUTH_CONFIG_MOCK = {
	ID: '123456',
	EMAIL: 'demo@mock.com',
	NAME: 'Usuario Demo',
	PASSWORD: '1234',
	ACCESS_TOKEN: 'mock-access-token',
	STORAGE_KEY: 'authUser',
}

const STORAGE_KEY = AUTH_CONFIG_MOCK.STORAGE_KEY

export class LoginMock implements LoginInterface {
	// ==========================
	// LOGIN
	// ==========================
	async login(email: string, password: string): Promise<IUser> {
		if (email !== AUTH_CONFIG_MOCK.EMAIL || password !== AUTH_CONFIG_MOCK.PASSWORD) {
			throw new Error('Credenciales inválidas')
		}

		// 🔐 guardamos token mock
		localStorage.setItem(STORAGE_KEY, AUTH_CONFIG_MOCK.ACCESS_TOKEN)

		return {
			id: AUTH_CONFIG_MOCK.ID,
			email: AUTH_CONFIG_MOCK.EMAIL,
			name: AUTH_CONFIG_MOCK.NAME,
			role: 'admin',
			createdAt: new Date().toISOString(),
		}
	}

	// ==========================
	// LOGOUT
	// ==========================
	async logout(): Promise<void> {
		localStorage.removeItem(STORAGE_KEY)
	}

	// ==========================
	// GET USER (/me mock)
	// ==========================
	async getUser(): Promise<IUser> {
		const token = localStorage.getItem(STORAGE_KEY)

		if (token !== AUTH_CONFIG_MOCK.ACCESS_TOKEN) {
			throw new Error('UNAUTHORIZED')
		}

		return {
			id: AUTH_CONFIG_MOCK.ID,
			email: AUTH_CONFIG_MOCK.EMAIL,
			name: AUTH_CONFIG_MOCK.NAME,
			role: 'admin',
			createdAt: new Date().toISOString(),
		}
	}
}
