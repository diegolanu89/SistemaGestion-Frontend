// utils/months.ts

const MONTH_NAMES_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export interface MonthSlot {
	key: string
	label: string
}

const pad2 = (n: number): string => String(n).padStart(2, '0')

const buildMonthKey = (year: number, monthIdx: number): string => `${year}-${pad2(monthIdx + 1)}`

const buildMonthLabel = (year: number, monthIdx: number): string => `${MONTH_NAMES_ES[monthIdx]} de ${year}`

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
