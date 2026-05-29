// models/IDashboardHours.m.ts

import {
	CreateDashboardFilterDto,
	CreateUserMonthlyCapacityDto,
	DashboardFilterDto,
	DashboardHoursFiltersDto,
	DashboardHoursResponseDto,
	DashboardSyncDto,
	UpdateDashboardFilterDto,
	UserMonthlyCapacityDto,
} from './DashboardHoursDTO.m'

export interface IDashboardHours {
	getDashboard(filters?: DashboardHoursFiltersDto): Promise<DashboardHoursResponseDto>

	getLastSync(): Promise<DashboardSyncDto>

	getFilters(): Promise<DashboardFilterDto[]>

	createFilter(data: CreateDashboardFilterDto): Promise<DashboardFilterDto>

	updateFilter(id: number, data: UpdateDashboardFilterDto): Promise<DashboardFilterDto>

	deleteFilter(id: number): Promise<void>

	getUserCapacities(userId: number): Promise<UserMonthlyCapacityDto[]>

	saveUserCapacities(userId: number, data: CreateUserMonthlyCapacityDto): Promise<UserMonthlyCapacityDto[]>
}
