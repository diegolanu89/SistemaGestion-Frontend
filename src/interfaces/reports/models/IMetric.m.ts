import { BatchMetricsResponseDto, ProjectMetricDto } from './MetricsDto.m'

export interface IProjectMetrics {
	getProjectMetrics(projectId: number, from?: string, to?: string): Promise<ProjectMetricDto>

	getBatchMetrics(projectIds: number[]): Promise<BatchMetricsResponseDto>
}
