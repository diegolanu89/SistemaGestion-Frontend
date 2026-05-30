import { DashboardHoursResponseDto } from '../../DashboardHours/model/DashboardHoursDTO.m'

import { UserRefDto } from '../../Etc/model/UserRefDTO.m'

import { CapacityLimitsResponseDto } from '../../Capacity/model/CapacityDto.m'

import { ExportCapacityDto } from '../../Etc/model/IEtcApi.m'

import { DotationRowDto } from './DotacionRowDTO.m'

import { BatchMetricsResponseDto } from './MetricsDto.m'

import { UserMonthlyCapacityDto } from './UserCapacityDTO.m'

export interface DotationPreviewDto {
	dashboard: DashboardHoursResponseDto | null

	users: UserRefDto[]

	userCapacities: Record<number, UserMonthlyCapacityDto[]>

	capacityLimits: CapacityLimitsResponseDto | null

	etcCapacities: ExportCapacityDto[]

	metrics: BatchMetricsResponseDto | null

	rows: DotationRowDto[]
}
