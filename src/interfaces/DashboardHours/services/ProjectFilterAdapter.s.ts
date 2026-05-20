import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { IProjectFilters } from '../model/IprojectFilterAdapter.m'
import { ProjectFilterBDT } from './ProjectFilterBDT.s'
import { ProjectFilterMock } from './ProjectFilterMock.s'

export class ProjectFilterAdapterFactory {
	static getAdapter(): IProjectFilters {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using project-filter provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new ProjectFilterBDT()

			case 'mock':
			default:
				return new ProjectFilterMock()
		}
	}
}

export const ProjectFilterAdapter = ProjectFilterAdapterFactory.getAdapter()
