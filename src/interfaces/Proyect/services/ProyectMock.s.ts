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
		return this.data.find((p) => p.Id === id) ?? null
	}

	// ==========================
	// 🔹 CREATE
	// ==========================
	async create(data: CreateProjectIntakeDto): Promise<ProjectIntakeRecordDto> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][MOCK] create', data)

		const newItem: ProjectIntakeRecordDto = {
			Id: Date.now(),

			ProjectType: data.ProjectType,
			ProjectName: data.ProjectName,

			SecondaryProjectNumber: data.SecondaryProjectNumber ?? null,
			RegistrationDate: data.RegistrationDate ?? null,
			ClientId: data.ClientId ?? null,

			CategoryCode: data.CategoryCode ?? null,
			ProjectStatusCode: data.ProjectStatusCode ?? null,

			BusinessStatusDate: data.BusinessStatusDate ?? null,
			EstimatedEndDate: data.EstimatedEndDate ?? null,
			ActualEndDate: data.ActualEndDate ?? null,

			CommercialStatus: data.CommercialStatus ?? null,
			LeaderName: data.LeaderName ?? null,
			Observations: data.Observations ?? null,

			RequiresClockifyCreation: data.RequiresClockifyCreation ?? false,
			IsActive: true,

			CreatedAt: new Date().toISOString(),
			UpdatedAt: new Date().toISOString(),

			// opcionales
			InternalProjectNumber: null,
			ClientName: null,
			ClockifyRecordId: null,
			CreatedBy: null,
			UpdatedBy: null,

			TypeRef: null,
			CategoryRef: null,
			StatusRef: null,

			ClockifyProjectName: null,
		}

		this.data.push(newItem)

		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] created -> id=${newItem.Id}`)

		return newItem
	}

	// ==========================
	// 🔹 UPDATE
	// ==========================
	async update(id: number, data: UpdateProjectIntakeDto): Promise<ProjectIntakeRecordDto> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] update -> id=${id}`, data)

		const index = this.data.findIndex((p) => p.Id === id)

		if (index === -1) {
			const err = new Error(`Project not found -> id=${id}`)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}

		const updated: ProjectIntakeRecordDto = {
			...this.data[index],

			SecondaryProjectNumber: data.SecondaryProjectNumber ?? this.data[index].SecondaryProjectNumber,
			RegistrationDate: data.RegistrationDate ?? this.data[index].RegistrationDate,
			ClientId: data.ClientId ?? this.data[index].ClientId,

			ProjectName: data.ProjectName ?? this.data[index].ProjectName,
			CategoryCode: data.CategoryCode ?? this.data[index].CategoryCode,
			ProjectStatusCode: data.ProjectStatusCode ?? this.data[index].ProjectStatusCode,

			BusinessStatusDate: data.BusinessStatusDate ?? this.data[index].BusinessStatusDate,
			EstimatedEndDate: data.EstimatedEndDate ?? this.data[index].EstimatedEndDate,
			ActualEndDate: data.ActualEndDate ?? this.data[index].ActualEndDate,

			CommercialStatus: data.CommercialStatus ?? this.data[index].CommercialStatus,
			LeaderName: data.LeaderName ?? this.data[index].LeaderName,
			Observations: data.Observations ?? this.data[index].Observations,

			UpdatedAt: new Date().toISOString(),
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

		this.data = this.data.filter((p) => p.Id !== id)

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
