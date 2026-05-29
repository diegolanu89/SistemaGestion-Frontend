// services/DashBoardHourAdapter.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { IDashboardHours } from '../model/IDashboardHours.m'
import { DashboardHoursBDT } from './DashBoardHourBDT.s'
import { DashBoardHourMock } from './DashBoardHourMock.s'

export class DashBoardHourAdapterFactory {
	static getAdapter(): IDashboardHours {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using Dashboard provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new DashboardHoursBDT()

			case 'mock':
			default:
				return new DashBoardHourMock()
		}
	}
}

export const DashBoardHourAdapter = DashBoardHourAdapterFactory.getAdapter()
