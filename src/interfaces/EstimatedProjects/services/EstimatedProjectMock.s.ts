// services/EstimatedProjectMock.s.ts

import { EstimatedProjectInterface } from '../models/IEstimatedProject.m'
import {
	EstimatedProjectRecordDto,
	CreateEstimatedProjectDto,
	UpdateEstimatedProjectDto,
	ClientRefDto,
	UserRefDto,
} from '../models/EstimatedProjectDTO.m'

import projectsJson from './mocks/estimated-projects.mock.json'
import clientsJson from './mocks/clients.mock.json'
import usersJson from './mocks/users.mock.json'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

const initialProjects = projectsJson as unknown as EstimatedProjectRecordDto[]
const clientsData = clientsJson as unknown as ClientRefDto[]
const usersData = usersJson as unknown as UserRefDto[]

export class EstimatedProjectMock implements EstimatedProjectInterface {
	private data: EstimatedProjectRecordDto[] = [...initialProjects]
	private clients: ClientRefDto[] = [...clientsData]

	// ==========================
	// 🔹 LIST
	// ==========================
	async list(): Promise<EstimatedProjectRecordDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][MOCK] list()')
		return [...this.data]
	}

	// ==========================
	// 🔹 GET BY ID
	// ==========================
	async getById(id: number): Promise<EstimatedProjectRecordDto | null> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] getById -> id=${id}`)
		return this.data.find((p) => p.Id === id) ?? null
	}

	// ==========================
	// 🔹 CREATE
	// ==========================
	async create(data: CreateEstimatedProjectDto): Promise<EstimatedProjectRecordDto> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][MOCK] create', data)

		// resolve client (existente o nuevo)
		let clientId = data.ClientId ?? null
		let clientName: string | null = null

		if (clientId) {
			clientName = this.clients.find((c) => c.Id === clientId)?.Name ?? null
		} else if (data.NewClientName?.trim()) {
			const newClient: ClientRefDto = {
				Id: Date.now(),
				Name: data.NewClientName.trim(),
				IsActive: true,
			}
			this.clients.push(newClient)
			clientId = newClient.Id
			clientName = newClient.Name
		}

		const newItem: EstimatedProjectRecordDto = {
			Id: Date.now(),
			ClientId: clientId,
			ClientName: clientName,
			ProjectName: data.ProjectName,
			Code: data.Code ?? null,
			Resources: data.Resources ?? [],
			IsActive: true,
			CreatedAt: new Date().toISOString(),
			UpdatedAt: new Date().toISOString(),
		}

		this.data.push(newItem)

		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] created -> id=${newItem.Id}`)

		return newItem
	}

	// ==========================
	// 🔹 UPDATE
	// ==========================
	async update(id: number, data: UpdateEstimatedProjectDto): Promise<EstimatedProjectRecordDto> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] update -> id=${id}`, data)

		const index = this.data.findIndex((p) => p.Id === id)

		if (index === -1) {
			const err = new Error(`Estimated project not found -> id=${id}`)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}

		const current = this.data[index]

		const updated: EstimatedProjectRecordDto = {
			...current,
			ClientId: data.ClientId ?? current.ClientId,
			ProjectName: data.ProjectName ?? current.ProjectName,
			Code: data.Code ?? current.Code,
			Resources: data.Resources ?? current.Resources,
			UpdatedAt: new Date().toISOString(),
		}

		this.data[index] = updated

		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] updated -> id=${id}`)

		return updated
	}

	// ==========================
	// 🔹 DELETE
	// ==========================
	async delete(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] delete -> id=${id}`)
		this.data = this.data.filter((p) => p.Id !== id)
		logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT][MOCK] deleted -> id=${id}`)
	}

	// ==========================
	// 🔹 REFS
	// ==========================
	async getClients(): Promise<ClientRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][MOCK] getClients()')
		return [...this.clients]
	}

	async getUsers(): Promise<UserRefDto[]> {
		logger.infoTag(LogTag.Adapter, '[ESTIMATED-PROYECT][MOCK] getUsers()')
		return [...usersData]
	}
}
