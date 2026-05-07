export interface ValidateCapacityEntryDto {
	userName: string
	monthKey: string
	monthLabel: string
	hours: number
}

export interface ValidateCapacityRequestDto {
	entries: ValidateCapacityEntryDto[]
	potencialProjectId?: number | null
}

export interface ValidateCapacityErrorDto {
	user_name: string
	month_key: string
	message: string
}

export interface ValidateCapacityResponseDto {
	valid: boolean
	errors: ValidateCapacityErrorDto[]
}

export interface CapacityLimitsRequestDto {
	userNames: string[]
	monthKeys: string[]
	potencialProjectId?: number | null
}

export interface CapacityLimitDto {
	userName: string
	monthKey: string
	maxHours: number
	usedHours: number
	availableHours: number
}

export interface CapacityLimitsResponseDto {
	limits: CapacityLimitDto[]
}
