/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useCallback } from 'react'
import { useProyectViewContext } from './useProyectViewContext.h'
import { proyectViewAdapter } from '../services/ProyectViewAdapter.s'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import type { ProjectDto } from '../models/ProyectViewDTO.m'
import { etcAdapter } from '../../Etc/service/EtcAdapter'

type ProjectWithEtc = ProjectDto & {
	etcHours?: number
}

type CacheEntry = {
	data: ProjectWithEtc[]
	total: number
	timestamp: number
}

const CACHE_KEY = 'projects_cache'
const ETC_CACHE_KEY = 'projects_etc_cache'

const CACHE_TTL = 1000 * 60 * 5

export const useProyectViewController = () => {
	const { setProjects, setLoading, setError, page, setPage, perPage, total, setTotal, filters, setFilters, setRefetch } = useProyectViewContext()

	const inFlightRef = useRef(false)
	const didFetchRef = useRef(false)

	const getKey = () => `${page}-${perPage}`

	// =========================
	// CACHE HELPERS
	// =========================

	const getCache = (key: string): CacheEntry | null => {
		try {
			const raw = localStorage.getItem(CACHE_KEY)
			if (!raw) return null

			const cache = JSON.parse(raw)
			const entry = cache[key]

			if (!entry) return null

			const isExpired = Date.now() - entry.timestamp > CACHE_TTL

			if (isExpired) {
				logger.infoTag(LogTag.Cache, '[PROJECT] Cache expired', { key })
				return null
			}

			logger.infoTag(LogTag.Cache, '[PROJECT] Cache hit', { key })

			return entry
		} catch {
			return null
		}
	}

	const setCache = (key: string, value: CacheEntry) => {
		try {
			const raw = localStorage.getItem(CACHE_KEY)
			const cache = raw ? JSON.parse(raw) : {}

			cache[key] = value

			localStorage.setItem(CACHE_KEY, JSON.stringify(cache))

			logger.infoTag(LogTag.Cache, '[PROJECT] Cache stored', {
				key,
				size: value.data.length,
			})
		} catch {}
	}

	// =========================
	// ETC CACHE (por projectId)
	// =========================

	const getEtcCache = (): Record<number, number> => {
		try {
			const raw = localStorage.getItem(ETC_CACHE_KEY)
			return raw ? JSON.parse(raw) : {}
		} catch {
			return {}
		}
	}

	const setEtcCache = (cache: Record<number, number>) => {
		try {
			localStorage.setItem(ETC_CACHE_KEY, JSON.stringify(cache))
		} catch {}
	}

	// =========================
	// FETCH
	// =========================

	const fetchProjects = useCallback(
		async (force = false) => {
			const key = getKey()

			logger.infoTag(LogTag.Adapter, '[PROJECT] Request', {
				key,
				page,
				perPage,
				force,
			})

			if (!force) {
				const cached = getCache(key)

				if (cached) {
					setProjects(cached.data)
					setTotal(cached.total)
					return
				}

				logger.infoTag(LogTag.Cache, '[PROJECT] Cache miss', { key })
			}

			if (inFlightRef.current) {
				logger.infoTag(LogTag.Adapter, '[PROJECT] Skipped (in flight)', { key })
				return
			}

			inFlightRef.current = true

			try {
				setLoading(true)
				setError(null)

				logger.infoTag(LogTag.Adapter, '[PROJECT] Fetch start', { key })

				const res = await proyectViewAdapter.getAll({
					page,
					per_page: perPage,
				})

				// =========================
				// ETC ORQUESTACIÓN
				// =========================

				const etcCache = getEtcCache()

				const enriched: ProjectWithEtc[] = await Promise.all(
					res.data.map(async (p) => {
						if (!force && etcCache[p.id]) {
							return {
								...p,
								etcHours: etcCache[p.id],
							}
						}

						try {
							const etc = await etcAdapter.getByProject(p.id)

							const totalEtc = etc.records.reduce((acc, r) => acc + Number(r.hours), 0)

							etcCache[p.id] = totalEtc

							return {
								...p,
								etcHours: totalEtc,
							}
						} catch {
							return {
								...p,
								etcHours: 0,
							}
						}
					})
				)

				setEtcCache(etcCache)

				logger.infoTag(LogTag.Adapter, '[PROJECT] Fetch success', {
					key,
					count: enriched.length,
					total: res.total,
				})

				setCache(key, {
					data: enriched,
					total: res.total,
					timestamp: Date.now(),
				})

				setProjects(enriched)
				setTotal(res.total)
			} catch (e: unknown) {
				logger.errorTag(LogTag.Adapter, '[PROJECT] Fetch error', e)
				setError('Error al cargar proyectos')
			} finally {
				setLoading(false)
				inFlightRef.current = false

				logger.infoTag(LogTag.Adapter, '[PROJECT] Fetch end', { key })
			}
		},
		[page, perPage]
	)

	// =========================
	// EFFECTS
	// =========================

	useEffect(() => {
		setRefetch(() => fetchProjects(true))
	}, [fetchProjects])

	useEffect(() => {
		if (didFetchRef.current) return
		didFetchRef.current = true

		logger.infoTag(LogTag.Adapter, '[PROJECT] Initial fetch')

		fetchProjects()
	}, [fetchProjects])

	useEffect(() => {
		logger.infoTag(LogTag.Adapter, '[PROJECT] Page change', {
			page,
			perPage,
		})

		fetchProjects()
	}, [page, perPage])

	const totalPages = Math.ceil(total / perPage)

	return {
		page,
		setPage,
		totalPages,
		filters,
		setFilters,
	}
}
