// models/IProyect.m.ts

import {
	ProjectIntakeRecordDto,
	ProjectIntakeStatusRefDto,
	ProjectIntakeCategoryRefDto,
	ProjectIntakeTypeRefDto,
	CreateProjectIntakeDto,
	UpdateProjectIntakeDto,
	PaginatedProjectIntakeResponseDto,
} from './ProyectDTO.m'

export interface ProyectInterface {
	// ==========================
	// CRUD PROYECTOS
	// ==========================
	list(page: number, perPage: number): Promise<PaginatedProjectIntakeResponseDto>

	getById(id: number): Promise<ProjectIntakeRecordDto | null>

	create(data: CreateProjectIntakeDto): Promise<ProjectIntakeRecordDto>

	update(id: number, data: UpdateProjectIntakeDto): Promise<ProjectIntakeRecordDto>

	delete(id: number): Promise<void>

	// ==========================
	// REFS (DINÁMICOS)
	// ==========================
	getStatuses(): Promise<ProjectIntakeStatusRefDto[]>

	getCategories(): Promise<ProjectIntakeCategoryRefDto[]>

	getTypes(): Promise<ProjectIntakeTypeRefDto[]>
}
