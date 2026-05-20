// services/DashBoardHourAdapter.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { DashBoardHourInterface } from '../model/DashBoardHour.m'
import { DashBoardHourBDT } from './DashBoardHourBTS.s'
import { DashBoardHourMock } from './DashBoardHourMock.s'

export class DashBoardHourAdapterFactory {
	static getAdapter(): DashBoardHourInterface {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using estimated-project provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new DashBoardHourBDT()

			case 'mock':
			default:
				return new DashBoardHourMock()
		}
	}
}

export const DashBoardHourAdapter = DashBoardHourAdapterFactory.getAdapter()
