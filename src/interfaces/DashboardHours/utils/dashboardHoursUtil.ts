export type CapacityStatus = 'success' | 'danger' | 'empty'

export const areSameHours = (current: number, expected: number): boolean => {
	return Math.abs(current - expected) < 0.01
}

export const getCapacityStatus = (hours: number, expected: number): CapacityStatus => {
	if (hours <= 0 && expected <= 0) return 'empty'

	return areSameHours(hours, expected) ? 'success' : 'danger'
}

export const getRoleClass = (role?: string | null): string => {
	const normalized = role?.toUpperCase() ?? 'NA'

	if (normalized.includes('LD')) return 'is-leader'

	if (normalized.includes('DEV')) return 'is-dev'

	if (normalized.includes('QA')) return 'is-qa'

	if (normalized.includes('AF')) return 'is-af'

	return 'is-default'
}

export const getProjectChipClass = (type?: string | null): string => {
	if (type === 'R') return 'dashboard-hours-table__project-chip--real'

	if (type === 'F') return 'dashboard-hours-table__project-chip--forecast'

	return 'dashboard-hours-table__project-chip--default'
}
