import { useEffect, useState } from 'react'
import { proyectAdapter } from '../services/ProyectAdapter.s'
import { getCache, setCache } from '../utils/getCache'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { ProyectRefs } from '../models/ProyectRefs.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { LogProyectRefs } from '../models/ELogProyectRefs.m'

export const useProyectRefs = () => {
	const [refs, setRefs] = useState<ProyectRefs | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const fetchRefs = async (force: boolean = false): Promise<void> => {
		setLoading(true)

		try {
			// ==========================
			// 🔹 CACHE
			// ==========================
			if (!force) {
				const cached = getCache<ProyectRefs>(PROYECT_CONFIG.CACHE.KEYS.REFS)

				if (cached) {
					logger.infoTag(LogTag.Adapter, `${LogProyectRefs.CACHE_HIT}`)

					setRefs(cached)
					setLoading(false)
					return
				}

				logger.infoTag(LogTag.Adapter, `${LogProyectRefs.CACHE_MISS}`)
			} else {
				logger.infoTag(LogTag.Adapter, LogProyectRefs.CACHE_FORCE)
			}

			// ==========================
			// 🔹 FETCH
			// ==========================
			logger.infoTag(LogTag.Adapter, LogProyectRefs.FETCH_START)

			const [statuses, categories, types] = await Promise.all([proyectAdapter.getStatuses(), proyectAdapter.getCategories(), proyectAdapter.getTypes()])

			const data: ProyectRefs = {
				statuses,
				categories,
				types,
			}

			setRefs(data)

			logger.infoTag(LogTag.Adapter, `${LogProyectRefs.FETCH_SUCCESS}`)

			// ==========================
			// 🔹 CACHE SET
			// ==========================
			setCache<ProyectRefs>(PROYECT_CONFIG.CACHE.KEYS.REFS, data, PROYECT_CONFIG.CACHE.TTL)

			logger.infoTag(LogTag.Adapter, `${LogProyectRefs.CACHE_SET}`)
		} catch (error: unknown) {
			const err = error instanceof Error ? error : new Error(LogProyectRefs.ERROR_UNKNOWN)

			logger.errorTag(LogTag.Adapter, err)
		} finally {
			setLoading(false)
		}
	}

	// ==========================
	// 🔥 REFRESH EXPUESTO
	// ==========================
	const refetch = async (): Promise<void> => {
		await fetchRefs(true)
	}

	useEffect(() => {
		void fetchRefs()
	}, [])

	return {
		refs,
		loading,
		refetch,
	}
}
