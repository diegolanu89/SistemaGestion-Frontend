// services/ProyectViewBDT.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { HttpClient } from '../../base/services/HttpClient.s'

import { DashboardHoursResponseDto } from '../../DashboardHours/model/DashboardHoursDTO.m'

import { ProjectDto, UpdateBacDto } from '../models/ProyectViewDTO.m'

import {
	GetAllProjectsParams,
	ProjectHoursResponseDto,
	ProjectPaginatedResponse,
	ProjectUserHoursDto,
	ProyectViewInterface,
	RecalculateHoursResponse,
	UpdateBacResponse,
} from '../models/ProyectViewInterface.m'

const BASE_URL = `${import.meta.env.VITE_API_URL}/projects`

const DASHBOARD_URL = `${import.meta.env.VITE_API_URL}/dashboard-hours`

export class ProyectViewBDT implements ProyectViewInterface {
	// =========================================================
	// 🔹 GET ALL
	// =========================================================

	async getAll(params?: GetAllProjectsParams): Promise<ProjectPaginatedResponse> {
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

		if (params?.search) {
			query.append('search', params.search)
		}

		if (params?.client) {
			query.append('client', params.client)
		}

		if (params?.status) {
			query.append('status', params.status)
		}

		if (params?.code) {
			query.append('code', params.code)
		}

		return await HttpClient.request<ProjectPaginatedResponse>(`${BASE_URL}?${query.toString()}`)
	}

	// =========================================================
	// 🔹 GET EVM
	// =========================================================

	async getEvm(): Promise<ProjectPaginatedResponse> {
		return await HttpClient.request<ProjectPaginatedResponse>(`${BASE_URL}/evm`)
	}

	// =========================================================
	// 🔹 GET BY ID
	// =========================================================

	async getById(id: number): Promise<ProjectDto> {
		return await HttpClient.request<ProjectDto>(`${BASE_URL}/${id}`)
	}

	// =========================================================
	// 🔹 GET PROJECT HOURS
	// =========================================================

	async getProjectHours(id: number): Promise<ProjectHoursResponseDto> {
		logger.infoTag(LogTag.Adapter, `[PROJECTS][BDT] getProjectHours -> ${id}`)

		const query = new URLSearchParams()

		query.append('project_id', String(id))

		const response = await HttpClient.request<DashboardHoursResponseDto>(`${DASHBOARD_URL}?${query.toString()}`)

		const users: ProjectUserHoursDto[] = (response.data ?? []).map((row) => {
			const totalHours = Object.values(row.months ?? {}).reduce((acc, current) => acc + current.hours, 0)

			return {
				user_id: row.user_id,

				user_name: row.user_name,

				role_short: row.role_short,

				leader_name: row.leader_name,

				months: row.months,

				total_hours: totalHours,
			}
		})

		return {
			project_id: id,

			months: response.months ?? [],

			month_hours: Object.entries(response.month_hours ?? {}).reduce(
				(acc, [key, value]) => {
					acc[key] = value ?? 0

					return acc
				},

				{} as Record<string, number>
			),

			data: users,
		}
	}

	// =========================================================
	// 🔹 UPDATE BAC
	// =========================================================

	async updateBac(id: number, data: UpdateBacDto): Promise<UpdateBacResponse> {
		return await HttpClient.request<UpdateBacResponse>(`${BASE_URL}/${id}/bac`, {
			method: 'PATCH',

			body: JSON.stringify(data),
		})
	}

	// =========================================================
	// 🔹 RECALCULATE HOURS
	// =========================================================

	async recalculateHours(id: number): Promise<RecalculateHoursResponse> {
		return await HttpClient.request<RecalculateHoursResponse>(`${BASE_URL}/${id}/recalculate-hours`, {
			method: 'POST',
		})
	}
}
