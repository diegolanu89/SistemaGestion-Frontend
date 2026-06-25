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

	async getTracking(trackingId: number): Promise<ProjectTrackingDto | null> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] getTracking -> ${trackingId}`)

		const response = await HttpClient.request<GetProjectTrackingResponseDto>(`${BASE_URL}/${trackingId}`)

		return response.data
	}

	/* =====================================================
	🔹 UPDATE TRACKING
	===================================================== */

	async updateTracking(trackingId: number, dto: UpsertProjectTrackingDto): Promise<ProjectTrackingDto> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] updateTracking -> ${trackingId}`)

		const response = await HttpClient.request<ApiResponse<ProjectTrackingDto>>(`${BASE_URL}/${trackingId}`, {
			method: 'PUT',

			body: JSON.stringify(dto),
		})

		return response.data
	}

	/* =====================================================
	🔹 ADD UPDATE
	===================================================== */

	async addUpdate(trackingId: number, dto: CreateTrackingUpdateDto): Promise<ProjectTrackingUpdateDto> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] addUpdate -> ${trackingId}`)

		const response = await HttpClient.request<ApiResponse<ProjectTrackingUpdateDto>>(`${BASE_URL}/${trackingId}/updates`, {
			method: 'POST',

			body: JSON.stringify(dto),
		})

		return response.data
	}

	/* =====================================================
	🔹 EDIT UPDATE
	===================================================== */

	async editUpdate(trackingId: number, updateId: number, dto: UpdateTrackingUpdateDto): Promise<ProjectTrackingUpdateDto> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] editUpdate -> ${trackingId} / ${updateId}`)

		const response = await HttpClient.request<ApiResponse<ProjectTrackingUpdateDto>>(`${BASE_URL}/${trackingId}/updates/${updateId}`, {
			method: 'PUT',

			body: JSON.stringify(dto),
		})

		return response.data
	}

	/* =====================================================
	🔹 DELETE UPDATE
	===================================================== */

	async deleteUpdate(trackingId: number, updateId: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[TRACKING][BDT] deleteUpdate -> ${trackingId} / ${updateId}`)

		await HttpClient.request(`${BASE_URL}/${trackingId}/updates/${updateId}`, {
			method: 'DELETE',
		})
	}
}
