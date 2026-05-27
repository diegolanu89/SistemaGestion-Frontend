export interface ClockifyUserDto {
	id: number
	clockifyUserId: string | null
	name: string
	email: string | null
	active: boolean
	role?: string | null
	defaultMonthHours?: number | null
}

export interface ClockifyUserListResponse {
	success: boolean
	data: {
		data: ClockifyUserDto[]
		current_page: number
		per_page: number
		total: number
		last_page: number
	}
}

export interface ClockifyUserOptionsResponse {
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

export interface CreateClockifyUserDto {
	clockifyUserId?: string | null
	name: string
	email?: string | null
	active?: boolean
	role?: string | null
	defaultMonthHours?: number | null
}

export interface UpdateClockifyUserDto {
	name?: string
	email?: string | null
	active?: boolean
	role?: string | null
	defaultMonthHours?: number | null
}

export interface SaveCapacitiesDto {
	entries: Array<{ monthKey: string; monthLabel: string; hours: number }>
}
