import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { IUserMonthlyCapacity } from '../models/IUserCapacity.m'
import { UserMonthlyCapacityBDT } from './UserCapacityBDT.s'
import { UserMonthlyCapacityMock } from './UserCapacityMock.s'

export class UserMonthlyCapacityAdapterFactory {
	static getAdapter(): IUserMonthlyCapacity {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using UserMonthlyCapacity provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new UserMonthlyCapacityBDT()

			case 'mock':
			default:
				return new UserMonthlyCapacityMock()
		}
	}
}

export const userMonthlyCapacityAdapter = UserMonthlyCapacityAdapterFactory.getAdapter()
