// services/interfaces/ProyectViewInterface.ts

import { ProjectDto, UpdateBacDto } from './ProyectViewDTO.m'

// 🔹 respuesta paginada EXACTA del backend

export interface ProjectPaginatedResponse {
	data: ProjectDto[]

	current_page: number

	per_page: number

	total: number

	last_page: number

	from: number

	to: number
}

export interface RecalculateHoursResponse {
	message: string

	updated: number

	total_entries: number
}

export interface UpdateBacResponse {
	message: string

	project: ProjectDto
}

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

export interface ProyectViewInterface {
	getAll(params?: GetAllProjectsParams): Promise<ProjectPaginatedResponse>

	getEvm(): Promise<ProjectPaginatedResponse>

	getById(id: number): Promise<ProjectDto>

	updateBac(id: number, data: UpdateBacDto): Promise<UpdateBacResponse>

	recalculateHours(id: number): Promise<RecalculateHoursResponse>
}
