// services/EstimatedProjectMock.s.ts

import { EstimatedProjectInterface } from '../models/IEstimatedProject.m'
import {
	EstimatedProjectRecordDto,
	EstimatedResourceDto,
	CreateEstimatedProjectDto,
	UpdateEstimatedProjectDto,
	ClientRefDto,
	UserRefDto,
	CapacityLimitDto,
	CapacityLimitsMap,
	CapacityLimitsRequestDto,
	CapacityLimitsResponseDto,
	ValidateCapacityRequestDto,
	ValidateCapacityResponseDto,
	ValidateCapacityErrorDto,
	AllocationEntryDto,
	AllocationWireDto,
} from '../models/EstimatedProjectDTO.m'

import projectsJson from './mocks/estimated-projects.mock.json'
import clientsJson from './mocks/clients.mock.json'
import usersJson from './mocks/users.mock.json'
import capacityLimitsJson from './mocks/capacity-limits.mock.json'
import allocationsJson from './mocks/allocations.mock.json'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

// PotencialProjectDto del back, sin Resources (las allocations vienen aparte).
type PotencialProjectMock = Omit<EstimatedProjectRecordDto, 'Resources'>

const initialProjects = projectsJson as unknown as PotencialProjectMock[]
const initialClients = clientsJson as unknown as ClientRefDto[]
const initialUsers = usersJson as unknown as UserRefDto[]
const initialAllocations = allocationsJson as unknown as AllocationWireDto[]
const capacityLimitsData = capacityLimitsJson as unknown as CapacityLimitsMap

/** Fallback alineado al back: si no hay registro en UserMonthlyCapacities ni
 *  WorkingDaysCalendars, devuelve cap = 160. */
const DEFAULT_CAPACITY = 160

