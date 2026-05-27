/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	ProyectViewInterface,
	ProjectPaginatedResponse,
	RecalculateHoursResponse,
	UpdateBacResponse,
	ProjectHoursResponseDto,
} from '../models/ProyectViewInterface.m'
import { ProjectDto } from '../models/ProyectViewDTO.m'

import projectsPage1 from './mocks/proyects.page1.json'
import projectDetail from './mocks/proyects.detail.json'
import recalcResponse from './mocks/recalculate.response.json'
import updateBacResponse from './mocks/updateBac.response.json'

export class ProyectViewMock implements ProyectViewInterface {
	getProjectHours(id: number): Promise<ProjectHoursResponseDto> {
		throw new Error('Method not implemented.')
	}
	async getAll(): Promise<ProjectPaginatedResponse> {
		return projectsPage1 as ProjectPaginatedResponse
	}

	async getEvm(): Promise<ProjectPaginatedResponse> {
		return projectsPage1 as ProjectPaginatedResponse
	}

	async getById(): Promise<ProjectDto> {
		return projectDetail as ProjectDto
	}

	async updateBac(): Promise<UpdateBacResponse> {
		return updateBacResponse as UpdateBacResponse
	}

	async recalculateHours(): Promise<RecalculateHoursResponse> {
		return recalcResponse as RecalculateHoursResponse
	}
}
