// services/EstimatedProjectBDT.s.ts
//
// Endpoints alineados al back (PotencialProjectsController + PotencialClientsController).
// Seguridad unificada mediante HttpClient + credentials: include.
//

import { EstimatedProjectInterface } from '../models/IEstimatedProject.m'

import {
	EstimatedProjectRecordDto,
	EstimatedResourceDto,
	CreateEstimatedProjectDto,
	UpdateEstimatedProjectDto,
	ClientRefDto,
	UserRefDto,
	CapacityLimitsRequestDto,
	CapacityLimitsResponseDto,
	ValidateCapacityRequestDto,
	ValidateCapacityResponseDto,
	AllocationEntryDto,
	AllocationWireDto,
} from '../models/EstimatedProjectDTO.m'

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

import { HttpClient } from '../../base/services/HttpClient.s'

const BASE_URL = import.meta.env.VITE_API_URL

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

// ==========================
// 🔹 Wire DTOs
// ==========================

interface PotencialProjectWire {
	id: number
	name: string
	code: string | null
	clientId: number | null
	clientName: string | null
}

interface PotencialClientWire {
	id: number
	name: string
	createdAt?: string | null
	updatedAt?: string | null
}

// ==========================
// 🔹 MAPPERS
// ==========================

const mapClient = (w: PotencialClientWire): ClientRefDto => ({
	Id: w.id,
	Name: w.name,
	CreatedAt: w.createdAt ?? null,
	UpdatedAt: w.updatedAt ?? null,
})

const groupResources = (allocations: AllocationWireDto[]): EstimatedResourceDto[] => {
	const byUser = new Map<string, EstimatedResourceDto>()

	for (const a of allocations) {
		const key = `${a.user_id ?? 'null'}-${a.user_name}`

		if (!byUser.has(key)) {
			byUser.set(key, {
				UserId: a.user_id,
				UserName: a.user_name,
				MonthlyHours: {},
			})
		}

		byUser.get(key)!.MonthlyHours[a.month_key] = (byUser.get(key)!.MonthlyHours[a.month_key] ?? 0) + a.hours
	}

	return [...byUser.values()]
}

const mapProject = (w: PotencialProjectWire, allocations: AllocationWireDto[]): EstimatedProjectRecordDto => ({
	Id: w.id,
	Name: w.name,
	Code: w.code,
	ClientId: w.clientId,
	ClientName: w.clientName,
	Resources: groupResources(allocations),
})

// ==========================
// 🔹 BDT
// ==========================

export class EstimatedProjectBDT implements EstimatedProjectInterface {
	// ==========================
	// 🔹 LIST
	// ==========================

