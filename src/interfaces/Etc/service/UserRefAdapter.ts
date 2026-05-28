import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { IUserRef } from '../model/IUserRef.m'
import { UserRefBDT } from './UserRefBDT'
import { UserRefMock } from './UserRefMock'

export class UserAdapterFactory {
	static getAdapter(): IUserRef {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using user provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new UserRefBDT()

			case 'mock':
			default:
				return new UserRefMock()
		}
	}
}

export const userAdapter = UserAdapterFactory.getAdapter()
