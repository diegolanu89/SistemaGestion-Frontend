// utils/months.ts

const MONTH_NAMES_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export interface MonthSlot {
	key: string
	label: string
}

const pad2 = (n: number): string => String(n).padStart(2, '0')

const buildMonthKey = (year: number, monthIdx: number): string => `${year}-${pad2(monthIdx + 1)}`

const buildMonthLabel = (year: number, monthIdx: number): string => `${MONTH_NAMES_ES[monthIdx]} de ${year}`

export const parseMonthKey = (key: string): Date => {
	const [year, month] = key.split('-').map(Number)
	return new Date(year, (month ?? 1) - 1, 1)
}

export const monthKeyOf = (d: Date): string => buildMonthKey(d.getFullYear(), d.getMonth())

export const monthsBetween = (from: Date, to: Date): number =>
	(to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())

export const earlierOf = (a: Date, b: Date): Date => (a.getTime() < b.getTime() ? a : b)

/**
 * Devuelve `count` meses consecutivos a partir del mes que contiene `anchor`.
 */
export const getMonthsFromNow = (count: number, anchor: Date = new Date()): MonthSlot[] => {
	const result: MonthSlot[] = []
	const baseYear = anchor.getFullYear()
	const baseMonth = anchor.getMonth()

	for (let i = 0; i < count; i++) {
		const d = new Date(baseYear, baseMonth + i, 1)
		const year = d.getFullYear()
		const monthIdx = d.getMonth()
		result.push({
			key: buildMonthKey(year, monthIdx),
			label: buildMonthLabel(year, monthIdx),
		})
	}
	return result
}
