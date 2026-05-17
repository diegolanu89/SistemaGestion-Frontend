import { ProyectInterface } from '../models/IProyect.m'

import {
	ProjectIntakeRecordDto,
	CreateProjectIntakeDto,
	UpdateProjectIntakeDto,
	ProjectIntakeStatusRefDto,
	ProjectIntakeCategoryRefDto,
	ProjectIntakeTypeRefDto,
	ProjectIntakeClientRefDto,
	ProjectIntakeLeaderRefDto,
	PaginatedProjectIntakeResponseDto,
} from '../models/ProyectDTO.m'

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

import { HttpClient } from '../../base/services/HttpClient.s'

import {
	ProjectIntakeRecordWire,
	mapRecord,
	ProjectIntakeTypeRefWire,
	ProjectIntakeCategoryRefWire,
	ProjectIntakeStatusRefWire,
	mapCategoryRef,
	mapStatusRef,
	mapTypeRef,
} from '../models/ProyectIntakes.m'

import { ProyectOptions } from '../models/IProyect.m'

const BASE_URL = import.meta.env.VITE_API_URL

const ENDPOINT = `${BASE_URL}/project-intakes`

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class ProyectBDT implements ProyectInterface {
	// ==========================
	// LIST
	// ==========================

	async list(page: number = 1, perPage: number = 10): Promise<PaginatedProjectIntakeResponseDto> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] list() -> page=${page} perPage=${perPage}`)

		try {
			const json = await HttpClient.request<{
				success: boolean

				data: ProjectIntakeRecordWire[]

				current_page: number

				per_page: number

				total: number

				last_page: number
			}>(`${ENDPOINT}?page=${page}&per_page=${perPage}`)

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] list success -> count=${json.data.length}`)

			return {
				data: json.data.map(mapRecord),

				currentPage: json.current_page,

				perPage: json.per_page,

				total: json.total,

				lastPage: json.last_page,
			}
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// GET BY ID
	// ==========================

	async getById(id: number): Promise<ProjectIntakeRecordDto | null> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] getById -> id=${id}`)

		try {
			const json = await HttpClient.request<{
				success: boolean
				data: ProjectIntakeRecordWire
			}>(`${ENDPOINT}/${id}`)

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] getById success -> id=${id}`)

			return mapRecord(json.data)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			return null
		}
	}

	// ==========================
	// CREATE
	// ==========================

	async create(data: CreateProjectIntakeDto): Promise<ProjectIntakeRecordDto> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] create', data)

		try {
			const json = await HttpClient.request<{
				success: boolean
				data: ProjectIntakeRecordWire
			}>(ENDPOINT, {
				method: 'POST',

				body: JSON.stringify(data),
			})

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] created -> id=${json.data.id}`)

			return mapRecord(json.data)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// UPDATE
	// ==========================

	async update(id: number, data: UpdateProjectIntakeDto): Promise<ProjectIntakeRecordDto> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] update -> id=${id}`, data)

		try {
			const json = await HttpClient.request<{
				success: boolean
				data: ProjectIntakeRecordWire
			}>(`${ENDPOINT}/${id}`, {
				method: 'PUT',

				body: JSON.stringify(data),
			})

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] updated -> id=${id}`)

			return mapRecord(json.data)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// DELETE
	// ==========================

	async delete(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] delete -> id=${id}`)

		try {
			await HttpClient.request<void>(`${ENDPOINT}/${id}`, {
				method: 'DELETE',
			})

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] deleted -> id=${id}`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// OPTIONS
	// ==========================

	// ==========================
	// OPTIONS (única llamada)
	// ==========================

	async getOptions(): Promise<ProyectOptions> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] getOptions()')

		try {
			const json = await HttpClient.request<{
				success: boolean
				data: {
					types: ProjectIntakeTypeRefWire[]
					categories: ProjectIntakeCategoryRefWire[]
					statuses: ProjectIntakeStatusRefWire[]
					clients: Array<{ id: number; name: string; externalId?: string | null }>
					leaders: Array<{ id: number; name: string; email: string }>
				}
			}>(`${ENDPOINT}/options`)

			return {
				types: json.data.types.map(mapTypeRef),
				categories: json.data.categories.map(mapCategoryRef),
				statuses: json.data.statuses.map(mapStatusRef),
				clients: json.data.clients.map((c): ProjectIntakeClientRefDto => ({
					Id: c.id,
					Name: c.name,
					ExternalId: c.externalId ?? null,
				})),
				leaders: json.data.leaders.map((l): ProjectIntakeLeaderRefDto => ({
					Id: l.id,
					Name: l.name,
					Email: l.email,
				})),
			}
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async getStatuses(): Promise<ProjectIntakeStatusRefDto[]> {
		return (await this.getOptions()).statuses
	}

	async getCategories(): Promise<ProjectIntakeCategoryRefDto[]> {
		return (await this.getOptions()).categories
	}

	async getTypes(): Promise<ProjectIntakeTypeRefDto[]> {
		return (await this.getOptions()).types
	}

	// ==========================
	// NEXT NUMBER
	// ==========================

	async getNextNumber(typeCode: string): Promise<string> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] getNextNumber -> type=${typeCode}`)

		try {
			const json = await HttpClient.request<{
				success: boolean
				data: { nextNumber: string }
			}>(`${ENDPOINT}/next-number?type=${typeCode}`)

			return json.data.nextNumber
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}
}
