// services/EstimatedProjectAdapter.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { EstimatedProjectInterface } from '../models/IEstimatedProject.m'
import { EstimatedProjectBDT } from './EstimatedProjectBTS.s'
import { EstimatedProjectMock } from './EstimatedProjectMock.s'

export class EstimatedProjectAdapterFactory {
	static getAdapter(): EstimatedProjectInterface {
		const { provider } = resolveCapabilities()

		logger.infoTag(LogTag.Provider, `Using estimated-project provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new EstimatedProjectBDT()

			case 'mock':
			default:
				return new EstimatedProjectMock()
		}
	}
}

export const estimatedProjectAdapter = EstimatedProjectAdapterFactory.getAdapter()
