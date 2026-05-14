/* eslint-disable no-empty */
// services/LoginBDT.s

import { Configuration } from '../models/Configuration.m'

import { IUser, IUserProfilePermissions } from '../models/IUser.m'

import { LoginInterface } from '../models/LoginInterface.m'

export class LoginBDT implements LoginInterface {
	private readonly baseUrl = Configuration.API.BASE_URL

	private readonly userStorageKey = 'authUserData'

	private saveUser(user: IUser): void {
		localStorage.setItem(this.userStorageKey, JSON.stringify(user))
	}

	private removeUser(): void {
		localStorage.removeItem(this.userStorageKey)
	}

	async getMyPermissions(): Promise<IUserProfilePermissions> {
		const response = await fetch(`${this.baseUrl}/auth/permissions`, {
			credentials: 'include',
		})

		if (!response.ok) {
			throw new Error('ERROR_PROFILE_PERMISSIONS')
		}

		return (await response.json()) as IUserProfilePermissions
	}

	async login(email: string, password: string): Promise<IUser> {
		const response = await fetch(`${this.baseUrl}${Configuration.API.ENDPOINTS.LOGIN}`, {
			method: 'POST',

			credentials: 'include',

			headers: {
				'Content-Type': 'application/json',
			},

			body: JSON.stringify({
				email,
				password,
			}),
		})

		if (!response.ok) {
			throw new Error(Configuration.MESSAGES.INVALID_CREDENTIALS)
		}

		const data = await response.json()

		const user = data.user as IUser

		try {
			const permissions = await this.getMyPermissions()

			user.profilePermissions = permissions
		} catch {
			user.profilePermissions = {
				profileId: user.profileId ?? 0,
				permissions: [],
			}
		}

		this.saveUser(user)

		return user
	}

	async logout(): Promise<void> {
		try {
			await fetch(`${this.baseUrl}${Configuration.API.ENDPOINTS.LOGOUT}`, {
				method: 'POST',

				credentials: 'include',
			})
		} catch {}

		this.removeUser()
	}

	async getUser(): Promise<IUser> {
		const response = await fetch(`${this.baseUrl}${Configuration.API.ENDPOINTS.ME}`, {
			credentials: 'include',
		})

		if (!response.ok) {
			this.removeUser()

			throw new Error('UNAUTHORIZED')
		}

		const user = (await response.json()) as IUser

		try {
			const permissions = await this.getMyPermissions()

			user.profilePermissions = permissions
		} catch {
			user.profilePermissions = {
				profileId: user.profileId ?? 0,
				permissions: [],
			}
		}

		this.saveUser(user)

		return user
	}
}
