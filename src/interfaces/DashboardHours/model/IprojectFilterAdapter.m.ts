import { CreateProjectFilterDto, ProjectFilterDto } from './ProjectFilterDto.m'

export interface IProjectFilters {
	getAll(): Promise<ProjectFilterDto[]>

	create(data: CreateProjectFilterDto): Promise<void>

	delete(id: number): Promise<void>
}
