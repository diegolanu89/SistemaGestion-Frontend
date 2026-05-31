import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'
import { DotationRowDto } from '../models/DotacionRowDTO.m'

export class DotationRowBuilder {
	static build(preview: Omit<DotationPreviewDto, 'rows'>): DotationRowDto[] {
		if (!preview.dashboard) {
			return []
		}

		const metricsMap = new Map(preview.metrics?.metrics.map((metric) => [metric.project_id, metric]) ?? [])

		return preview.dashboard.data.map((row) => {
			const clients = Array.from(new Set((row.details ?? []).map((detail) => detail.client_name).filter(Boolean))) as string[]

			const projects = Array.from(new Set((row.details ?? []).map((detail) => detail.project_name).filter(Boolean))) as string[]

			const totalHours = Object.values(row.months).reduce((acc, month) => acc + month.hours, 0)

			const userLimits = preview.capacityLimits?.limits[row.user_name ?? ''] ?? {}

			const capacity = Object.values(userLimits).reduce((acc, item) => acc + item.capacity, 0)

			const availableCapacity = Object.values(userLimits).reduce((acc, item) => acc + item.available, 0)

			const utilization = capacity > 0 ? Number(((totalHours / capacity) * 100).toFixed(2)) : 0

			const deviation = Number((capacity - totalHours).toFixed(2))

			const forecastEtc = preview.etcCapacities.filter((item) => item.user_name === row.user_name).reduce((acc, item) => acc + item.hours, 0)

			const futureCapacity = availableCapacity

			const futureDifference = Number((futureCapacity - forecastEtc).toFixed(2))

			const metric = (row.details ?? []).map((detail) => metricsMap.get(detail.project_id ?? 0)).find(Boolean) ?? null

			const bac = metric?.bac ?? 0

			const spi = metric?.spi ?? 0

			const cpi = metric?.cpi ?? 0

			const isBench = totalHours === 0

			const status: 'healthy' | 'warning' | 'critical' = utilization > 100 || cpi < 0.9 || spi < 0.9 ? 'critical' : utilization > 80 ? 'warning' : 'healthy'

			return {
				userId: row.user_id,

				userName: row.user_name ?? '-',

				role: row.role_short ?? '-',

				leader: row.leader_name ?? '-',

				clients,

				projects,

				totalHours,

				capacity,

				utilization,

				deviation,

				isBench,

				forecastEtc,

				futureCapacity,

				futureDifference,

				bac,

				spi,

				cpi,

				status,

				months: row.months,
			}
		})
	}
}
