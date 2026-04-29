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

// 🔥 helper centralizado (clave)
const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class ProyectBDT implements ProyectInterface {
	// ==========================
	// 🔹 LIST
	// ==========================
	async list(): Promise<ProjectIntakeRecordDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] list()')

		try {
			const res = await fetch(`${BASE_URL}/projects`)

			if (!res.ok) {
				const err = new Error(`Error fetching projects (status=${res.status})`)
				logger.errorTag(LogTag.Adapter, err)
				throw err
			}

			const data = (await res.json()) as ProjectIntakeRecordDto[]

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] list success -> count=${data.length}`)

			return data
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
			const res = await fetch(`${BASE_URL}/projects/${id}`)

			if (!res.ok) {
				logger.warnTag(LogTag.Adapter, `[PROYECT][BDT] getById not found -> id=${id}`)
				return null
			}

			const data = (await res.json()) as ProjectIntakeRecordDto

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] getById success -> id=${id}`)

			return data
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
			const res = await fetch(`${BASE_URL}/projects`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})

			if (!res.ok) {
				const err = new Error(`Error creating project (status=${res.status})`)
				logger.errorTag(LogTag.Adapter, err)
				throw err
			}

			const result = (await res.json()) as ProjectIntakeRecordDto

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] created -> id=${result.Id}`)

			return result
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
			const res = await fetch(`${BASE_URL}/projects/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})

			if (!res.ok) {
				const err = new Error(`Error updating project (status=${res.status})`)
				logger.errorTag(LogTag.Adapter, err)
				throw err
			}

			const result = (await res.json()) as ProjectIntakeRecordDto

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] updated -> id=${id}`)

			return result
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
		logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] delete -> id=${id}`)

		try {
			const res = await fetch(`${BASE_URL}/projects/${id}`, {
				method: 'DELETE',
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
	// 🔹 REFS DINÁMICOS
	// ==========================
	async getStatuses(): Promise<ProjectIntakeStatusRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] getStatuses()')

		try {
			const res = await fetch(`${BASE_URL}/projects/statuses`)

			if (!res.ok) {
				throw new Error(`Error fetching statuses (status=${res.status})`)
			}

			return (await res.json()) as ProjectIntakeStatusRefDto[]
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async getCategories(): Promise<ProjectIntakeCategoryRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] getCategories()')

		try {
			const res = await fetch(`${BASE_URL}/projects/categories`)

			if (!res.ok) {
				throw new Error(`Error fetching categories (status=${res.status})`)
			}

			return (await res.json()) as ProjectIntakeCategoryRefDto[]
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async getTypes(): Promise<ProjectIntakeTypeRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][BDT] getTypes()')

		try {
			const res = await fetch(`${BASE_URL}/projects/types`)

			if (!res.ok) {
				throw new Error(`Error fetching types (status=${res.status})`)
			}

			return (await res.json()) as ProjectIntakeTypeRefDto[]
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}
}
