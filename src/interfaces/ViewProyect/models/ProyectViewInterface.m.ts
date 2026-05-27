// services/interfaces/ProyectViewInterface.ts

import { ProjectDto, UpdateBacDto } from './ProyectViewDTO.m'

// =========================================================
// 🔹 PROJECT USER HOURS
// =========================================================

export interface ProjectUserHoursDto {
	user_id: number

	user_name: string

	role_short?: string | null

	leader_name?: string | null

	months: Record<
		string,
		{
			hours: number

			expected: number
		}
	>

	total_hours: number
}

// =========================================================
// 🔹 PROJECT HOURS RESPONSE
// =========================================================

export interface ProjectHoursResponseDto {
	project_id: number

	months: string[]

	month_hours: Record<string, number>

	data: ProjectUserHoursDto[]
}

// =========================================================
// 🔹 PAGINATED RESPONSE
// =========================================================

export interface ProjectPaginatedResponse {
	data: ProjectDto[]

	current_page: number

	per_page: number

	total: number

	last_page: number

	from: number

	to: number
}

// =========================================================
// 🔹 RECALCULATE HOURS
// =========================================================

export interface RecalculateHoursResponse {
	message: string

	updated: number

	total_entries: number
}

// =========================================================
// 🔹 UPDATE BAC
// =========================================================

export interface UpdateBacResponse {
	message: string

	project: ProjectDto
}

// =========================================================
// 🔹 GET ALL PARAMS
// =========================================================

export interface GetAllProjectsParams {
	page?: number

	per_page?: number

	only_visible?: boolean

	// =========================
	// FILTERS
	// =========================

	search?: string

	client?: string

	status?: string

	code?: string
}

// =========================================================
// 🔹 INTERFACE
// =========================================================

export interface ProyectViewInterface {
	getAll(params?: GetAllProjectsParams): Promise<ProjectPaginatedResponse>

	getEvm(): Promise<ProjectPaginatedResponse>

	getById(id: number): Promise<ProjectDto>

	getProjectHours(id: number): Promise<ProjectHoursResponseDto>

	updateBac(id: number, data: UpdateBacDto): Promise<UpdateBacResponse>

	recalculateHours(id: number): Promise<RecalculateHoursResponse>
}
