import { ClockifyProjectHoursSummaryDto } from '../models/IClockifySync.m'

export type CapacityStatus = 'success' | 'danger' | 'empty'

export const getCapacityStatus = (hours: number, max: number): CapacityStatus => {
	if (hours <= 0) return 'empty'

	return hours > max ? 'danger' : 'success'
}

export const getRoleClass = (role?: string | null): string => {
	const normalized = role?.toUpperCase() ?? 'NA'

	if (normalized.includes('LD')) return 'project-hours-accordion__role--leader'

	if (normalized.includes('DEV')) return 'project-hours-accordion__role--dev'

	if (normalized.includes('QA')) return 'project-hours-accordion__role--qa'

	if (normalized.includes('AF')) return 'project-hours-accordion__role--af'

	return 'project-hours-accordion__role--default'
}

export const getConsumedHours = (clockifyHoursData: ClockifyProjectHoursSummaryDto | null, userName: string, month: string): number => {
	if (!clockifyHoursData) return 0

	const user = clockifyHoursData.data.find((item) => item.user_name.toLowerCase() === userName.toLowerCase())

	if (!user) return 0

	return user.months?.[month] ?? 0
}

export const getConsumedTotalHours = (clockifyHoursData: ClockifyProjectHoursSummaryDto | null, userId: number): number => {
	if (!clockifyHoursData) return 0

	const user = clockifyHoursData.data.find((item) => item.user_id === userId)

	return user?.total_hours ?? 0
}
