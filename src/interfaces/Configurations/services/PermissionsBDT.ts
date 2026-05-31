import { HttpClient } from '../../base/services/HttpClient.s'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { AppUserDto } from '../models/AppUser.m'

import {
	PermissionDto,
	ProfileDto,
	CreateProfileDto,
	UpdateProfileDto,
	ProfilePermissionsResponseDto,
	SyncProfilePermissionsDto,
} from '../models/Permissions.m'

const BASE_URL = import.meta.env.VITE_API_URL

export class PermissionBDT {
	/**
	 * =========================================================
	 * USERS
	 * =========================================================
	 */

	async listUsers(): Promise<AppUserDto[]> {
		logger.infoTag(LogTag.Adapter, 'Loading users')

		const response = await HttpClient.request<AppUserDto[]>(`${BASE_URL}/app/users`)

		logger.infoTag(LogTag.Adapter, `Users loaded: ${response.length}`)

		return response
	}

	async assignProfileToUser(userId: number, profileId: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `Assigning profile ${profileId} to user ${userId}`)

		await HttpClient.request(`${BASE_URL}/app/users/${userId}`, {
			method: 'PUT',
			body: JSON.stringify({
				profileId,
			}),
		})

		logger.infoTag(LogTag.Adapter, `Profile ${profileId} assigned to user ${userId}`)
	}

	/**
	 * =========================================================
	 * PROFILES
	 * =========================================================
	 */

	async listProfiles(): Promise<ProfileDto[]> {
		logger.infoTag(LogTag.Adapter, 'Loading profiles')

		const response = await HttpClient.request<ProfileDto[]>(`${BASE_URL}/app/profiles`)

		logger.infoTag(LogTag.Adapter, `Profiles loaded: ${response.length}`)

		return response
	}

	async getProfile(profileId: number): Promise<ProfileDto> {
		logger.infoTag(LogTag.Adapter, `Loading profile ${profileId}`)

		const response = await HttpClient.request<ProfileDto>(`${BASE_URL}/app/profiles/${profileId}`)

		logger.infoTag(LogTag.Adapter, `Profile loaded ${profileId}`)

		return response
	}

	async createProfile(payload: CreateProfileDto): Promise<ProfileDto> {
		logger.infoTag(LogTag.Adapter, `Creating profile ${payload.code}`)

		const response = await HttpClient.request<ProfileDto>(`${BASE_URL}/app/profiles`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})

		logger.infoTag(LogTag.Adapter, `Profile created ${response.id}`)

		return response
	}

	async updateProfile(profileId: number, payload: UpdateProfileDto): Promise<ProfileDto> {
		logger.infoTag(LogTag.Adapter, `Updating profile ${profileId}`)

		const response = await HttpClient.request<ProfileDto>(`${BASE_URL}/app/profiles/${profileId}`, {
			method: 'PUT',
			body: JSON.stringify(payload),
		})

		logger.infoTag(LogTag.Adapter, `Profile updated ${profileId}`)

		return response
	}

	async deleteProfile(profileId: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `Deleting profile ${profileId}`)

		await HttpClient.request(`${BASE_URL}/app/profiles/${profileId}`, {
			method: 'DELETE',
		})

		logger.infoTag(LogTag.Adapter, `Profile deleted ${profileId}`)
	}

	/**
	 * =========================================================
	 * PERMISSIONS
	 * =========================================================
	 */

	async listPermissions(): Promise<PermissionDto[]> {
		logger.infoTag(LogTag.Adapter, 'Loading available permissions')

		const response = await HttpClient.request<PermissionDto[]>(`${BASE_URL}/app/permissions`)

		logger.infoTag(LogTag.Adapter, `Permissions loaded: ${response.length}`)

		return response
	}

	async getProfilePermissions(profileId: number): Promise<ProfilePermissionsResponseDto> {
		logger.infoTag(LogTag.Adapter, `Loading permissions for profile ${profileId}`)

		const response = await HttpClient.request<ProfilePermissionsResponseDto>(`${BASE_URL}/app/profiles/${profileId}/permissions`)

		logger.infoTag(LogTag.Adapter, `Profile permissions loaded for profile ${profileId}`)

		return response
	}

	async saveProfilePermissions(profileId: number, payload: SyncProfilePermissionsDto): Promise<void> {
		logger.infoTag(LogTag.Adapter, `Saving permissions for profile ${profileId}`)

		await HttpClient.request(`${BASE_URL}/app/profiles/${profileId}/permissions`, {
			method: 'PUT',
			body: JSON.stringify(payload),
		})

		logger.infoTag(LogTag.Adapter, `Permissions saved for profile ${profileId}`)
	}
}

export const permissionBDT = new PermissionBDT()
