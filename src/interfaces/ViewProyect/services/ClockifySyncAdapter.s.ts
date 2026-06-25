import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'

import { ClockifySyncInterface } from '../models/IClockifySync.m'
import { ClockifySyncMock } from './ClockifySuncMock.s'

import { ClockifySyncBDT } from './ClockifySyncBDT.s'

export class ClockifySyncAdapterFactory {
	static getAdapter(): ClockifySyncInterface {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using clockify provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new ClockifySyncBDT()

			case 'mock':
			default:
				return new ClockifySyncMock()
		}
	}
}

export const clockifySyncAdapter = ClockifySyncAdapterFactory.getAdapter()