const buildDefaultLimit = (capacity: number): CapacityLimitDto => ({
	capacity,
	etc_hours: 0,
	other_potencial_hours: 0,
	available: capacity,
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

export class EstimatedProjectMock implements EstimatedProjectInterface {
	private projects: PotencialProjectMock[] = [...initialProjects]
	private clients: ClientRefDto[] = [...initialClients]
	private allocations: AllocationWireDto[] = [...initialAllocations]
	private nextAllocationId = Math.max(0, ...initialAllocations.map((a) => a.id)) + 1

	// ==========================
	// 🔹 LIST
	// ==========================
	async list(): Promise<EstimatedProjectRecordDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][MOCK] list()')
		return this.projects.map((p) => ({
			...p,
			Resources: groupResources(this.allocations.filter((a) => a.potencial_project_id === p.Id)),
		}))
	}

	// ==========================
	// 🔹 GET BY ID
	// ==========================
	async getById(id: number): Promise<EstimatedProjectRecordDto | null> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] getById -> id=${id}`)
		const found = this.projects.find((p) => p.Id === id)
		if (!found) return null
		return {
			...found,
			Resources: groupResources(this.allocations.filter((a) => a.potencial_project_id === id)),
		}
	}

	// ==========================
	// 🔹 CREATE (cadena: cliente → proyecto → allocations)
	// ==========================
	async create(data: CreateEstimatedProjectDto): Promise<EstimatedProjectRecordDto> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][MOCK] create', data)

		// 1. resolver cliente potencial — crea uno nuevo si vino el name
		let clientId = data.ClientId ?? null
		let clientName: string | null = null

		if (data.NewClientName?.trim()) {
			const newClient = await this.createClient(data.NewClientName.trim())
			clientId = newClient.Id
			clientName = newClient.Name
		} else if (clientId) {
			clientName = this.clients.find((c) => c.Id === clientId)?.Name ?? null
		}

		if (!clientId) {
			const err = new Error('PotencialClientId es obligatorio')
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}

		// 2. crear proyecto
		const newProject: PotencialProjectMock = {
			Id: Date.now(),
			Name: data.Name,
			Code: data.Code ?? null,
			ClientId: clientId,
			ClientName: clientName,
		}
		this.projects.push(newProject)

		// 3. guardar allocations (a partir de Resources)
		const entries = this.resourcesToEntries(data.Resources)
		await this.saveAllocations(newProject.Id, entries)

		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] created -> id=${newProject.Id}`)

		return {
			...newProject,
			Resources: groupResources(this.allocations.filter((a) => a.potencial_project_id === newProject.Id)),
		}
	}

	// ==========================
	// 🔹 UPDATE
	// ==========================
	async update(id: number, data: UpdateEstimatedProjectDto): Promise<EstimatedProjectRecordDto> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] update -> id=${id}`, data)

		const index = this.projects.findIndex((p) => p.Id === id)
		if (index === -1) {
			const err = new Error(`Estimated project not found -> id=${id}`)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}

		const current = this.projects[index]

		// resolver cliente igual que en create
		let clientId = data.ClientId ?? current.ClientId
		let clientName = current.ClientName

		if (data.NewClientName?.trim()) {
			const newClient = await this.createClient(data.NewClientName.trim())
			clientId = newClient.Id
			clientName = newClient.Name
		} else if (data.ClientId && data.ClientId !== current.ClientId) {
			clientName = this.clients.find((c) => c.Id === data.ClientId)?.Name ?? null
		}

		const updated: PotencialProjectMock = {
			...current,
			Name: data.Name ?? current.Name,
			Code: data.Code ?? current.Code,
			ClientId: clientId,
			ClientName: clientName,
		}
		this.projects[index] = updated

		if (data.Resources) {
			const entries = this.resourcesToEntries(data.Resources)
			await this.saveAllocations(id, entries)
		}

		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] updated -> id=${id}`)

		return {
			...updated,
			Resources: groupResources(this.allocations.filter((a) => a.potencial_project_id === id)),
		}
	}

	// ==========================
	// 🔹 DELETE (físico)
	// ==========================
	async delete(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] delete -> id=${id}`)
		this.projects = this.projects.filter((p) => p.Id !== id)
		this.allocations = this.allocations.filter((a) => a.potencial_project_id !== id)
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] deleted -> id=${id}`)
	}

	// ==========================
	// 🔹 ALLOCATIONS
	// ==========================
	async getAllocations(projectId: number): Promise<AllocationWireDto[]> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] getAllocations -> id=${projectId}`)
		return this.allocations.filter((a) => a.potencial_project_id === projectId)
	}

	async saveAllocations(projectId: number, entries: AllocationEntryDto[]): Promise<AllocationWireDto[]> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] saveAllocations -> id=${projectId} entries=${entries.length}`)

		// replace-all: borra existentes
		this.allocations = this.allocations.filter((a) => a.potencial_project_id !== projectId)

		// inserta nuevas (saltea hours <= 0 igual que el back)
		const now = new Date().toISOString()
		for (const e of entries) {
			if (e.hours <= 0) continue
			let userId = e.userId ?? null
			if (!userId && e.userName) {
				userId = initialUsers.find((u) => u.FullName.trim() === e.userName.trim())?.Id ?? null
			}
			this.allocations.push({
				id: this.nextAllocationId++,
				potencial_project_id: projectId,
				month_key: e.monthKey,
				month_label: e.monthLabel,
				user_id: userId,
				user_name: e.userName,
				hours: e.hours,
				role: null,
				role_short: null,
				created_at: now,
				updated_at: now,
			})
		}

		return this.allocations.filter((a) => a.potencial_project_id === projectId)
	}

	// ==========================
	// 🔹 VALIDATE CAPACITY
	// ==========================
	async validateCapacity(req: ValidateCapacityRequestDto): Promise<ValidateCapacityResponseDto> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] validateCapacity -> entries=${req.entries.length}`)

		const errors: ValidateCapacityErrorDto[] = []

		for (const e of req.entries) {
			if (e.hours <= 0) continue
			const limit = capacityLimitsData[e.userName]?.[e.monthKey] ?? buildDefaultLimit(DEFAULT_CAPACITY)
			if (e.hours > limit.available) {
				errors.push({
					user_name: e.userName,
					month_key: e.monthKey,
					month_label: e.monthLabel,
					hours_entered: e.hours,
					capacity: limit.capacity,
					etc_hours: limit.etc_hours,
					other_potencial_hours: limit.other_potencial_hours,
					available: limit.available,
					message: `${e.userName} (${e.monthLabel}): capacidad ${limit.capacity}h, ETC ${limit.etc_hours}h, otros estimados ${limit.other_potencial_hours}h. Quedan ${limit.available}h libres.`,
				})
			}
		}

		return { valid: errors.length === 0, errors }
	}

	// ==========================
	// 🔹 CAPACITY LIMITS
	// ==========================
	async getCapacityLimits(req: CapacityLimitsRequestDto): Promise<CapacityLimitsResponseDto> {
		logger.infoTag(
			LogTag.Adapter,
			`[ESTIMATED-PROYECT][MOCK] getCapacityLimits -> users=${req.userNames.length} months=${req.monthKeys.length} excludeId=${req.potencialProjectId ?? '-'}`,
		)

		const limits: CapacityLimitsMap = {}
		for (const userName of req.userNames) {
			limits[userName] = {}
			for (const monthKey of req.monthKeys) {
				const found = capacityLimitsData[userName]?.[monthKey]
				limits[userName][monthKey] = found ?? buildDefaultLimit(DEFAULT_CAPACITY)
			}
		}
		return { limits }
	}

	// ==========================
	// 🔹 REFS
	// ==========================
	async getClients(): Promise<ClientRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][MOCK] getClients()')
		return [...this.clients]
	}

	async createClient(name: string): Promise<ClientRefDto> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] createClient -> ${name}`)
		const newClient: ClientRefDto = {
			Id: Date.now(),
			Name: name,
			CreatedAt: new Date().toISOString(),
			UpdatedAt: new Date().toISOString(),
		}
		this.clients.push(newClient)
		return newClient
	}

	async getUsers(): Promise<UserRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][MOCK] getUsers()')
		return [...initialUsers]
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
					monthLabel: monthKey, // mock-only: el form va a pasar el label real
					userId: r.UserId,
					userName: r.UserName,
					hours,
				})
			}
		}
		return entries
	}
}
