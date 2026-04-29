import { ProjectIntakeStatusRefDto, ProjectIntakeCategoryRefDto, ProjectIntakeTypeRefDto } from './ProyectDTO.m'

export interface ProyectRefs {
	statuses: ProjectIntakeStatusRefDto[]
	categories: ProjectIntakeCategoryRefDto[]
	types: ProjectIntakeTypeRefDto[]
}
