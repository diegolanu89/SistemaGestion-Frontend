import { DashboardEvmRowDto } from '../models/DashboardEvmDTO.m'

export interface ClientGroup {
	clientName: string
	rows: DashboardEvmRowDto[]
}

export const groupByClient = (rows: DashboardEvmRowDto[]): ClientGroup[] => {
	const map = new Map<string, DashboardEvmRowDto[]>()

	rows.forEach((row) => {
		const key = row.clientName ?? 'Sin cliente'
		const bucket = map.get(key)

		if (bucket) {
			bucket.push(row)
		} else {
			map.set(key, [row])
		}
	})

	return Array.from(map.entries())
		.sort(([a], [b]) => a.localeCompare(b, 'es'))
		.map(([clientName, groupRows]) => ({
			clientName,
			rows: groupRows,
		}))
}
