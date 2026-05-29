import { VisibleProjectsInterface } from '../models/IvisibleProject.m'
import { VisibleProjectDto, UpdateVisibleProjectsDto, UpdateVisibleProjectsResponseDto } from '../models/VisibleProject.m'

export class VisibleProjectsMock implements VisibleProjectsInterface {
	async getAll(): Promise<VisibleProjectDto[]> {
		return [
			{
				id: 1,
				project_id: 16,

				project: {
					id: 16,

					name: 'Integración Clockify',

					code: 'CLK-005',

					status: 'activo',

					client: {
						name: 'Cliente Global Corp',
					},

					client_name: 'Cliente Global Corp',
				},
			},
		]
	}

	async update(dto: UpdateVisibleProjectsDto): Promise<UpdateVisibleProjectsResponseDto> {
		return {
			message: 'Proyectos actualizados',

			project_ids: dto.projectIds,
		}
	}
}
