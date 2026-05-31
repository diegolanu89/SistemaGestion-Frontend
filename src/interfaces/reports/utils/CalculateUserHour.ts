import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'

type DashboardData = NonNullable<DotationPreviewDto['dashboard']>

type DotationRow = DashboardData['data'][number]

export const calculateUserHours = (row: DotationRow): number => {
	return Object.values(row.months).reduce((acc, month) => acc + month.hours, 0)
}
