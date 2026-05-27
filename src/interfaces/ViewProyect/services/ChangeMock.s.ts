// services/ChangeRequestMock.s.ts

import { ChangeRequestDto, ChangeRequestInterface, CreateChangeRequestDto, UpdateChangeRequestDto } from '../models/IChange.m'

const MOCK_DATA: ChangeRequestDto[] = [
	{
		id: 1,
		projectId: 101,
		code: 'CR-001',
		title: 'Ampliación módulo ETC',
		description: 'Se incorpora nueva lógica para control de ETC semanal.',
		requestedBy: 'Diego Peyrano',
		requestedDate: '2026-05-10',
		status: 'aprobado',
		bacHoursIncrement: 40,
		bacCostIncrement: 1200,
		approvedBy: 'Lucia',
		approvedDate: '2026-05-12',
		createdAt: '2026-05-10T10:00:00Z',
		updatedAt: '2026-05-12T14:00:00Z',
	},

	{
		id: 2,
		projectId: 101,
		code: 'CR-002',
		title: 'Refactor visual dashboards',
		description: 'Mejoras visuales y responsive del dashboard.',
		requestedBy: 'Santiago',
		requestedDate: '2026-05-18',
		status: 'propuesto',
		bacHoursIncrement: 24,
		bacCostIncrement: 600,
		approvedBy: null,
		approvedDate: null,
		createdAt: '2026-05-18T11:00:00Z',
		updatedAt: '2026-05-18T11:00:00Z',
	},
]

export class ChangeRequestMock implements ChangeRequestInterface {
	/* =====================================================
	🔹 GET BY PROJECT
	===================================================== */

	async getByProject(projectId: number): Promise<ChangeRequestDto[]> {
		return MOCK_DATA.filter((x) => x.projectId === projectId)
	}

	/* =====================================================
	🔹 CREATE
	===================================================== */

	async create(projectId: number, dto: CreateChangeRequestDto): Promise<ChangeRequestDto> {
		const created: ChangeRequestDto = {
			id: Date.now(),

			projectId,

			code: dto.code,

			title: dto.title,

			description: dto.description ?? null,

			requestedBy: dto.requestedBy ?? null,

			requestedDate: dto.requestedDate,

			status: dto.status,

			bacHoursIncrement: dto.bacHoursIncrement ?? 0,

			bacCostIncrement: dto.bacCostIncrement ?? 0,

			approvedBy: dto.approvedBy ?? null,

			approvedDate: dto.approvedDate ?? null,

			createdAt: new Date().toISOString(),

			updatedAt: new Date().toISOString(),
		}

		MOCK_DATA.unshift(created)

		return created
	}

	/* =====================================================
	🔹 UPDATE
	===================================================== */

	async update(projectId: number, changeId: number, dto: UpdateChangeRequestDto): Promise<ChangeRequestDto> {
		const index = MOCK_DATA.findIndex((x) => x.id === changeId && x.projectId === projectId)

		if (index === -1) {
			throw new Error('Change request not found')
		}

		const current = MOCK_DATA[index]

		const updated: ChangeRequestDto = {
			...current,

			title: dto.title ?? current.title,

			description: dto.description ?? current.description,

			status: dto.status ?? current.status,

			bacHoursIncrement: dto.bacHoursIncrement ?? current.bacHoursIncrement,

			bacCostIncrement: dto.bacCostIncrement ?? current.bacCostIncrement,

			approvedBy: dto.approvedBy ?? current.approvedBy,

			approvedDate: dto.approvedDate ?? current.approvedDate,

			updatedAt: new Date().toISOString(),
		}

		MOCK_DATA[index] = updated

		return updated
	}

	/* =====================================================
	🔹 PATCH
	===================================================== */

	async patch(changeId: number, dto: UpdateChangeRequestDto): Promise<ChangeRequestDto> {
		const index = MOCK_DATA.findIndex((x) => x.id === changeId)

		if (index === -1) {
			throw new Error('Change request not found')
		}

		const current = MOCK_DATA[index]

		const updated: ChangeRequestDto = {
			...current,

			title: dto.title ?? current.title,

			description: dto.description ?? current.description,

			status: dto.status ?? current.status,

			bacHoursIncrement: dto.bacHoursIncrement ?? current.bacHoursIncrement,

			bacCostIncrement: dto.bacCostIncrement ?? current.bacCostIncrement,

			approvedBy: dto.approvedBy ?? current.approvedBy,

			approvedDate: dto.approvedDate ?? current.approvedDate,

			updatedAt: new Date().toISOString(),
		}

		MOCK_DATA[index] = updated

		return updated
	}

	/* =====================================================
	🔹 DELETE
	===================================================== */

	async delete(projectId: number, changeId: number): Promise<void> {
		const index = MOCK_DATA.findIndex((x) => x.id === changeId && x.projectId === projectId)

		if (index >= 0) {
			MOCK_DATA.splice(index, 1)
		}
	}
}
