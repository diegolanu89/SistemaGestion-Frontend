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

const CACHE_KEY = 'projects_cache_v2'

const ETC_CACHE_KEY = 'projects_etc_cache'

// Limpia versiones anteriores del caché para evitar datos envenenados
localStorage.removeItem('projects_cache')
localStorage.removeItem('projects_etc_cache')

const CACHE_TTL = 1000 * 60 * 5

const MIN_LOADING_TIME = 1000

export const useProyectViewController = () => {
	const {
		setProjects,
		setLoading,
		setLoadingText,
		setError,

		page,
		setPage,

		perPage,

		total,
		setTotal,

		filters,
		setFilters,

		setRefetch,
	} = useProyectViewContext()

	const inFlightRef = useRef(false)

	const didFetchRef = useRef(false)

	const getKey = () =>
		JSON.stringify({
			page,
			perPage,

			search: filters.search,
			client: filters.client,
			status: filters.status,
			code: filters.code,
		})

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

	const fetchProjects = useCallback(
		async (force = false) => {
			const key = getKey()

			logger.infoTag(LogTag.Adapter, '[PROJECT] Request', {
				key,
				page,
				perPage,
				filters,
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
				const startTime = Date.now()

				setLoading(true)

				setLoadingText('Cargando proyectos...')

				setError(null)

				logger.infoTag(LogTag.Adapter, '[PROJECT] Fetch start', { key })

				const res = await proyectViewAdapter.getAll({
					page,
					per_page: perPage,

					search: filters.search || undefined,

					client: filters.client !== 'all' ? filters.client : undefined,

					status: filters.status !== 'all' ? filters.status : undefined,

					code: filters.code !== 'all' ? filters.code : undefined,
				})

				await new Promise((resolve) => setTimeout(resolve, 500))

				setLoadingText('Cargando métricas...')

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

				const elapsed = Date.now() - startTime

				const remaining = MIN_LOADING_TIME - elapsed

				if (remaining > 0) {
					await new Promise((resolve) => setTimeout(resolve, remaining))
				}
			} catch (e: unknown) {
				logger.errorTag(LogTag.Adapter, '[PROJECT] Fetch error', e)

				setError('Error al cargar proyectos')
			} finally {
				setLoading(false)

				inFlightRef.current = false

				logger.infoTag(LogTag.Adapter, '[PROJECT] Fetch end', {
					key,
				})
			}
		},
		[page, perPage, filters.search, filters.client, filters.status, filters.code]
	)
	const recalculateProjectHours = async (projectId: number): Promise<void> => {
		try {
			setLoading(true)

			setLoadingText('Recalculando horas del proyecto...')

			logger.infoTag(LogTag.Adapter, '[PROJECT] Recalculate start', {
				projectId,
			})

			await proyectViewAdapter.recalculateHours(projectId)

			logger.infoTag(LogTag.Adapter, '[PROJECT] Recalculate success', {
				projectId,
			})

			// Limpia cachés para forzar refresco real
			localStorage.removeItem(CACHE_KEY)

			localStorage.removeItem(ETC_CACHE_KEY)

			await fetchProjects(true)
		} catch (error: unknown) {
			logger.errorTag(LogTag.Adapter, '[PROJECT] Recalculate error', error)

			setError('Error al recalcular horas del proyecto')
		} finally {
			setLoading(false)

			setLoadingText('Cargando proyectos...')
		}
	}

	useEffect(() => {
		setRefetch(() => async () => {
			await fetchProjects(true)
		})
	}, [fetchProjects])

	useEffect(() => {
		if (didFetchRef.current) return

		didFetchRef.current = true

		logger.infoTag(LogTag.Adapter, '[PROJECT] Initial fetch')

		fetchProjects()
	}, [fetchProjects])

	useEffect(() => {
		logger.infoTag(LogTag.Adapter, '[PROJECT] Query changed', {
			page,
			perPage,
			filters,
		})

		fetchProjects()
	}, [page, perPage, filters.search, filters.client, filters.status, filters.code])

	useEffect(() => {
		setPage(1)
	}, [filters.search, filters.client, filters.status, filters.code])

	const totalPages = Math.ceil(total / perPage)

	return {
		page,
		setPage,

		totalPages,

		filters,
		setFilters,
		recalculateProjectHours,
	}
}
