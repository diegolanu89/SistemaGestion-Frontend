import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

import { HttpClient } from '../../base/services/HttpClient.s'

import { IUserRef } from '../model/IUserRef.m'
import { UserRefDto } from '../model/UserRefDTO.m'

const BASE_URL = import.meta.env.VITE_API_URL

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
			const wire = await HttpClient.request<UserWireDto[]>(`${BASE_URL}/users`)

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
