// services/DashboardFiltersMock.s.ts

import { CreateDashboardFilterDto, DashboardFilterDto, UpdateDashboardFilterDto } from '../model/DashboardHoursDTO.m'
import { IDashboardFilters } from '../model/IDashboardfilter.m'

export class DashboardFiltersMock implements IDashboardFilters {
	private filters: DashboardFilterDto[] = []

	// ==========================
	// 🔹 GET ALL
	// ==========================

	async getAll(): Promise<DashboardFilterDto[]> {
		return this.filters
	}

	// ==========================
	// 🔹 CREATE
	// ==========================

	async create(data: CreateDashboardFilterDto): Promise<DashboardFilterDto> {
		const filter: DashboardFilterDto = {
			Id: Date.now(),

			Name: data.Name,

			LeaderId: data.LeaderId ?? null,

			ProjectId: data.ProjectId ?? null,

			MonthKeys: data.MonthKeys ?? [],

			SourceType: data.SourceType ?? 'ALL',
		}

		this.filters.push(filter)

		return filter
	}

	// ==========================
	// 🔹 UPDATE
	// ==========================

	async update(id: number, data: UpdateDashboardFilterDto): Promise<DashboardFilterDto> {
		const index = this.filters.findIndex((f) => f.Id === id)

		if (index === -1) {
			throw new Error('Filtro no encontrado')
		}

		this.filters[index] = {
			...this.filters[index],

			...data,
		}

		return this.filters[index]
	}

	// ==========================
	// 🔹 DELETE
	// ==========================

	async delete(id: number): Promise<void> {
		this.filters = this.filters.filter((f) => f.Id !== id)
	}
}
