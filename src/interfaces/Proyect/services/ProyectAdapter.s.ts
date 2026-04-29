// services/ProyectAdapterFactory.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { ProyectInterface } from '../models/IProyect.m'
import { ProyectBDT } from './ProyectBTS.s'
import { ProyectMock } from './ProyectMock.s'

export class ProyectAdapterFactory {
	static getAdapter(): ProyectInterface {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using proyect provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new ProyectBDT()

			case 'mock':
			default:
				return new ProyectMock()
		}
	}
}

export const proyectAdapter = ProyectAdapterFactory.getAdapter()
