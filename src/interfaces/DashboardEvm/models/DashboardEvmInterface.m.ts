import { DashboardEvmResponse } from './DashboardEvmDTO.m'
import { ProjectTrackingDto } from './ProjectTrackingDTO.m'

export interface DashboardEvmInterface {
	getEvm(): Promise<DashboardEvmResponse>
	getTracking(projectId: number): Promise<ProjectTrackingDto>
}
