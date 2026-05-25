// model/IDashboardFilters.m.ts

import { CreateDashboardFilterDto, DashboardFilterDto, UpdateDashboardFilterDto } from './DashboardHoursDTO.m'

export interface IDashboardFilters {
	// ==========================
	// 🔹 GET ALL
	// ==========================

	getAll(): Promise<DashboardFilterDto[]>

	// ==========================
	// 🔹 CREATE
	// ==========================

	create(data: CreateDashboardFilterDto): Promise<DashboardFilterDto>

	// ==========================
	// 🔹 UPDATE
	// ==========================

	update(id: number, data: UpdateDashboardFilterDto): Promise<DashboardFilterDto>

	// ==========================
	// 🔹 DELETE
	// ==========================

	delete(id: number): Promise<void>
}
