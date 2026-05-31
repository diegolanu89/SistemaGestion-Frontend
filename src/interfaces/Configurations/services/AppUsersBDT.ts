import { HttpClient } from '../../base/services/HttpClient.s'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import type { ProfileDto, AppUserDto, CreateAppUserDto, UpdateAppUserDto } from '../models/AppUser.m'

const BASE_URL = import.meta.env.VITE_API_URL

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
	const q = new URLSearchParams()

	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== null && v !== '') {
			q.set(k, String(v))
		}
	}

	const s = q.toString()

	return s ? `?${s}` : ''
}

export const appUsersBDT = {
	async listProfiles(): Promise<ProfileDto[]> {
		logger.infoTag(LogTag.EditProfileState, '[APP USERS] Loading profiles')

		const res = await HttpClient.request<ProfileDto[]>(`${BASE_URL}/app/profiles`)

		logger.infoTag(LogTag.EditProfileState, '[APP USERS] Profiles loaded', res)

		return Array.isArray(res) ? res : []
	},

	async listUsers(params?: { search?: string }): Promise<AppUserDto[]> {
		const qs = buildQuery({ ...params })

		logger.infoTag(LogTag.EditProfileState, '[APP USERS] Loading users', {
			params,
			url: `${BASE_URL}/app/users${qs}`,
		})

		const res = await HttpClient.request<AppUserDto[]>(`${BASE_URL}/app/users${qs}`)

		logger.infoTag(LogTag.EditProfileState, '[APP USERS] Users loaded', res)

		return Array.isArray(res) ? res : []
	},

	async create(payload: CreateAppUserDto): Promise<AppUserDto> {
		logger.infoTag(LogTag.EditProfileState, '[APP USERS] CREATE payload', payload)

		try {
			const response = await HttpClient.request<AppUserDto>(`${BASE_URL}/app/users`, {
				method: 'POST',
				body: JSON.stringify(payload),
			})

			logger.infoTag(LogTag.EditProfileState, '[APP USERS] CREATE success', response)

			return response
		} catch (error: unknown) {
			logger.errorTag(LogTag.EditProfileState, error instanceof Error ? error : new Error(String(error)))

			throw error
		}
	},

	async update(id: number, payload: UpdateAppUserDto): Promise<AppUserDto> {
		logger.infoTag(LogTag.EditProfileState, '[APP USERS] UPDATE payload', {
			id,
			payload,
		})

		try {
			const response = await HttpClient.request<AppUserDto>(`${BASE_URL}/app/users/${id}`, {
				method: 'PUT',
				body: JSON.stringify(payload),
			})

			logger.infoTag(LogTag.EditProfileState, '[APP USERS] UPDATE success', response)

			return response
		} catch (error: unknown) {
			logger.errorTag(LogTag.EditProfileState, error instanceof Error ? error : new Error(String(error)))

			throw error
		}
	},

	async remove(id: number): Promise<void> {
		logger.infoTag(LogTag.EditProfileState, '[APP USERS] DELETE', {
			id,
		})

		await HttpClient.request(`${BASE_URL}/app/users/${id}`, {
			method: 'DELETE',
		})

		logger.infoTag(LogTag.EditProfileState, '[APP USERS] DELETE success', {
			id,
		})
	},
}
