import { HttpClient } from '../../base/services/HttpClient.s'

import { DashboardEvmInterface } from '../models/DashboardEvmInterface.m'
import { DashboardEvmResponse } from '../models/DashboardEvmDTO.m'
import { ProjectMetricsBatchResponse, ProjectMetricsDto } from '../models/ProjectMetricsDTO.m'
import { ProjectTrackingDto, ProjectTrackingResponse } from '../models/ProjectTrackingDTO.m'

const BASE_URL = `${import.meta.env.VITE_API_URL}/projects`
const TRACKING_BASE_URL = `${import.meta.env.VITE_API_URL}/project-trackings`

export class DashboardEvmBDT implements DashboardEvmInterface {
	async getEvm(): Promise<DashboardEvmResponse> {
		// El endpoint devuelve además { current_page, per_page, last_page, from, to }
		// pero a nivel front sólo consumimos { data, total }.
		return await HttpClient.request<DashboardEvmResponse>(`${BASE_URL}/evm`)
	}

	async getMetricsBatch(projectIds: number[]): Promise<ProjectMetricsDto[]> {
		if (projectIds.length === 0) return []

		const query = new URLSearchParams({ project_ids: projectIds.join(',') })
		const response = await HttpClient.request<ProjectMetricsBatchResponse>(`${BASE_URL}/metrics/batch?${query.toString()}`)

		return response.metrics ?? []
	}

	async getTracking(projectId: number): Promise<ProjectTrackingDto | null> {
		const response = await HttpClient.request<ProjectTrackingResponse>(`${TRACKING_BASE_URL}/${projectId}`)

		return response.data
	}
}
