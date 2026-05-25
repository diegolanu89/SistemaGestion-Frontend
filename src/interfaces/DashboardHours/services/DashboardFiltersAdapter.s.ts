import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { IDashboardFilters } from '../model/IDashboardfilter.m'
import { DashboardFiltersMock } from './DasboardFiltersMocks.s'
import { DashboardFiltersBDT } from './DashboardFiltersBDT.s'

export class DashboardFiltersAdapterFactory {
	static getAdapter(): IDashboardFilters {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using Dashboard Filters provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new DashboardFiltersBDT()

			case 'mock':
			default:
				return new DashboardFiltersMock()
		}
	}
}

export const DashboardFiltersAdapter = DashboardFiltersAdapterFactory.getAdapter()
