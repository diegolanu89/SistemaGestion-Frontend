// hooks/useEstimatedProjectData.h.ts

import { useEffect, useState } from 'react'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { estimatedProjectAdapter } from '../services/EstimatedProjectAdapter.s'
import { getCache, setCache } from '../utils/getCache'
import { EstimatedProjectRecordDto } from '../models/EstimatedProjectDTO.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

export const useEstimatedProjectData = () => {
	const [data, setData] = useState<EstimatedProjectRecordDto[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	const fetchData = async (force: boolean = false): Promise<void> => {
		setLoading(true)

		try {
			if (!force) {
				const cached = getCache<EstimatedProjectRecordDto[]>(ESTIMATED_PROJECT_CONFIG.CACHE.KEYS.PROJECTS)

				if (cached) {
					logger.infoTag(LogTag.Cache, `[ESTIMATED-PROYECT] cache hit -> count=${cached.length}`)
					setData(cached)
					setLoading(false)
					return
				}
			}

			const res = await estimatedProjectAdapter.list()
			setData(res)
			setCache<EstimatedProjectRecordDto[]>(ESTIMATED_PROJECT_CONFIG.CACHE.KEYS.PROJECTS, res, ESTIMATED_PROJECT_CONFIG.CACHE.TTL)

			logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT] fetch success -> count=${res.length}`)
		} catch (error: unknown) {
			const err = error instanceof Error ? error : new Error('Unknown error fetching estimated projects')
			logger.errorTag(LogTag.Adapter, err)
		} finally {
			setLoading(false)
		}
	}

	const refetch = async (): Promise<void> => {
		await fetchData(true)
	}

	useEffect(() => {
		void fetchData()
	}, [])

	return { data, loading, refetch }
}
