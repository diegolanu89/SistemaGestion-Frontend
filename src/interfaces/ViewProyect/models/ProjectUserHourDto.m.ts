export interface ProjectUserHoursDto {
	user_id: number

	user_name: string

	role_short?: string | null

	leader_name?: string | null

	months: Record<
		string,
		{
			hours: number
			expected: number
		}
	>

	total_hours: number
}

export interface ProjectHoursResponseDto {
	project_id: number

	months: string[]

	month_hours: Record<string, number>

	data: ProjectUserHoursDto[]
}
