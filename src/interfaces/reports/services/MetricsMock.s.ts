import { IProjectMetrics } from '../models/IMetric.m'
import { ProjectMetricDto, BatchMetricsResponseDto } from '../models/MetricsDto.m'

export class ProjectMetricsMock implements IProjectMetrics {
	async getProjectMetrics(projectId: number): Promise<ProjectMetricDto> {
		return {
			project_id: projectId,

			project_name: 'Mock Project',

			bac: 1000,

			ac: 600,

			ev: 550,

			pv: 580,

			etc: 450,

			eac: 1050,

			vac: -50,

			spi: 0.95,

			cpi: 0.92,
		}
	}

	async getBatchMetrics(): Promise<BatchMetricsResponseDto> {
		return {
			metrics: [],
		}
	}
}
