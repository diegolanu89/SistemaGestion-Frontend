// services/EstimatedProjectBDT.s.ts
//
// Endpoints alineados al back (PotencialProjectsController + PotencialClientsController).
// El back devuelve C# DTOs en camelCase y anonymous objects en snake_case según
// cómo estén escritos. Acá hacemos la conversión mínima al shape PascalCase del front
// solo donde hace falta (PotencialProject → EstimatedProjectRecordDto).

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

const BASE_URL = import.meta.env.VITE_API_URL

/** Misma key que usa LoginBDT (Login/models/Configuration.m.ts → STORAGE_KEY). */
const TOKEN_STORAGE_KEY = 'authUser'

/** fetch envuelto que mete `Authorization: Bearer <token>` cuando hay token guardado. */
const authFetch = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY)
	const headers = new Headers(init?.headers ?? {})
	if (token) headers.set('Authorization', `Bearer ${token}`)
	return fetch(input, { ...init, headers })
}

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

// ==========================
// 🔹 Wire DTOs (lo que viene del back en JSON)
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
// 🔹 Mappers wire → front (PascalCase)
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
			byUser.set(key, { UserId: a.user_id, UserName: a.user_name, MonthlyHours: {} })
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
	// 🔹 LIST — combina GET /potencial-projects con GET /{id}/allocations (N+1)
	// ==========================
	async list(): Promise<EstimatedProjectRecordDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] list()')

		try {
			const res = await authFetch(`${BASE_URL}/potencial-projects`)
			if (!res.ok) throw new Error(`Error fetching potencial-projects (status=${res.status})`)
			const wireProjects = (await res.json()) as PotencialProjectWire[]

			// N+1: hasta que el back exponga un endpoint con summary embebido.
			const enriched = await Promise.all(
				wireProjects.map(async (p) => {
					const allocations = await this.getAllocations(p.id)
					return mapProject(p, allocations)
				}),
			)
			return enriched
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async getById(id: number): Promise<EstimatedProjectRecordDto | null> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] getById -> id=${id}`)

		try {
			const res = await authFetch(`${BASE_URL}/potencial-projects/${id}`)
			if (res.status === 404) return null
			if (!res.ok) throw new Error(`Error fetching potencial-project (status=${res.status})`)
			const wireProject = (await res.json()) as PotencialProjectWire
			const allocations = await this.getAllocations(id)
			return mapProject(wireProject, allocations)
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	// ==========================
	// 🔹 CREATE (cadena: cliente → proyecto → allocations)
	// ==========================
	async create(data: CreateEstimatedProjectDto): Promise<EstimatedProjectRecordDto> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] create', data)

		try {
			// 1. resolver cliente
			let clientId = data.ClientId ?? null
			if (data.NewClientName?.trim()) {
				const newClient = await this.createClient(data.NewClientName.trim())
				clientId = newClient.Id
			}
			if (!clientId) throw new Error('PotencialClientId es obligatorio')

			// 2. crear proyecto
			const projectRes = await authFetch(`${BASE_URL}/potencial-projects`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: data.Name, code: data.Code ?? null, potencialClientId: clientId }),
			})
			if (!projectRes.ok) throw new Error(`Error creating potencial-project (status=${projectRes.status})`)
			const wireProject = (await projectRes.json()) as PotencialProjectWire

			// 3. allocations
			const entries = this.resourcesToEntries(data.Resources)
			const allocations = await this.saveAllocations(wireProject.id, entries)

			return mapProject(wireProject, allocations)
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

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

			const res = await authFetch(`${BASE_URL}/potencial-projects/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			if (!res.ok) throw new Error(`Error updating potencial-project (status=${res.status})`)
			const wireProject = (await res.json()) as PotencialProjectWire

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

	async delete(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][BDT] delete (físico) -> id=${id}`)

		try {
			const res = await authFetch(`${BASE_URL}/potencial-projects/${id}`, { method: 'DELETE' })
			if (!res.ok) throw new Error(`Error deleting potencial-project (status=${res.status})`)
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
			const res = await authFetch(`${BASE_URL}/potencial-projects/${projectId}/allocations`)
			if (!res.ok) throw new Error(`Error fetching allocations (status=${res.status})`)
			const json = (await res.json()) as { allocations: AllocationWireDto[] }
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
			const res = await authFetch(`${BASE_URL}/potencial-projects/${projectId}/allocations`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ entries }),
			})
			if (!res.ok) throw new Error(`Error saving allocations (status=${res.status})`)
			const json = (await res.json()) as { allocations: AllocationWireDto[] }
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
			const res = await authFetch(`${BASE_URL}/potencial-projects/validate-capacity`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(req),
			})
			if (!res.ok) throw new Error(`Error validating capacity (status=${res.status})`)
			return (await res.json()) as ValidateCapacityResponseDto
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
		logger.infoTag(
			LogTag.Adapter,
			`[ESTIMATED-PROYECT][BDT] getCapacityLimits -> users=${req.userNames.length} months=${req.monthKeys.length} excludeId=${req.potencialProjectId ?? '-'}`,
		)

		try {
			const res = await authFetch(`${BASE_URL}/potencial-projects/capacity-limits`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(req),
			})
			if (!res.ok) throw new Error(`Error fetching capacity limits (status=${res.status})`)
			return (await res.json()) as CapacityLimitsResponseDto
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	// ==========================
	// 🔹 REFS
	// ==========================
	async getClients(): Promise<ClientRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] getClients()')

		try {
			const res = await authFetch(`${BASE_URL}/potencial-clients`)
			if (!res.ok) throw new Error(`Error fetching potencial-clients (status=${res.status})`)
			const wire = (await res.json()) as PotencialClientWire[]
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
			const res = await authFetch(`${BASE_URL}/potencial-clients`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name }),
			})
			if (!res.ok) throw new Error(`Error creating potencial-client (status=${res.status})`)
			const wire = (await res.json()) as PotencialClientWire
			return mapClient(wire)
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async getUsers(): Promise<UserRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][BDT] getUsers()')

		try {
			const res = await authFetch(`${BASE_URL}/users`)
			if (!res.ok) throw new Error(`Error fetching users (status=${res.status})`)
			const wire = (await res.json()) as Array<{ id: number; name: string; email: string }>
			// El back filtra por Active = true del lado server (ClockifyUsersListController),
			// así que asumimos IsActive = true para todos los que vienen.
			return wire.map((u) => ({ Id: u.id, Username: u.email, FullName: u.name, IsActive: true }))
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	// ==========================
	// 🔹 helpers
	// ==========================
	private resourcesToEntries(resources: EstimatedResourceDto[]): AllocationEntryDto[] {
		const entries: AllocationEntryDto[] = []
		for (const r of resources) {
			for (const [monthKey, hours] of Object.entries(r.MonthlyHours)) {
				if (hours <= 0) continue
				entries.push({
					monthKey,
					monthLabel: monthKey,
					userId: r.UserId,
					userName: r.UserName,
					hours,
				})
			}
		}
		return entries
	}
}
