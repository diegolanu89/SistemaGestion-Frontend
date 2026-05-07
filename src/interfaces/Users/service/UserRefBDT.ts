import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { IUserRef } from '../model/IUserRef.m'
import { UserRefDto } from '../model/UserRefDTO.m'

const BASE_URL = import.meta.env.VITE_API_URL
const TOKEN_STORAGE_KEY = 'authUser'

const authFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY)

	const headers = new Headers(init?.headers)

	if (!headers.has('Content-Type') && init?.body) {
		headers.set('Content-Type', 'application/json')
	}

	if (token) {
		headers.set('Authorization', `Bearer ${token}`)
	}

	return fetch(input, {
		...init,
		headers,
	})
}

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

interface UserWireDto {
	id: number
	name: string
	email: string
}

export class UserRefBDT implements IUserRef {
	async getUsers(): Promise<UserRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[USERS][BDT] getUsers()')

		try {
			const res = await authFetch(`${BASE_URL}/users`)

			if (!res.ok) {
				throw new Error(`Error fetching users (status=${res.status})`)
			}

			const wire = (await res.json()) as UserWireDto[]

			return wire.map((u) => ({
				Id: u.id,
				Username: u.email,
				FullName: u.name,
				IsActive: true,
			}))
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}
}
