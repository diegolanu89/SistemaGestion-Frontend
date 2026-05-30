// services/ProjectMetricsBDT.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { HttpClient } from '../../base/services/HttpClient.s'
import { IProjectMetrics } from '../models/IMetric.m'
import { ProjectMetricDto, BatchMetricsResponseDto } from '../models/MetricsDto.m'

const BASE_URL = import.meta.env.VITE_API_URL

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class ProjectMetricsBDT implements IProjectMetrics {
	async getProjectMetrics(projectId: number, from?: string, to?: string): Promise<ProjectMetricDto> {
		logger.infoTag(LogTag.Adapter, `[PROJECT_METRICS][BDT] getProjectMetrics -> ${projectId}`)

		try {
			const params = new URLSearchParams()

			if (from) {
				params.append('from', from)
			}

			if (to) {
				params.append('to', to)
			}

			const query = params.toString()

			return await HttpClient.request<ProjectMetricDto>(`${BASE_URL}/projects/${projectId}/metrics${query ? `?${query}` : ''}`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async getBatchMetrics(projectIds: number[]): Promise<BatchMetricsResponseDto> {
		logger.infoTag(LogTag.Adapter, `[PROJECT_METRICS][BDT] getBatchMetrics -> ${projectIds.length} projects`)

		try {
			const ids = projectIds.join(',')

			return await HttpClient.request<BatchMetricsResponseDto>(`${BASE_URL}/projects/metrics/batch?project_ids=${ids}`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}
}
