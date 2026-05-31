import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { IProjectMetrics } from '../models/IMetric.m'
import { ProjectMetricsBDT } from './MetricsBDT.s'
import { ProjectMetricsMock } from './MetricsMock.s'

export class ProjectMetricsAdapterFactory {
	static getAdapter(): IProjectMetrics {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using Project Metrics provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new ProjectMetricsBDT()

			case 'mock':
			default:
				return new ProjectMetricsMock()
		}
	}
}

export const projectMetricsAdapter = ProjectMetricsAdapterFactory.getAdapter()
