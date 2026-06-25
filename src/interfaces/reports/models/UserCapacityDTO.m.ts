export interface UserMonthlyCapacityDto {
	id: number

	userId: number

	monthKey: string

	monthLabel: string

	hours: number

	createdAt?: string

	updatedAt?: string
}

export interface CreateUserMonthlyCapacityEntryDto {
	monthKey: string

	hours: number
}

export interface CreateUserMonthlyCapacityDto {
	entries: CreateUserMonthlyCapacityEntryDto[]
}
