import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { ProjectTrackingInterface } from '../models/IProjectTracking.m'
import { ProjectTrackingBDT } from './ProjectTrackingBDT.s'
import { ProjectTrackingMock } from './ProjectTrackingMock.s'

export class ProjectTrackingAdapterFactory {
	static getAdapter(): ProjectTrackingInterface {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using project tracking provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new ProjectTrackingBDT()

			case 'mock':
			default:
				return new ProjectTrackingMock()
		}
	}
}

export const projectTrackingAdapter = ProjectTrackingAdapterFactory.getAdapter()
