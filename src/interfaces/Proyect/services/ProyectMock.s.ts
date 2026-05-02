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

const initialData = mockData as unknown as ProjectIntakeRecordDto[]
const statusesData = statusesJson as unknown as ProjectIntakeStatusRefDto[]
const categoriesData = categoriesJson as unknown as ProjectIntakeCategoryRefDto[]
const typesData = typesJson as unknown as ProjectIntakeTypeRefDto[]

export class ProyectMock implements ProyectInterface {
	private data: ProjectIntakeRecordDto[] = [...initialData]

	async list(): Promise<ProjectIntakeRecordDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][MOCK] list()')
		return [...this.data]
	}

	async getById(id: number): Promise<ProjectIntakeRecordDto | null> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] getById -> id=${id}`)
		return this.data.find((p) => Number(p.Id) === id) ?? null
	}

	async create(data: CreateProjectIntakeDto): Promise<ProjectIntakeRecordDto> {
		logger.infoTag(LogTag.Adapter, '[PROYECT][MOCK] create', data)

		const now = new Date().toISOString()

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

			CreatedAt: now,
			UpdatedAt: now,

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

	async update(id: number, data: UpdateProjectIntakeDto): Promise<ProjectIntakeRecordDto> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] update -> id=${id}`, data)

		const index = this.data.findIndex((p) => Number(p.Id) === id)

		if (index === -1) {
			const err = new Error(`Project not found -> id=${id}`)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}

		const prev = this.data[index]

		const updated: ProjectIntakeRecordDto = {
			...prev,

			SecondaryProjectNumber: data.SecondaryProjectNumber ?? prev.SecondaryProjectNumber,
			RegistrationDate: data.RegistrationDate ?? prev.RegistrationDate,
			ClientId: data.ClientId ?? prev.ClientId,

			ProjectName: data.ProjectName ?? prev.ProjectName,
			CategoryCode: data.CategoryCode ?? prev.CategoryCode,
			ProjectStatusCode: data.ProjectStatusCode ?? prev.ProjectStatusCode,

			BusinessStatusDate: data.BusinessStatusDate ?? prev.BusinessStatusDate,
			EstimatedEndDate: data.EstimatedEndDate ?? prev.EstimatedEndDate,
			ActualEndDate: data.ActualEndDate ?? prev.ActualEndDate,

			CommercialStatus: data.CommercialStatus ?? prev.CommercialStatus,
			LeaderName: data.LeaderName ?? prev.LeaderName,
			Observations: data.Observations ?? prev.Observations,

			UpdatedAt: new Date().toISOString(),
		}

		this.data[index] = updated

		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] updated -> id=${id}`)

		return updated
	}

	async delete(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] delete -> id=${id}`)

		this.data = this.data.filter((p) => Number(p.Id) !== id)

		logger.infoTag(LogTag.Adapter, `[PROYECT][MOCK] deleted -> id=${id}`)
	}

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
