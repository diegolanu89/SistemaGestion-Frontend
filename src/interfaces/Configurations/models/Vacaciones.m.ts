export interface UserVacationPeriodDto {
	id: number
	userId: number
	userName: string | null
	dateFrom: string
	dateTo: string
	totalDays: number
	notes?: string | null
}

export interface VacationEntryInput {
	userId: number
	dateFrom: string
	dateTo: string
	notes?: string | null
}

export interface CreateVacationPeriodsDto {
	entries: VacationEntryInput[]
}
