/* eslint-disable react-hooks/exhaustive-deps */
// hooks/useProyectData.h.ts

import { useEffect, useState } from 'react'

import { PROYECT_CONFIG } from '../models/ProyectConfig.m'

import { ProjectIntakeRecordDto, PaginatedProjectIntakeResponseDto } from '../models/ProyectDTO.m'

import { proyectAdapter } from '../services/ProyectAdapter.s'

import { getCache, setCache } from '../utils/getCache'

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

import { LogProyectData } from '../models/ELogProyectData.m'

export const useProyectData = (page: number, perPage: number) => {
	// ==========================
	// 🔹 STATE
	// ==========================

	const [data, setData] = useState<ProjectIntakeRecordDto[]>([])

	const [total, setTotal] = useState<number>(0)

	const [lastPage, setLastPage] = useState<number>(1)

	const [loading, setLoading] = useState<boolean>(true)

	// ==========================
	// 🔹 CACHE KEY
	// ==========================

	const cacheKey = `${PROYECT_CONFIG.CACHE.KEYS.PROJECTS}_${page}_${perPage}`

	// ==========================
	// 🔹 CACHE
	// ==========================

	const getCachedProjects = (): PaginatedProjectIntakeResponseDto | null => {
		const cached = getCache<PaginatedProjectIntakeResponseDto>(cacheKey)

		if (cached) {
			logger.infoTag(LogTag.Cache, `${LogProyectData.CACHE_HIT} -> key=${cacheKey} count=${cached.data.length}`)

			return cached
		}

		logger.infoTag(LogTag.Cache, `${LogProyectData.CACHE_MISS} -> key=${cacheKey}`)

		return null
	}

	const saveProjectsCache = (response: PaginatedProjectIntakeResponseDto): void => {
		setCache<PaginatedProjectIntakeResponseDto>(cacheKey, response, PROYECT_CONFIG.CACHE.TTL)

		logger.infoTag(LogTag.Cache, `${LogProyectData.CACHE_SET} -> key=${cacheKey}`)
	}

	// ==========================
	// 🔹 API
	// ==========================

	const fetchProjects = async (): Promise<PaginatedProjectIntakeResponseDto> => {
		logger.infoTag(LogTag.Adapter, `${LogProyectData.FETCH_START} -> page=${page} perPage=${perPage}`)

		const response = await proyectAdapter.list(page, perPage)

		logger.infoTag(LogTag.Adapter, `${LogProyectData.FETCH_SUCCESS} -> count=${response.data.length} total=${response.total}`)

		return response
	}

	// ==========================
	// 🔹 MAIN FETCH
	// ==========================

	const fetchData = async (force: boolean = false): Promise<void> => {
		setLoading(true)

		try {
			// ==========================
			// 🔹 CACHE FLOW
			// ==========================

			if (!force) {
				const cached = getCachedProjects()

				if (cached) {
					setData(cached.data)

					setTotal(cached.total)

					setLastPage(cached.lastPage)

					setLoading(false)

					return
				}
			} else {
				logger.infoTag(LogTag.Cache, LogProyectData.CACHE_FORCE)
			}

			// ==========================
			// 🔹 API FLOW
			// ==========================

			const response = await fetchProjects()

			console.log('[PROYECT][HOOK] response', response)

			setData(response.data)

			setTotal(response.total)

			setLastPage(response.lastPage)

			saveProjectsCache(response)
		} catch (error: unknown) {
			const err = error instanceof Error ? error : new Error(LogProyectData.ERROR_UNKNOWN)

			logger.errorTag(LogTag.Adapter, err)
		} finally {
			setLoading(false)
		}
	}

	// ==========================
	// 🔹 REFETCH
	// ==========================

	const refetch = async (): Promise<void> => {
		await fetchData(true)
	}

	// ==========================
	// 🔹 INITIAL LOAD
	// ==========================

	useEffect(() => {
		void fetchData()
	}, [page, perPage])

	// ==========================
	// 🔹 EXPOSE
	// ==========================

	return {
		data,

		total,

		lastPage,

		loading,

		refetch,
	}
}
