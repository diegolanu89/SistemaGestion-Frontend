import { DashboardEvmResponse } from './DashboardEvmDTO.m'
import { ProjectMetricsDto } from './ProjectMetricsDTO.m'
import { ChangeRequestDto } from './ChangeRequestDTO.m'
import { ProjectTrackingDto } from './ProjectTrackingDTO.m'

export interface DashboardEvmInterface {
	getEvm(): Promise<DashboardEvmResponse>
	getMetricsBatch(projectIds: number[]): Promise<ProjectMetricsDto[]>
	getChangeRequests(projectId: number): Promise<ChangeRequestDto[]>
	getTracking(trackingId: number): Promise<ProjectTrackingDto | null>
}
