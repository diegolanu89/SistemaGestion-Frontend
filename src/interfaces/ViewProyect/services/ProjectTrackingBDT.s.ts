// services/ProjectTrackingBDT.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { HttpClient } from '../../base/services/HttpClient.s'

import {
	ProjectTrackingInterface,
	ProjectTrackingDto,
	GetProjectTrackingResponseDto,
	UpsertProjectTrackingDto,
	CreateTrackingUpdateDto,
	ProjectTrackingUpdateDto,
	UpdateTrackingUpdateDto,
} from '../models/IProjectTracking.m'

const BASE_URL = `${import.meta.env.VITE_API_URL}/project-trackings`

export interface ApiResponse<T> {
	success: boolean

	message?: string

	data: T
}

export class ProjectTrackingBDT implements ProjectTrackingInterface {
	/* =====================================================
	🔹 GET TRACKING
	===================================================== */

	async getTracking(projectId: number): Promise<ProjectTrackingDto | null> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] getTracking -> ${projectId}`)

		const response = await HttpClient.request<GetProjectTrackingResponseDto>(`${BASE_URL}/${projectId}`)

		return response.data
	}

	/* =====================================================
	🔹 CREATE TRACKING
	===================================================== */

	async createTracking(projectId: number, dto: UpsertProjectTrackingDto): Promise<ProjectTrackingDto> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] createTracking -> ${projectId}`)

		const response = await HttpClient.request<ApiResponse<ProjectTrackingDto>>(`${BASE_URL}/${projectId}`, {
			method: 'POST',

			body: JSON.stringify(dto),
		})

		return response.data
	}

	/* =====================================================
	🔹 UPDATE TRACKING
	===================================================== */

	async updateTracking(projectId: number, dto: UpsertProjectTrackingDto): Promise<ProjectTrackingDto> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] updateTracking -> ${projectId}`)

		const response = await HttpClient.request<ApiResponse<ProjectTrackingDto>>(`${BASE_URL}/${projectId}`, {
			method: 'PUT',

			body: JSON.stringify(dto),
		})

		return response.data
	}

	/* =====================================================
	🔹 ADD UPDATE
	===================================================== */

	async addUpdate(projectId: number, dto: CreateTrackingUpdateDto): Promise<ProjectTrackingUpdateDto> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] addUpdate -> ${projectId}`)

		const response = await HttpClient.request<ApiResponse<ProjectTrackingUpdateDto>>(`${BASE_URL}/${projectId}/updates`, {
			method: 'POST',

			body: JSON.stringify(dto),
		})

		return response.data
	}

	/* =====================================================
	🔹 EDIT UPDATE
	===================================================== */

	async editUpdate(projectId: number, updateId: number, dto: UpdateTrackingUpdateDto): Promise<ProjectTrackingUpdateDto> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] editUpdate -> ${projectId} / ${updateId}`)

		const response = await HttpClient.request<ApiResponse<ProjectTrackingUpdateDto>>(`${BASE_URL}/${projectId}/updates/${updateId}`, {
			method: 'PUT',

			body: JSON.stringify(dto),
		})

		return response.data
	}

	/* =====================================================
	🔹 DELETE UPDATE
	===================================================== */

	async deleteUpdate(projectId: number, updateId: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] deleteUpdate -> ${projectId} / ${updateId}`)

		await HttpClient.request(`${BASE_URL}/${projectId}/updates/${updateId}`, {
			method: 'DELETE',
		})
	}
}
