// services/ProyectMock.s.ts

import { ProyectInterface } from '../models/IProyect.m'
import {
	ProjectIntakeRecordDto,
	CreateProjectIntakeDto,
	UpdateProjectIntakeDto,
	ProjectIntakeStatusRefDto,
	ProjectIntakeCategoryRefDto,
	ProjectIntakeTypeRefDto,
} from '../models/ProyectDTO.m'

import mockData from './mocks/proyects.mock.json'
import statusesJson from './mocks/proyect-statuses.mock.json'
import categoriesJson from './mocks/proyect-categories.mock.json'
import typesJson from './mocks/proyect-types.mock.json'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

// ==========================
// 🔥 NORMALIZACIÓN SEGURA
// ==========================
const initialData = mockData as unknown as ProjectIntakeRecordDto[]
const statusesData = statusesJson as unknown as ProjectIntakeStatusRefDto[]
const categoriesData = categoriesJson as unknown as ProjectIntakeCategoryRefDto[]
const typesData = typesJson as unknown as ProjectIntakeTypeRefDto[]

export class ProyectMock implements ProyectInterface {
	private data: ProjectIntakeRecordDto[] = [...initialData]

	// ==========================
	// 🔹 LIST
	// ==========================
	async list(): Promise<ProjectIntakeRecordDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][MOCK] list()')
		return [...this.data]
	}

	// ==========================
	// 🔹 GET BY ID
	// ==========================
	async getById(id: number): Promise<ProjectIntakeRecordDto | null> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] getById -> id=${id}`)
		return this.data.find((p) => p.id === id) ?? null
	}

	// ==========================
	// 🔹 CREATE
	// ==========================
	async create(data: CreateProjectIntakeDto): Promise<ProjectIntakeRecordDto> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][MOCK] create', data)

		const newItem: ProjectIntakeRecordDto = {
			id: Date.now(),

			projectType: data.projectType,
			projectName: data.projectName,

			secondaryProjectNumber: data.secondaryProjectNumber ?? null,
			registrationDate: data.registrationDate ?? null,
			clientId: data.clientId ?? null,

			categoryCode: data.categoryCode ?? null,
			projectStatusCode: data.projectStatusCode ?? null,

			businessStatusDate: data.businessStatusDate ?? null,
			estimatedEndDate: data.estimatedEndDate ?? null,
			actualEndDate: data.actualEndDate ?? null,

			commercialStatus: data.commercialStatus ?? null,
			leaderName: data.leaderName ?? null,
			observations: data.observations ?? null,

			requiresClockifyCreation: data.requiresClockifyCreation ?? false,
			isActive: true,

			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),

			internalProjectNumber: null,
			clientName: null,
			clockifyRecordId: null,
			createdBy: null,
			updatedBy: null,

			typeRef: null,
			categoryRef: null,
			statusRef: null,

			clockifyProjectName: null,
		}

		this.data.push(newItem)

		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] created -> id=${newItem.id}`)

		return newItem
	}

	// ==========================
	// 🔹 UPDATE
	// ==========================
	async update(id: number, data: UpdateProjectIntakeDto): Promise<ProjectIntakeRecordDto> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] update -> id=${id}`, data)

		const index = this.data.findIndex((p) => p.id === id)

		if (index === -1) {
			const err = new Error(`Project not found -> id=${id}`)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}

		const updated: ProjectIntakeRecordDto = {
			...this.data[index],

			secondaryProjectNumber: data.secondaryProjectNumber ?? this.data[index].secondaryProjectNumber,
			registrationDate: data.registrationDate ?? this.data[index].registrationDate,
			clientId: data.clientId ?? this.data[index].clientId,

			projectName: data.projectName ?? this.data[index].projectName,
			categoryCode: data.categoryCode ?? this.data[index].categoryCode,
			projectStatusCode: data.projectStatusCode ?? this.data[index].projectStatusCode,

			businessStatusDate: data.businessStatusDate ?? this.data[index].businessStatusDate,
			estimatedEndDate: data.estimatedEndDate ?? this.data[index].estimatedEndDate,
			actualEndDate: data.actualEndDate ?? this.data[index].actualEndDate,

			commercialStatus: data.commercialStatus ?? this.data[index].commercialStatus,
			leaderName: data.leaderName ?? this.data[index].leaderName,
			observations: data.observations ?? this.data[index].observations,

			updatedAt: new Date().toISOString(),
		}

		this.data[index] = updated

		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] updated -> id=${id}`)

		return updated
	}

	// ==========================
	// 🔹 DELETE
	// ==========================
	async delete(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] delete -> id=${id}`)

		this.data = this.data.filter((p) => p.id !== id)

		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] deleted -> id=${id}`)
	}

	// ==========================
	// 🔹 REFS (DESDE JSON 🔥)
	// ==========================
	async getStatuses(): Promise<ProjectIntakeStatusRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][MOCK] getStatuses()')
		return statusesData
	}

	async getCategories(): Promise<ProjectIntakeCategoryRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][MOCK] getCategories()')
		return categoriesData
	}

	async getTypes(): Promise<ProjectIntakeTypeRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][MOCK] getTypes()')
		return typesData
	}
}
