// models/IProyect.m.ts

import {
	ProjectIntakeRecordDto,
	ProjectIntakeStatusRefDto,
	ProjectIntakeCategoryRefDto,
	ProjectIntakeTypeRefDto,
	ProjectIntakeClientRefDto,
	ProjectIntakeLeaderRefDto,
	CreateProjectIntakeDto,
	UpdateProjectIntakeDto,
	PaginatedProjectIntakeResponseDto,
} from './ProyectDTO.m'

export interface ProyectOptions {
	types: ProjectIntakeTypeRefDto[]
	categories: ProjectIntakeCategoryRefDto[]
	statuses: ProjectIntakeStatusRefDto[]
	clients: ProjectIntakeClientRefDto[]
	leaders: ProjectIntakeLeaderRefDto[]
}

export interface ProjectIntakeFilters {
	search?: string
	status?: string
	category?: string
	project_type?: string
}

export interface ProyectInterface {
	// ==========================
	// CRUD PROYECTOS
	// ==========================
	list(page: number, perPage: number, filters?: ProjectIntakeFilters): Promise<PaginatedProjectIntakeResponseDto>

	getById(id: number): Promise<ProjectIntakeRecordDto | null>

	create(data: CreateProjectIntakeDto): Promise<ProjectIntakeRecordDto>

	update(id: number, data: UpdateProjectIntakeDto): Promise<ProjectIntakeRecordDto>

	delete(id: number): Promise<void>

	// ==========================
	// REFS (DINÁMICOS)
	// ==========================
	getOptions(): Promise<ProyectOptions>

	getStatuses(): Promise<ProjectIntakeStatusRefDto[]>

	getCategories(): Promise<ProjectIntakeCategoryRefDto[]>

	getTypes(): Promise<ProjectIntakeTypeRefDto[]>

	getNextNumber(typeCode: string): Promise<string>
}
