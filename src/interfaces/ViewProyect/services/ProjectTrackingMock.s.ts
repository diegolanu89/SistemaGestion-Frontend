import {
	ProjectTrackingDto,
	ProjectTrackingInterface,
	UpsertProjectTrackingDto,
	CreateTrackingUpdateDto,
	ProjectTrackingUpdateDto,
	UpdateTrackingUpdateDto,
} from '../models/IProjectTracking.m'

const MOCK_TRACKING: ProjectTrackingDto = {
	id: 1,

	startDate: '2026-05-01',

	plannedEndDate: '2026-08-30',

	actualEndDate: null,

	implementationDate: '2026-05-15',

	createdAt: new Date().toISOString(),

	updatedAt: new Date().toISOString(),

	updates: [
		{
			id: 1,

			projectTrackingId: 1,

			milestoneDate: '2026-09-10',

			observations: 'Demora por redefinición funcional.',

			createdAt: new Date().toISOString(),

			updatedAt: new Date().toISOString(),
		},
	],
}

export class ProjectTrackingMock implements ProjectTrackingInterface {
	async getTracking(): Promise<ProjectTrackingDto | null> {
		return MOCK_TRACKING
	}

	async updateTracking(_: number, dto: UpsertProjectTrackingDto): Promise<ProjectTrackingDto> {
		return {
			...MOCK_TRACKING,

			...dto,
		}
	}

	async addUpdate(_: number, dto: CreateTrackingUpdateDto): Promise<ProjectTrackingUpdateDto> {
		return {
			id: Date.now(),

			projectTrackingId: 1,

			milestoneDate: dto.milestoneDate,

			observations: dto.observations,

			createdAt: new Date().toISOString(),

			updatedAt: new Date().toISOString(),
		}
	}

	async editUpdate(_: number, updateId: number, dto: UpdateTrackingUpdateDto): Promise<ProjectTrackingUpdateDto> {
		return {
			id: updateId,

			projectTrackingId: 1,

			milestoneDate: dto.milestoneDate ?? null,

			observations: dto.observations ?? null,

			createdAt: new Date().toISOString(),

			updatedAt: new Date().toISOString(),
		}
	}

	async deleteUpdate(): Promise<void> {
		return
	}
}
