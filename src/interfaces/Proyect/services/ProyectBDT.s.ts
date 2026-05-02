// services/ProyectBDT.s.ts

import { ProyectInterface } from '../models/IProyect.m'
import {
	ProjectIntakeRecordDto,
	CreateProjectIntakeDto,
	UpdateProjectIntakeDto,
	ProjectIntakeStatusRefDto,
	ProjectIntakeCategoryRefDto,
	ProjectIntakeTypeRefDto,
} from '../models/ProyectDTO.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

const BASE_URL = import.meta.env.VITE_API_URL
const ENDPOINT = `${BASE_URL}/project-intakes`
const STORAGE_KEY = 'authUser'

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

const authHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
	const token = localStorage.getItem(STORAGE_KEY)
	return token ? { Authorization: `Bearer ${token}`, ...extra } : { ...extra }
}

export class ProyectBDT implements ProyectInterface {
	// ==========================
	// 🔹 LIST
	// ==========================
	async list(): Promise<ProjectIntakeRecordDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] list()')

		try {
			const res = await fetch(`${ENDPOINT}?per_page=1000`, { headers: authHeaders() })

			if (!res.ok) {
				const err = new Error(`Error fetching projects (status=${res.status})`)
				logger.errorTag(LogTag.Adapter, err)
				throw err
			}

			const json = (await res.json()) as { success: boolean; data: ProjectIntakeRecordDto[] }

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] list success -> count=${json.data.length}`)

			return json.data
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	// ==========================
	// 🔹 GET BY ID
	// ==========================
	async getById(id: number): Promise<ProjectIntakeRecordDto | null> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] getById -> id=${id}`)

		try {
			const res = await fetch(`${ENDPOINT}/${id}`, { headers: authHeaders() })

			if (!res.ok) {
				logger.warnTag(LogTag.Adapter, `[PROYECT][BDT] getById not found -> id=${id}`)
				return null
			}

			const json = (await res.json()) as { success: boolean; data: ProjectIntakeRecordDto }

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] getById success -> id=${id}`)

			return json.data
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	// ==========================
	// 🔹 CREATE
	// ==========================
	async create(data: CreateProjectIntakeDto): Promise<ProjectIntakeRecordDto> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] create', data)

		try {
			const res = await fetch(ENDPOINT, {
				method: 'POST',
				headers: authHeaders({ 'Content-Type': 'application/json' }),
				body: JSON.stringify(data),
			})

			if (!res.ok) {
				const err = new Error(`Error creating project (status=${res.status})`)
				logger.errorTag(LogTag.Adapter, err)
				throw err
			}

			const json = (await res.json()) as { success: boolean; data: ProjectIntakeRecordDto }

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] created -> id=${json.data.id}`)

			return json.data
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	// ==========================
	// 🔹 UPDATE
	// ==========================
	async update(id: number, data: UpdateProjectIntakeDto): Promise<ProjectIntakeRecordDto> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] update -> id=${id}`, data)

		try {
			const res = await fetch(`${ENDPOINT}/${id}`, {
				method: 'PUT',
				headers: authHeaders({ 'Content-Type': 'application/json' }),
				body: JSON.stringify(data),
			})

			if (!res.ok) {
				const err = new Error(`Error updating project (status=${res.status})`)
				logger.errorTag(LogTag.Adapter, err)
				throw err
			}

			const json = (await res.json()) as { success: boolean; data: ProjectIntakeRecordDto }

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] updated -> id=${id}`)

			return json.data
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	// ==========================
	// 🔹 DELETE (baja lógica)
	// ==========================
	async delete(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] delete -> id=${id}`)

		try {
			const res = await fetch(`${ENDPOINT}/${id}`, {
				method: 'DELETE',
				headers: authHeaders(),
			})

			if (!res.ok) {
				const err = new Error(`Error deleting project (status=${res.status})`)
				logger.errorTag(LogTag.Adapter, err)
				throw err
			}

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] deleted -> id=${id}`)
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	// ==========================
	// 🔹 REFS — un solo endpoint /options
	// ==========================
	private async fetchOptions(): Promise<{ types: ProjectIntakeTypeRefDto[]; categories: ProjectIntakeCategoryRefDto[]; statuses: ProjectIntakeStatusRefDto[] }> {
		const res = await fetch(`${ENDPOINT}/options`, { headers: authHeaders() })

		if (!res.ok) {
			throw new Error(`Error fetching options (status=${res.status})`)
		}

		const json = (await res.json()) as {
			success: boolean
			data: {
				types: ProjectIntakeTypeRefDto[]
				categories: ProjectIntakeCategoryRefDto[]
				statuses: ProjectIntakeStatusRefDto[]
			}
		}

		return json.data
	}

	async getStatuses(): Promise<ProjectIntakeStatusRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] getStatuses()')
		try {
			const { statuses } = await this.fetchOptions()
			return statuses
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async getCategories(): Promise<ProjectIntakeCategoryRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] getCategories()')
		try {
			const { categories } = await this.fetchOptions()
			return categories
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async getTypes(): Promise<ProjectIntakeTypeRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] getTypes()')
		try {
			const { types } = await this.fetchOptions()
			return types
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}
}
