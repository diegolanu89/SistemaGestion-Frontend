// services/EtcAdapterFactory.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { IEtcApi } from '../model/IEtcApi.m'
import { EtcBDT } from './EtcBDT'
import { EtcMock } from './EtcMock'

export class EtcAdapterFactory {
	static getAdapter(): IEtcApi {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using ETC provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new EtcBDT()

			case 'mock':
			default:
				return new EtcMock()
		}
	}
}

export const etcAdapter = EtcAdapterFactory.getAdapter()
