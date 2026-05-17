import { HttpClient } from '../../base/services/HttpClient.s'

import { DashboardEvmInterface } from '../models/DashboardEvmInterface.m'
import { DashboardEvmResponse } from '../models/DashboardEvmDTO.m'
import { ProjectTrackingDto } from '../models/ProjectTrackingDTO.m'

const BASE_URL = `${import.meta.env.VITE_API_URL}/projects`

export class DashboardEvmBDT implements DashboardEvmInterface {
	async getEvm(): Promise<DashboardEvmResponse> {
		// TODO RF-10: el endpoint actual /projects/evm devuelve ProjectPaginatedResponse
		// sin `changesCount`. Coordinar con backend para incluirlo.
		return await HttpClient.request<DashboardEvmResponse>(`${BASE_URL}/evm`)
	}

	async getTracking(projectId: number): Promise<ProjectTrackingDto> {
		// TODO RF-10: endpoint a definir con backend.
		return await HttpClient.request<ProjectTrackingDto>(`${BASE_URL}/${projectId}/tracking`)
	}
}
