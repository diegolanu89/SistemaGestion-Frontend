export interface WorkingDaysCalendarDto {
	id?: number
	monthKey: string
	monthLabel?: string
	year: number
	month: number
	totalDays: number
	workingDays: number
	hoursMonth?: number
	holidayDays?: number
	holidaysList?: string | null
	notes?: string | null
	createdAt?: string
	updatedAt?: string
}

export interface WorkingDaysCalendarListResponse {
	success: boolean
	data: {
		data: WorkingDaysCalendarDto[]
		current_page: number
		per_page: number
		total: number
		last_page: number
	}
}

export interface CreateWorkingDaysCalendarDto {
	monthKey: string
	monthLabel: string
	year: number
	month: number
	totalDays: number
	workingDays: number
	holidayDays?: number
	holidaysList?: string | null
	notes?: string | null
}

export interface UpdateWorkingDaysCalendarDto {
	workingDays?: number
	holidayDays?: number
	holidaysList?: string | null
	notes?: string | null
}
