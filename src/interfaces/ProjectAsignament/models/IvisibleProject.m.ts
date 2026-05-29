import { VisibleProjectDto, UpdateVisibleProjectsDto, UpdateVisibleProjectsResponseDto } from './VisibleProject.m'

export interface VisibleProjectsInterface {
	getAll(): Promise<VisibleProjectDto[]>

	update(dto: UpdateVisibleProjectsDto): Promise<UpdateVisibleProjectsResponseDto>
}
