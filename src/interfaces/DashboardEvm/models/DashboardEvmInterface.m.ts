import { DashboardEvmResponse } from './DashboardEvmDTO.m'
import { ProjectMetricsDto } from './ProjectMetricsDTO.m'
import { ProjectTrackingDto } from './ProjectTrackingDTO.m'

export interface DashboardEvmInterface {
	getEvm(): Promise<DashboardEvmResponse>
	getMetricsBatch(projectIds: number[]): Promise<ProjectMetricsDto[]>
	getTracking(projectId: number): Promise<ProjectTrackingDto | null>
}
