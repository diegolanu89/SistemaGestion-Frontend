import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { ICapacity } from '../model/ICapacity.m'
import { CapacityBDT } from './CapacityBDT'
import { CapacityMock } from './CapacityMock'

export class CapacityAdapterFactory {
	static getAdapter(): ICapacity {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using capacity provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new CapacityBDT()

			case 'mock':
			default:
				return new CapacityMock()
		}
	}
}

export const capacityAdapter = CapacityAdapterFactory.getAdapter()
