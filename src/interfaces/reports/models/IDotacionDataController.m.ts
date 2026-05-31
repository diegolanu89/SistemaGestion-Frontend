import { DashboardHoursResponseDto } from '../../DashboardHours/model/DashboardHoursDTO.m'

import { CapacityLimitsRequestDto, CapacityLimitsResponseDto } from '../../Capacity/model/CapacityDto.m'

import { ExportCapacityDto } from '../../Etc/model/IEtcApi.m'

import { UserRefDto } from '../../Etc/model/UserRefDTO.m'

import { ProjectMetricDto, BatchMetricsResponseDto } from './MetricsDto.m'

import { DotationPreviewDto } from './DotacionPreviewDTO.m'

export interface IDotationDataController {
	buildPreview(monthKeys: string[]): Promise<DotationPreviewDto>

	getDashboardData(monthKeys: string[]): Promise<DashboardHoursResponseDto>

	getUsers(): Promise<UserRefDto[]>

	getCapacityLimits(request: CapacityLimitsRequestDto): Promise<CapacityLimitsResponseDto>

	getEtcCapacities(): Promise<ExportCapacityDto[]>

	getProjectMetrics(projectId: number): Promise<ProjectMetricDto>

	getProjectsMetrics(projectIds: number[]): Promise<BatchMetricsResponseDto>
}
