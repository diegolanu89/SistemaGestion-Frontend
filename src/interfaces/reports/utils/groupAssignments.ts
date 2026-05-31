import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'

type DashboardData = NonNullable<DotationPreviewDto['dashboard']>

type DotationDetail = NonNullable<DashboardData['data'][number]['details']>[number]

export const groupAssignments = (details: DotationDetail[]): Record<string, string[]> => {
	return details.reduce(
		(acc, detail) => {
			const client = detail.client_name ?? 'Sin cliente'

			if (!acc[client]) {
				acc[client] = []
			}

			if (detail.project_name && !acc[client].includes(detail.project_name)) {
				acc[client].push(detail.project_name)
			}

			return acc
		},
		{} as Record<string, string[]>
	)
}
