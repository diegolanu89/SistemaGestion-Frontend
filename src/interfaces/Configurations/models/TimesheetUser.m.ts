export interface TimesheetUserDto {
	id: number
	timesheetUserId: string | null
	name: string
	email: string | null
	active: boolean
	role?: string | null
	defaultMonthHours?: number | null
}

export interface TimesheetUserListResponse {
	success: boolean
	data: {
		data: TimesheetUserDto[]
		current_page: number
		per_page: number
		total: number
		last_page: number
	}
}

export interface TimesheetUserOptionsResponse {
	success: boolean
	data: {
		users: UserOption[]
	}
}

export interface UserOption {
	id: number
	name: string
	email?: string | null
}

export interface UserMonthlyCapacityEntry {
	id?: number
	userId: number
	monthKey: string
	monthLabel: string | null
	hours: number
}

export interface CapacityListResponse {
	success: boolean
	data: UserMonthlyCapacityEntry[]
}

export interface CreateTimesheetUserDto {
	timesheetUserId?: string | null
	name: string
	email?: string | null
	active?: boolean
	role?: string | null
	defaultMonthHours?: number | null
}

export interface UpdateTimesheetUserDto {
	name?: string
	email?: string | null
	active?: boolean
	role?: string | null
	defaultMonthHours?: number | null
}

export interface SaveCapacitiesDto {
	entries: Array<{ monthKey: string; hours: number }>
}
