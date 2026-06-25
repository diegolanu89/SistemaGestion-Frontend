// models/IClockifySync.m.ts

export interface SyncResponseDto {
	message: string

	count?: number

	total?: number
}

// =========================================================
// CLIENTS
// =========================================================

export interface ClockifyClientDto {
	id: string

	name: string

	archived?: boolean
}

export interface GetClientsResponseDto {
	data: ClockifyClientDto[]

	count: number
}

// =========================================================
// USERS
// =========================================================

export interface ClockifyUserDto {
	id: string

	name: string

	email?: string | null

	status?: string
}

export interface GetUsersResponseDto {
	data: ClockifyUserDto[]

	count: number

	only_active: boolean
}

// =========================================================
// HOURS SUMMARY
// =========================================================

export interface ClockifyProjectHoursUserDto {
	user_id: number | null

	user_name: string

	total_hours: number

	months: Record<string, number>
}

export interface ClockifyProjectHoursSummaryDto {
	project_id: number

	project_name: string

	total_entries: number

	months: string[]

	data: ClockifyProjectHoursUserDto[]
}

// =========================================================
// ESTIMATION
// =========================================================

export interface EstimateTimeEntriesResponseDto {
	estimated_count: number

	estimated_time_seconds: number

	estimated_time_formatted: string

	users_count: number
}

// =========================================================
// SYNC STATUS
// =========================================================

export interface SyncStatusResponseDto {
	project_id: number

	clockify_project_id: string | null

	time_entries_in_db: number

	time_entries_in_clockify: number | null

	needs_sync: boolean

	missing_count: number

	error?: string
}

// =========================================================
// SYNC PROJECT RESPONSE
// =========================================================

export interface SyncProjectTimeEntriesResponseDto {
	message: string

	project_id: number

	total_in_db_before: number

	total_in_db_after: number

	added: number

	updated: number

	skipped: number

	deleted: number

	params_used: {
		mode: string

		startIso?: string | null

		endIso?: string | null

		clockify_project_id?: string
	}
}

// =========================================================
// INTERFACE
// =========================================================

export interface ClockifySyncInterface {
	syncClients(): Promise<SyncResponseDto>

	getClients(): Promise<GetClientsResponseDto>

	syncUsers(onlyActive?: boolean): Promise<SyncResponseDto>

	getUsers(onlyActive?: boolean): Promise<GetUsersResponseDto>

	syncProjects(): Promise<SyncResponseDto>

	syncTimeEntries(from?: string, to?: string): Promise<SyncResponseDto>

	syncTimeEntriesAll(from?: string, to?: string): Promise<SyncResponseDto>

	syncTimeEntriesByProject(projectId: string, from?: string, to?: string): Promise<SyncResponseDto>

	getSyncStatus(projectId: number): Promise<SyncStatusResponseDto>

	syncProjectTimeEntries(projectId: number, mode?: 'all' | 'missing' | 'from_date', from?: string): Promise<SyncProjectTimeEntriesResponseDto>

	getProjectHoursSummary(projectId: number): Promise<ClockifyProjectHoursSummaryDto>

	estimateTimeEntries(from?: string, to?: string): Promise<EstimateTimeEntriesResponseDto>
}
