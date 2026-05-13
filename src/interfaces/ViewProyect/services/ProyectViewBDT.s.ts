import { HttpClient } from '../../base/services/HttpClient.s'

import { ProjectDto, UpdateBacDto } from '../models/ProyectViewDTO.m'

import { ProjectPaginatedResponse, ProyectViewInterface, RecalculateHoursResponse, UpdateBacResponse } from '../models/ProyectViewInterface.m'

const BASE_URL = `${import.meta.env.VITE_API_URL}/projects`

export class ProyectViewBDT implements ProyectViewInterface {
	async getAll(params?: { page?: number; per_page?: number; only_visible?: boolean }): Promise<ProjectPaginatedResponse> {
		const query = new URLSearchParams()

		if (params?.page) {
			query.append('page', String(params.page))
		}

		if (params?.per_page) {
			query.append('per_page', String(params.per_page))
		}

		if (params?.only_visible !== undefined) {
			query.append('only_visible', params.only_visible ? 'true' : 'false')
		}

		return await HttpClient.request<ProjectPaginatedResponse>(`${BASE_URL}?${query.toString()}`)
	}

	async getEvm(): Promise<ProjectPaginatedResponse> {
		return await HttpClient.request<ProjectPaginatedResponse>(`${BASE_URL}/evm`)
	}

	async getById(id: number): Promise<ProjectDto> {
		return await HttpClient.request<ProjectDto>(`${BASE_URL}/${id}`)
	}

	async updateBac(id: number, data: UpdateBacDto): Promise<UpdateBacResponse> {
		return await HttpClient.request<UpdateBacResponse>(`${BASE_URL}/${id}/bac`, {
			method: 'PATCH',

			body: JSON.stringify(data),
		})
	}

	async recalculateHours(id: number): Promise<RecalculateHoursResponse> {
		return await HttpClient.request<RecalculateHoursResponse>(`${BASE_URL}/${id}/recalculate-hours`, {
			method: 'POST',
		})
	}
}
