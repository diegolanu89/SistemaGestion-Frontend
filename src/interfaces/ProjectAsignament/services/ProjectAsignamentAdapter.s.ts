import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { VisibleProjectsInterface } from '../models/IvisibleProject.m'
import { VisibleProjectsBDT } from './ProjectAsignamentBDT.s'
import { VisibleProjectsMock } from './ProjectAsignamentMock.s'

export class VisibleProjectsAdapterFactory {
	static getAdapter(): VisibleProjectsInterface {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using VisibleProjects provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new VisibleProjectsBDT()

			case 'mock':
			default:
				return new VisibleProjectsMock()
		}
	}
}

export const visibleProjectsAdapter = VisibleProjectsAdapterFactory.getAdapter()
