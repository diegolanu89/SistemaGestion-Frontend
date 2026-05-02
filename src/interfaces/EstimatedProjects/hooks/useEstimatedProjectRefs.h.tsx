// hooks/useEstimatedProjectRefs.h.ts

import { useEffect, useState } from 'react'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { estimatedProjectAdapter } from '../services/EstimatedProjectAdapter.s'
import { getCache, setCache } from '../utils/getCache'
import { EstimatedProjectRefs } from '../models/EstimatedProjectRefs.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

export const useEstimatedProjectRefs = () => {
	const [refs, setRefs] = useState<EstimatedProjectRefs | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const fetchRefs = async (force: boolean = false): Promise<void> => {
		setLoading(true)

		try {
			if (!force) {
				const cached = getCache<EstimatedProjectRefs>(ESTIMATED_PROJECT_CONFIG.CACHE.KEYS.REFS)
				if (cached) {
					logger.infoTag(LogTag.Cache, '[ESTIMATED-PROYECT] refs cache hit')
					setRefs(cached)
					setLoading(false)
					return
				}
			}

			const [clients, users] = await Promise.all([estimatedProjectAdapter.getClients(), estimatedProjectAdapter.getUsers()])

			const value: EstimatedProjectRefs = { clients, users }

			setRefs(value)
			setCache<EstimatedProjectRefs>(ESTIMATED_PROJECT_CONFIG.CACHE.KEYS.REFS, value, ESTIMATED_PROJECT_CONFIG.CACHE.TTL)

			logger.infoTag(LogTag.Adapter, `[ESTIMATED-PROYECT] refs fetch success -> clients=${clients.length} users=${users.length}`)
		} catch (error: unknown) {
			const err = error instanceof Error ? error : new Error('Unknown error fetching refs')
			logger.errorTag(LogTag.Adapter, err)
		} finally {
			setLoading(false)
		}
	}

	const refetch = async (): Promise<void> => {
		await fetchRefs(true)
	}

	useEffect(() => {
		void fetchRefs()
	}, [])

	return { refs, loading, refetch }
}
