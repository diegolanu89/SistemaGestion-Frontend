import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'

import { PotencialClientInterface } from '../models/IPotencialClient.m'
import { PotencialClientBDT } from './PotencialClientBDT.s'
import { PotencialClientMock } from './PotencialClientMock.s'

export class PotencialClientAdapterFactory {
	static getAdapter(): PotencialClientInterface {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using client provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new PotencialClientBDT()

			case 'mock':
			default:
				return new PotencialClientMock()
		}
	}
}

export const potencialClientAdapter = PotencialClientAdapterFactory.getAdapter()
