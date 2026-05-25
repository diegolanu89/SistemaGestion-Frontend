import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { HttpClient } from '../../base/services/HttpClient.s'
import { CreateDashboardFilterDto, DashboardFilterDto, UpdateDashboardFilterDto } from '../model/DashboardHoursDTO.m'
import { IDashboardFilters } from '../model/IDashboardfilter.m'

const BASE_URL = import.meta.env.VITE_API_URL

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class DashboardFiltersBDT implements IDashboardFilters {
	// ==========================
	// 🔹 GET ALL
	// ==========================

	async getAll(): Promise<DashboardFilterDto[]> {
		logger.infoTag(LogTag.Adapter, '[DASHBOARD-FILTERS][BDT] getAll()')

		try {
			return await HttpClient.request<DashboardFilterDto[]>(`${BASE_URL}/app/dashboard-filters`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 CREATE
	// ==========================

	async create(data: CreateDashboardFilterDto): Promise<DashboardFilterDto> {
		logger.infoTag(LogTag.Adapter, `[DASHBOARD-FILTERS][BDT] create -> ${data.Name}`)

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

	// ==========================
	// 🔹 UPDATE
	// ==========================

	async update(id: number, data: UpdateDashboardFilterDto): Promise<DashboardFilterDto> {
		logger.infoTag(LogTag.Adapter, `[DASHBOARD-FILTERS][BDT] update -> id=${id}`)

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

	// ==========================
	// 🔹 DELETE
	// ==========================

	async delete(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[DASHBOARD-FILTERS][BDT] delete -> id=${id}`)

		try {
			await HttpClient.request(`${BASE_URL}/app/dashboard-filters/${id}`, {
				method: 'DELETE',
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}
}
