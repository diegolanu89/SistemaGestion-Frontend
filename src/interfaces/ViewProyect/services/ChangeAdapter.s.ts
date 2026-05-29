// services/ChangeRequestAdapter.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { ChangeRequestInterface } from '../models/IChange.m'

import { ChangeRequestBDT } from './ChangeBDT.s'
import { ChangeRequestMock } from './ChangeMock.s'

export class ChangeRequestAdapterFactory {
	static getAdapter(): ChangeRequestInterface {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using ChangeRequest provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new ChangeRequestBDT()

			case 'mock':
			default:
				return new ChangeRequestMock()
		}
	}
}

export const changeRequestAdapter = ChangeRequestAdapterFactory.getAdapter()
