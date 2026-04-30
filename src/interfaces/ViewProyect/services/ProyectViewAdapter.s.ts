// services/ProyectAdapterFactory.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { ProyectViewInterface } from '../models/ProyectViewInterface.m'
import { ProyectViewBTS } from './ProyectViewBTS.s'
import { ProyectViewMock } from './ProyectViewMock.s'

export class ProyectViewAdapterFactory {
	static getAdapter(): ProyectViewInterface {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using proyect Viewer provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new ProyectViewBTS()

			case 'mock':
			default:
				return new ProyectViewMock()
		}
	}
}

export const proyectViewAdapter = ProyectViewAdapterFactory.getAdapter()
