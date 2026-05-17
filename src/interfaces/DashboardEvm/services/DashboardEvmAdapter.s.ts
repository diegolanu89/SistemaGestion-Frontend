import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'

import { DashboardEvmInterface } from '../models/DashboardEvmInterface.m'
import { DashboardEvmBDT } from './DashboardEvmBDT.s'
import { DashboardEvmMock } from './DashboardEvmMock.s'

export class DashboardEvmAdapterFactory {
	static getAdapter(): DashboardEvmInterface {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using Dashboard EVM provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new DashboardEvmBDT()

			case 'mock':
			default:
				return new DashboardEvmMock()
		}
	}
}

export const dashboardEvmAdapter = DashboardEvmAdapterFactory.getAdapter()
