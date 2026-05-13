import { ProyectInterface } from '../models/IProyect.m'

import {
	ProjectIntakeRecordDto,
	CreateProjectIntakeDto,
	UpdateProjectIntakeDto,
	ProjectIntakeStatusRefDto,
	ProjectIntakeCategoryRefDto,
	ProjectIntakeTypeRefDto,
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

	private async fetchOptions(): Promise<{
		types: ProjectIntakeTypeRefDto[]
		categories: ProjectIntakeCategoryRefDto[]
		statuses: ProjectIntakeStatusRefDto[]
	}> {
		const json = await HttpClient.request<{
			success: boolean
			data: {
				types: ProjectIntakeTypeRefWire[]
				categories: ProjectIntakeCategoryRefWire[]
				statuses: ProjectIntakeStatusRefWire[]
			}
		}>(`${ENDPOINT}/options`)

		return {
			types: json.data.types.map(mapTypeRef),

			categories: json.data.categories.map(mapCategoryRef),

			statuses: json.data.statuses.map(mapStatusRef),
		}
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
