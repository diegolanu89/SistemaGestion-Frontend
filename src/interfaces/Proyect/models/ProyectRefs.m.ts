import { ProjectIntakeStatusRefDto, ProjectIntakeCategoryRefDto, ProjectIntakeTypeRefDto, ProjectIntakeClientRefDto, ProjectIntakeLeaderRefDto } from './ProyectDTO.m'

export interface ProyectRefs {
	statuses: ProjectIntakeStatusRefDto[]
	categories: ProjectIntakeCategoryRefDto[]
	types: ProjectIntakeTypeRefDto[]
	clients: ProjectIntakeClientRefDto[]
	leaders: ProjectIntakeLeaderRefDto[]
}
