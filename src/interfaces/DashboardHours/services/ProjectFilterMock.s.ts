import { IProjectFilters } from '../model/IprojectFilterAdapter.m'
import { CreateProjectFilterDto, ProjectFilterDto } from '../model/ProjectFilterDto.m'

export class ProjectFilterMock implements IProjectFilters {
	private filters: ProjectFilterDto[] = []

	async getAll(): Promise<ProjectFilterDto[]> {
		return this.filters
	}

	async create(data: CreateProjectFilterDto): Promise<void> {
		const created: ProjectFilterDto[] = data.ProjectIds.map((projectId, index) => ({
			Id: Date.now() + index,

			ProjectId: projectId,

			CreatedAt: new Date().toISOString(),

			UpdatedAt: new Date().toISOString(),

			Project: null,
		}))

		this.filters = [...this.filters, ...created]
	}

	async delete(id: number): Promise<void> {
		this.filters = this.filters.filter((f) => f.Id !== id)
	}
}
