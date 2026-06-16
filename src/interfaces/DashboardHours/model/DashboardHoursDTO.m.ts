// models/DashboardHoursDTO.m.ts

// ==========================
// 🔹 MONTH VALUES
// ==========================

export interface DashboardHoursMonthDto {
	hours: number

	expected: number
}

// ==========================
// 🔹 SOURCE TYPES
// ==========================

export type DashboardHoursSourceType = 'ALL' | 'ETC' | 'POTENTIAL'

// ==========================
// 🔹 DETAILS
// ==========================

export interface DashboardHoursDetailDto {
	project_id: number | null

	project_name: string | null

	project_type: string | null

	client_name: string | null

	months: Record<string, DashboardHoursMonthDto>
}

// ==========================
// 🔹 ROWS
// ==========================

export interface DashboardHoursRowDto {
	user_id: number

	user_name: string

	leader_id: number | null

	leader_name: string | null

	role: string | null

	role_short: string | null

	project_id: number | null

	project_name: string | null

	project_type: string | null

	client_name: string | null

	months: Record<string, DashboardHoursMonthDto>

	details: DashboardHoursDetailDto[]
}

// ==========================
// 🔹 FILTER OPTIONS
// ==========================

export interface DashboardHoursMonthOptionDto {
	month_key: string

	month_label?: string

	year: number

	month: number
}

export interface DashboardHoursLeaderOptionDto {
	id: number

	name: string
}

export interface DashboardHoursProjectOptionDto {
	id: string

	name: string

	project_type: string
}

export interface DashboardHoursSourceOptionDto {
	value: DashboardHoursSourceType

	label: string
}

// ==========================
// 🔹 OPTIONS
// ==========================

export interface DashboardHoursOptionsDto {
	leaders: DashboardHoursLeaderOptionDto[]

	months: DashboardHoursMonthOptionDto[]

	projects: DashboardHoursProjectOptionDto[]

	source_types?: DashboardHoursSourceOptionDto[]

	roles?: string[]
}

// ==========================
// 🔹 KPI
// ==========================

export interface DashboardHoursKpiMonthDto {
	availability: number

	need: number

	difference: number

	difference_fte: number | null
}

export interface DashboardHoursKpiRoleDto {
	role: string

	months: Record<string, DashboardHoursKpiMonthDto>
}

export interface DashboardHoursKpisDto {
	by_role: Record<string, DashboardHoursKpiRoleDto>

	months: string[]
}

// ==========================
// 🔹 RESPONSE
// ==========================

export interface DashboardHoursResponseDto {
	success: boolean

	data: DashboardHoursRowDto[]

	months: string[]

	month_hours: Record<string, number | null>

	options: DashboardHoursOptionsDto

	kpis: DashboardHoursKpisDto
}

// ==========================
// 🔹 ACTIVE FILTERS
// ==========================

export interface DashboardHoursFiltersDto {
	leader_id?: string | null

	project_id?: string | null

	month_keys?: string[]

	source_type?: DashboardHoursSourceType
}

// ==========================
// 🔹 SAVED FILTERS
// ==========================

export interface DashboardFilterDto {
	id: number

	name: string

	leaderId: string | null

	monthKeys: string[] | null

	projectId: string | null

	sourceType: DashboardHoursSourceType | null

	createdAt?: string | null

	updatedAt?: string | null
}

// ==========================
// 🔹 CREATE FILTER
// ==========================

export interface CreateDashboardFilterDto {
	name: string

	leaderId?: string | null

	monthKeys?: string[]

	projectId?: string | null

	sourceType?: DashboardHoursSourceType | null
}

// ==========================
// 🔹 UPDATE FILTER
// ==========================

export interface UpdateDashboardFilterDto {
	name?: string

	leaderId?: string | null

	monthKeys?: string[]

	projectId?: string | null

	sourceType?: DashboardHoursSourceType | null
}

// ==========================
// 🔹 SYNC
// ==========================

export interface DashboardSyncDto {
	last_date: string | null
}

// ==========================
// 🔹 CAPACITY
// ==========================

export interface UserMonthlyCapacityDto {
	id: number

	userId: number

	monthKey: string

	monthLabel: string

	hours: number

	createdAt?: string | null

	updatedAt?: string | null
}

export interface CreateUserMonthlyCapacityEntryDto {
	MonthKey: string

	Hours: number
}

export interface CreateUserMonthlyCapacityDto {
	Entries: CreateUserMonthlyCapacityEntryDto[]
}
