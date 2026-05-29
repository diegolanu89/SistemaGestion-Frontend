import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { HttpClient } from '../../base/services/HttpClient.s'
import {
	DashboardHoursFiltersDto,
	DashboardHoursResponseDto,
	DashboardSyncDto,
	DashboardFilterDto,
	CreateDashboardFilterDto,
	UpdateDashboardFilterDto,
	UserMonthlyCapacityDto,
	CreateUserMonthlyCapacityDto,
} from '../model/DashboardHoursDTO.m'
import { IDashboardHours } from '../model/IDashboardHours.m'

const BASE_URL = import.meta.env.VITE_API_URL

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class DashboardHoursBDT implements IDashboardHours {
	async getDashboard(filters?: DashboardHoursFiltersDto): Promise<DashboardHoursResponseDto> {
		logger.infoTag(LogTag.Adapter, '[DASHBOARD-HOURS][BDT] getDashboard')

		try {
			const params = new URLSearchParams()

			if (filters?.leader_id) params.append('leader_id', filters.leader_id)

			if (filters?.project_id) params.append('project_id', filters.project_id)

			filters?.month_keys?.forEach((m) => params.append('month_keys[]', m))

			const query = params.toString()

			return await HttpClient.request<DashboardHoursResponseDto>(`${BASE_URL}/dashboard-hours${query ? `?${query}` : ''}`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async getLastSync(): Promise<DashboardSyncDto> {
		logger.infoTag(LogTag.Adapter, '[DASHBOARD-HOURS][BDT] getLastSync')

		try {
			return await HttpClient.request<DashboardSyncDto>(`${BASE_URL}/time-entries/last-date`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async getFilters(): Promise<DashboardFilterDto[]> {
		logger.infoTag(LogTag.Adapter, '[DASHBOARD-HOURS][BDT] getFilters')

		try {
			return await HttpClient.request<DashboardFilterDto[]>(`${BASE_URL}/app/dashboard-filters`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async createFilter(data: CreateDashboardFilterDto): Promise<DashboardFilterDto> {
		logger.infoTag(LogTag.Adapter, '[DASHBOARD-HOURS][BDT] createFilter')

		try {
			return await HttpClient.request<DashboardFilterDto>(`${BASE_URL}/app/dashboard-filters`, {
				method: 'POST',

				body: JSON.stringify(data),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async updateFilter(id: number, data: UpdateDashboardFilterDto): Promise<DashboardFilterDto> {
		logger.infoTag(LogTag.Adapter, `[DASHBOARD-HOURS][BDT] updateFilter -> ${id}`)

		try {
			return await HttpClient.request<DashboardFilterDto>(`${BASE_URL}/app/dashboard-filters/${id}`, {
				method: 'PUT',

				body: JSON.stringify(data),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async deleteFilter(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[DASHBOARD-HOURS][BDT] deleteFilter -> ${id}`)

		try {
			await HttpClient.request<void>(`${BASE_URL}/app/dashboard-filters/${id}`, {
				method: 'DELETE',
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async getUserCapacities(userId: number): Promise<UserMonthlyCapacityDto[]> {
		logger.infoTag(LogTag.Adapter, `[DASHBOARD-HOURS][BDT] getUserCapacities -> ${userId}`)

		try {
			const response = await HttpClient.request<{
				success: boolean

				data: UserMonthlyCapacityDto[]
			}>(`${BASE_URL}/clockify-users/${userId}/capacities`)

			return response.data
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async saveUserCapacities(userId: number, data: CreateUserMonthlyCapacityDto): Promise<UserMonthlyCapacityDto[]> {
		logger.infoTag(LogTag.Adapter, `[DASHBOARD-HOURS][BDT] saveUserCapacities -> ${userId}`)

		try {
			const response = await HttpClient.request<{
				success: boolean

				data: UserMonthlyCapacityDto[]
			}>(`${BASE_URL}/clockify-users/${userId}/capacities`, {
				method: 'POST',

				body: JSON.stringify(data),
			})

			return response.data
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}
}