	async list(): Promise<EstimatedProjectRecordDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] list()')

		try {
			const wireProjects = await HttpClient.request<PotencialProjectWire[]>(`${BASE_URL}/potencial-projects`)

			const enriched = await Promise.all(
				wireProjects.map(async (p) => {
					const allocations = await this.getAllocations(p.id)

					return mapProject(p, allocations)
				})
			)

			return enriched
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 GET BY ID
	// ==========================

	async getById(id: number): Promise<EstimatedProjectRecordDto | null> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] getById -> id=${id}`)

		try {
			const wireProject = await HttpClient.request<PotencialProjectWire>(`${BASE_URL}/potencial-projects/${id}`)

			const allocations = await this.getAllocations(id)

			return mapProject(wireProject, allocations)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			return null
		}
	}

	// ==========================
	// 🔹 CREATE
	// ==========================

	async create(data: CreateEstimatedProjectDto): Promise<EstimatedProjectRecordDto> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] create', data)

		try {
			let clientId = data.ClientId ?? null

			if (data.NewClientName?.trim()) {
				const newClient = await this.createClient(data.NewClientName.trim())

				clientId = newClient.Id
			}

			if (!clientId) {
				throw new Error('PotencialClientId es obligatorio')
			}

			const wireProject = await HttpClient.request<PotencialProjectWire>(`${BASE_URL}/potencial-projects`, {
				method: 'POST',

				body: JSON.stringify({
					name: data.Name,
					code: data.Code ?? null,
					potencialClientId: clientId,
				}),
			})

			const entries = this.resourcesToEntries(data.Resources)

			const allocations = await this.saveAllocations(wireProject.id, entries)

			return mapProject(wireProject, allocations)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 UPDATE
	// ==========================

	async update(id: number, data: UpdateEstimatedProjectDto): Promise<EstimatedProjectRecordDto> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] update -> id=${id}`)

		try {
			let clientId = data.ClientId ?? null

			if (data.NewClientName?.trim()) {
				const newClient = await this.createClient(data.NewClientName.trim())

				clientId = newClient.Id
			}

			const body: Record<string, unknown> = {}

			if (data.Name !== undefined) body.name = data.Name
			if (data.Code !== undefined) body.code = data.Code
			if (clientId !== null) body.potencialClientId = clientId

			const wireProject = await HttpClient.request<PotencialProjectWire>(`${BASE_URL}/potencial-projects/${id}`, {
				method: 'PUT',

				body: JSON.stringify(body),
			})

			let allocations: AllocationWireDto[]

			if (data.Resources) {
				const entries = this.resourcesToEntries(data.Resources)

				allocations = await this.saveAllocations(id, entries)
			} else {
				allocations = await this.getAllocations(id)
			}

			return mapProject(wireProject, allocations)
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
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] delete -> id=${id}`)

		try {
			await HttpClient.request<void>(`${BASE_URL}/potencial-projects/${id}`, {
				method: 'DELETE',
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 ALLOCATIONS
	// ==========================

	async getAllocations(projectId: number): Promise<AllocationWireDto[]> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] getAllocations -> id=${projectId}`)

		try {
			const json = await HttpClient.request<{
				allocations: AllocationWireDto[]
			}>(`${BASE_URL}/potencial-projects/${projectId}/allocations`)

			return json.allocations
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async saveAllocations(projectId: number, entries: AllocationEntryDto[]): Promise<AllocationWireDto[]> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] saveAllocations -> id=${projectId} entries=${entries.length}`)

		try {
			const json = await HttpClient.request<{
				allocations: AllocationWireDto[]
			}>(`${BASE_URL}/potencial-projects/${projectId}/allocations`, {
				method: 'POST',

				body: JSON.stringify({
					Entries: entries,
				}),
			})

			return json.allocations
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 VALIDATE CAPACITY
	// ==========================

	async validateCapacity(req: ValidateCapacityRequestDto): Promise<ValidateCapacityResponseDto> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] validateCapacity -> entries=${req.entries.length}`)

		try {
			return await HttpClient.request<ValidateCapacityResponseDto>(`${BASE_URL}/potencial-projects/validate-capacity`, {
				method: 'POST',

				body: JSON.stringify(req),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 CAPACITY LIMITS
	// ==========================

	async getCapacityLimits(req: CapacityLimitsRequestDto): Promise<CapacityLimitsResponseDto> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] getCapacityLimits`)

		try {
			return await HttpClient.request<CapacityLimitsResponseDto>(`${BASE_URL}/potencial-projects/capacity-limits`, {
				method: 'POST',

				body: JSON.stringify(req),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 CLIENTS
	// ==========================

	async getClients(): Promise<ClientRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] getClients()')

		try {
			const wire = await HttpClient.request<PotencialClientWire[]>(`${BASE_URL}/potencial-clients`)

			return wire.map(mapClient)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async createClient(name: string): Promise<ClientRefDto> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] createClient -> ${name}`)

		try {
			const wire = await HttpClient.request<PotencialClientWire>(`${BASE_URL}/potencial-clients`, {
				method: 'POST',

				body: JSON.stringify({
					name,
				}),
			})

			return mapClient(wire)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 USERS
	// ==========================

	async getUsers(): Promise<UserRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] getUsers()')

		try {
			const wire = await HttpClient.request<
				Array<{
					id: number
					name: string
					email: string
				}>
			>(`${BASE_URL}/users`)

			return wire.map((u) => ({
				Id: u.id,
				Username: u.email,
				FullName: u.name,
				IsActive: true,
			}))
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 HELPERS
	// ==========================

	private resourcesToEntries(resources: EstimatedResourceDto[]): AllocationEntryDto[] {
		const entries: AllocationEntryDto[] = []

		for (const r of resources) {
			for (const [monthKey, hours] of Object.entries(r.MonthlyHours)) {
				if (hours <= 0) continue

				entries.push({
					MonthKey: monthKey,

					MonthLabel: monthKey,

					UserId: r.UserId,

					UserName: r.UserName,

					Hours: hours,
				})
			}
		}

		return entries
	}
}
