// services/EstimatedProjectBDT.s.ts

import { EstimatedProjectInterface } from '../models/IEstimatedProject.m'
import {
	EstimatedProjectRecordDto,
	CreateEstimatedProjectDto,
	UpdateEstimatedProjectDto,
	ClientRefDto,
	UserRefDto,
} from '../models/EstimatedProjectDTO.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

const BASE_URL = import.meta.env.VITE_API_URL

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class EstimatedProjectBDT implements EstimatedProjectInterface {
	async list(): Promise<EstimatedProjectRecordDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] list()')

		try {
			const res = await fetch(`${BASE_URL}/estimated-projects`)
			if (!res.ok) throw new Error(`Error fetching estimated projects (status=${res.status})`)
			return (await res.json()) as EstimatedProjectRecordDto[]
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async getById(id: number): Promise<EstimatedProjectRecordDto | null> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] getById -> id=${id}`)

		try {
			const res = await fetch(`${BASE_URL}/estimated-projects/${id}`)
			if (!res.ok) return null
			return (await res.json()) as EstimatedProjectRecordDto
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async create(data: CreateEstimatedProjectDto): Promise<EstimatedProjectRecordDto> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] create', data)

		try {
			const res = await fetch(`${BASE_URL}/estimated-projects`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			if (!res.ok) throw new Error(`Error creating estimated project (status=${res.status})`)
			return (await res.json()) as EstimatedProjectRecordDto
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async update(id: number, data: UpdateEstimatedProjectDto): Promise<EstimatedProjectRecordDto> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] update -> id=${id}`)

		try {
			const res = await fetch(`${BASE_URL}/estimated-projects/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			if (!res.ok) throw new Error(`Error updating estimated project (status=${res.status})`)
			return (await res.json()) as EstimatedProjectRecordDto
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async delete(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] delete -> id=${id}`)

		try {
			const res = await fetch(`${BASE_URL}/estimated-projects/${id}`, { method: 'DELETE' })
			if (!res.ok) throw new Error(`Error deleting estimated project (status=${res.status})`)
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async getClients(): Promise<ClientRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] getClients()')

		try {
			const res = await fetch(`${BASE_URL}/clients`)
			if (!res.ok) throw new Error(`Error fetching clients (status=${res.status})`)
			return (await res.json()) as ClientRefDto[]
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async getUsers(): Promise<UserRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] getUsers()')

		try {
			const res = await fetch(`${BASE_URL}/users`)
			if (!res.ok) throw new Error(`Error fetching users (status=${res.status})`)
			return (await res.json()) as UserRefDto[]
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}
}
