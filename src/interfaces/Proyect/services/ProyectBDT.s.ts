// services/ProyectBDT.s.ts
//
// Convención de casing:
//   - Wire* interfaces: camelCase exacto del JSON que emite .NET
//   - DTOs de consumo interno: PascalCase (definidos en ProyectDTO.m.ts)

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

// ==========================
// Wire types (camelCase — lo que envía .NET)
// ==========================

interface ProjectIntakeTypeRefWire {
	id: number
	code: string
	label: string
	description?: string
	internalLabel: string
	secondaryLabel: string
	registrationLabel: string
	requiresBusinessStatusDate: boolean
	requiresActualEndDate: boolean
	requiresCommercialFields: boolean
	isActive: boolean
}

interface ProjectIntakeCategoryRefWire {
	id: number
	code: string
	label: string
	description?: string
	isActive: boolean
}

interface ProjectIntakeStatusRefWire {
	id: number
	code: string
	label: string
	description?: string
	isActive: boolean
}

interface ProjectIntakeRecordWire {
	id: number
	projectType?: string | null
	internalProjectNumber?: string | null
	secondaryProjectNumber?: string | null
	registrationDate?: string | null
	clientId?: number | null
	clientName?: string | null
	projectName?: string | null
	categoryCode?: string | null
	projectStatusCode?: string | null
	businessStatusDate?: string | null
	estimatedEndDate?: string | null
	actualEndDate?: string | null
	commercialStatus?: string | null
	leaderName?: string | null
	observations?: string | null
	requiresClockifyCreation: boolean
	clockifyRecordId?: number | null
	isActive: boolean
	createdBy?: number | null
	updatedBy?: number | null
	createdAt?: string | null
	updatedAt?: string | null
	typeRef?: ProjectIntakeTypeRefWire | null
	categoryRef?: ProjectIntakeCategoryRefWire | null
	statusRef?: ProjectIntakeStatusRefWire | null
	clockifyProjectName?: string | null
}

// ==========================
// Mappers wire → DTO
// ==========================

const mapTypeRef = (w: ProjectIntakeTypeRefWire): ProjectIntakeTypeRefDto => ({
	Id: w.id,
	Code: w.code,
	Label: w.label,
	Description: w.description,
	InternalLabel: w.internalLabel,
	SecondaryLabel: w.secondaryLabel,
	RegistrationLabel: w.registrationLabel,
	RequiresBusinessStatusDate: w.requiresBusinessStatusDate,
	RequiresActualEndDate: w.requiresActualEndDate,
	RequiresCommercialFields: w.requiresCommercialFields,
	IsActive: w.isActive,
})

const mapCategoryRef = (w: ProjectIntakeCategoryRefWire): ProjectIntakeCategoryRefDto => ({
	Id: w.id,
	Code: w.code,
	Label: w.label,
	Description: w.description,
	IsActive: w.isActive,
})

const mapStatusRef = (w: ProjectIntakeStatusRefWire): ProjectIntakeStatusRefDto => ({
	Id: w.id,
	Code: w.code,
	Label: w.label,
	Description: w.description,
	IsActive: w.isActive,
})

const mapRecord = (w: ProjectIntakeRecordWire): ProjectIntakeRecordDto => ({
	Id: w.id,
	ProjectType: w.projectType ?? null,
	InternalProjectNumber: w.internalProjectNumber ?? null,
	SecondaryProjectNumber: w.secondaryProjectNumber ?? null,
	RegistrationDate: w.registrationDate ?? null,
	ClientId: w.clientId ?? null,
	ClientName: w.clientName ?? null,
	ProjectName: w.projectName ?? null,
	CategoryCode: w.categoryCode ?? null,
	ProjectStatusCode: w.projectStatusCode ?? null,
	BusinessStatusDate: w.businessStatusDate ?? null,
	EstimatedEndDate: w.estimatedEndDate ?? null,
	ActualEndDate: w.actualEndDate ?? null,
	CommercialStatus: w.commercialStatus ?? null,
	LeaderName: w.leaderName ?? null,
	Observations: w.observations ?? null,
	RequiresClockifyCreation: w.requiresClockifyCreation,
	ClockifyRecordId: w.clockifyRecordId ?? null,
	IsActive: w.isActive,
	CreatedBy: w.createdBy ?? null,
	UpdatedBy: w.updatedBy ?? null,
	CreatedAt: w.createdAt ?? null,
	UpdatedAt: w.updatedAt ?? null,
	TypeRef: w.typeRef ? mapTypeRef(w.typeRef) : null,
	CategoryRef: w.categoryRef ? mapCategoryRef(w.categoryRef) : null,
	StatusRef: w.statusRef ? mapStatusRef(w.statusRef) : null,
	ClockifyProjectName: w.clockifyProjectName ?? null,
})

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

			const json = (await res.json()) as { success: boolean; data: ProjectIntakeRecordWire[] }

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] list success -> count=${json.data.length}`)

			return json.data.map(mapRecord)
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

			const json = (await res.json()) as { success: boolean; data: ProjectIntakeRecordWire }

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] getById success -> id=${id}`)

			return mapRecord(json.data)
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

			const json = (await res.json()) as { success: boolean; data: ProjectIntakeRecordWire }

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] created -> id=${json.data.id}`)

			return mapRecord(json.data)
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

			const json = (await res.json()) as { success: boolean; data: ProjectIntakeRecordWire }

			logger.infoTag(LogTag.Adapter, `[PROYECT][BDT] updated -> id=${id}`)

			return mapRecord(json.data)
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
				types: ProjectIntakeTypeRefWire[]
				categories: ProjectIntakeCategoryRefWire[]
				statuses: ProjectIntakeStatusRefWire[]
			}
		}

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
