// hooks/useProyectData.h.ts

import { useEffect, useState } from 'react'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { proyectAdapter } from '../services/ProyectAdapter.s'
import { getCache, setCache } from '../utils/getCache'
import { ProjectIntakeRecordDto } from '../models/ProyectDTO.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { LogProyectData } from '../models/ELogProyectData.m'

export const useProyectData = () => {
	const [data, setData] = useState<ProjectIntakeRecordDto[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	const fetchData = async (force: boolean = false): Promise<void> => {
		setLoading(true)

		try {
			// ==========================
			// 🔹 CACHE
			// ==========================
			if (!force) {
				const cached = getCache<ProjectIntakeRecordDto[]>(PROYECT_CONFIG.CACHE.KEYS.PROJECTS)

				if (cached) {
					logger.infoTag(LogTag.Adapter, `${LogProyectData.CACHE_HIT} -> key=${PROYECT_CONFIG.CACHE.KEYS.PROJECTS} count=${cached.length}`)

					setData(cached)
					setLoading(false)
					return
				}

				logger.infoTag(LogTag.Adapter, `${LogProyectData.CACHE_MISS} -> key=${PROYECT_CONFIG.CACHE.KEYS.PROJECTS}`)
			} else {
				logger.infoTag(LogTag.Adapter, LogProyectData.CACHE_FORCE)
			}

			// ==========================
			// 🔹 FETCH
			// ==========================
			logger.infoTag(LogTag.Adapter, LogProyectData.FETCH_START)

			const res: ProjectIntakeRecordDto[] = await proyectAdapter.list()

			logger.infoTag(LogTag.Adapter, `${LogProyectData.FETCH_SUCCESS} -> count=${res.length}`)

			setData(res)

			// ==========================
			// 🔹 CACHE SET
			// ==========================
			setCache<ProjectIntakeRecordDto[]>(PROYECT_CONFIG.CACHE.KEYS.PROJECTS, res, PROYECT_CONFIG.CACHE.TTL)

			logger.infoTag(LogTag.Adapter, `${LogProyectData.CACHE_SET} -> key=${PROYECT_CONFIG.CACHE.KEYS.PROJECTS}`)
		} catch (error: unknown) {
			const err = error instanceof Error ? error : new Error(LogProyectData.ERROR_UNKNOWN)

			logger.errorTag(LogTag.Adapter, err)
		} finally {
			setLoading(false)
		}
	}

	// ==========================
	// 🔥 REFETCH INTELIGENTE
	// ==========================
	const refetch = async (): Promise<void> => {
		// 👉 acá podrías limpiar cache si querés hard invalidation
		// clearCache(PROYECT_CONFIG.CACHE.KEYS.PROJECTS)

		await fetchData(true)
	}

	useEffect(() => {
		void fetchData()
	}, [])

	return {
		data,
		loading,
		refetch,
	}
}
