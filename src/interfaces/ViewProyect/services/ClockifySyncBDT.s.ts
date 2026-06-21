import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { HttpClient } from '../../base/services/HttpClient.s'

import {
	ClockifyProjectHoursSummaryDto,
	ClockifySyncInterface,
	EstimateTimeEntriesResponseDto,
	GetClientsResponseDto,
	GetUsersResponseDto,
	SyncProjectTimeEntriesResponseDto,
	SyncResponseDto,
	SyncStatusResponseDto,
} from '../models/IClockifySync.m'

const BASE_URL = `${import.meta.env.VITE_API_URL}/clockify`

export class ClockifySyncBDT implements ClockifySyncInterface {
	/* =====================================================
	🔹 CLIENTS
	===================================================== */

	async syncClients(): Promise<SyncResponseDto> {
		logger.infoTag(LogTag.Adapter, '[CLOCKIFY] syncClients')

		return await HttpClient.request<SyncResponseDto>(`${BASE_URL}/sync-clients`, {
			method: 'POST',
		})
	}

	async getClients(): Promise<GetClientsResponseDto> {
		logger.infoTag(LogTag.Adapter, '[CLOCKIFY] getClients')

		return await HttpClient.request<GetClientsResponseDto>(`${BASE_URL}/sync-clients`)
	}

	/* =====================================================
	🔹 USERS
	===================================================== */

	async syncUsers(onlyActive = false): Promise<SyncResponseDto> {
		logger.infoTag(LogTag.Adapter, '[CLOCKIFY] syncUsers')

		return await HttpClient.request<SyncResponseDto>(`${BASE_URL}/sync-users?only_active=${onlyActive}`, {
			method: 'POST',
		})
	}

	async getUsers(onlyActive = false): Promise<GetUsersResponseDto> {
		logger.infoTag(LogTag.Adapter, '[CLOCKIFY] getUsers')

		return await HttpClient.request<GetUsersResponseDto>(`${BASE_URL}/sync-users?only_active=${onlyActive}`)
	}

	/* =====================================================
	🔹 PROJECTS
	===================================================== */

	async syncProjects(): Promise<SyncResponseDto> {
		logger.infoTag(LogTag.Adapter, '[CLOCKIFY] syncProjects')

		return await HttpClient.request<SyncResponseDto>(`${BASE_URL}/sync-projects`, {
			method: 'POST',
		})
	}

	/* =====================================================
	🔹 TIME ENTRIES
	===================================================== */

	async syncTimeEntries(from?: string, to?: string): Promise<SyncResponseDto> {
		const params = new URLSearchParams()

		if (from) params.append('from', from)

		if (to) params.append('to', to)

		return await HttpClient.request<SyncResponseDto>(`${BASE_URL}/sync-time-entries?${params.toString()}`, {
			method: 'POST',
		})
	}

	async syncTimeEntriesAll(from?: string, to?: string): Promise<SyncResponseDto> {
		const params = new URLSearchParams()

		if (from) params.append('from', from)

		if (to) params.append('to', to)

		return await HttpClient.request<SyncResponseDto>(`${BASE_URL}/sync-time-entries-all?${params.toString()}`, {
			method: 'POST',
		})
	}

	async syncTimeEntriesByProject(projectId: string, from?: string, to?: string): Promise<SyncResponseDto> {
		const params = new URLSearchParams()

		params.append('project_id', projectId)

		if (from) params.append('from', from)

		if (to) params.append('to', to)

		return await HttpClient.request<SyncResponseDto>(`${BASE_URL}/sync-time-entries-by-project?${params.toString()}`, {
			method: 'POST',
		})
	}

	/* =====================================================
	🔹 HOURS SUMMARY
	===================================================== */

	async getProjectHoursSummary(projectId: number): Promise<ClockifyProjectHoursSummaryDto> {
		logger.infoTag(LogTag.Adapter, `[CLOCKIFY] getProjectHoursSummary ${projectId}`)

		return await HttpClient.request<ClockifyProjectHoursSummaryDto>(`${BASE_URL}/projects/${projectId}/hours-summary`)
	}

	/* =====================================================
	🔹 ESTIMATE
	===================================================== */

	async estimateTimeEntries(from?: string, to?: string): Promise<EstimateTimeEntriesResponseDto> {
		const params = new URLSearchParams()

		if (from) params.append('from', from)

		if (to) params.append('to', to)

		return await HttpClient.request<EstimateTimeEntriesResponseDto>(`${BASE_URL}/estimate-time-entries?${params.toString()}`)
	}

	/* =====================================================
	🔹 STATUS
	===================================================== */

	async getSyncStatus(projectId: number): Promise<SyncStatusResponseDto> {
		return await HttpClient.request<SyncStatusResponseDto>(`${BASE_URL}/projects/${projectId}/sync-status`)
	}

	async syncProjectTimeEntries(projectId: number, mode: 'all' | 'missing' | 'from_date' = 'all', from?: string): Promise<SyncProjectTimeEntriesResponseDto> {
		const params = new URLSearchParams()

		params.append('mode', mode)

		if (from) params.append('from', from)

		return await HttpClient.request<SyncProjectTimeEntriesResponseDto>(`${BASE_URL}/projects/${projectId}/sync-time-entries?${params.toString()}`, {
			method: 'POST',
		})
	}
}
