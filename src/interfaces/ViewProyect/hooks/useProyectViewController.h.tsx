import { useEffect, useCallback } from 'react'
import { useProyectViewContext } from './useProyectViewContext.h'
import { proyectViewAdapter } from '../services/ProyectViewAdapter.s'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

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

	const fetchProjects = useCallback(async () => {
		try {
			setLoading(true)
			setLoadingText('Cargando proyectos...')
			setError(null)

			logger.infoTag(LogTag.Adapter, '[PROJECT] Fetch start', { page, perPage, filters })

			const res = await proyectViewAdapter.getAll({
				page,
				per_page: perPage,
				search: filters.search || undefined,
				client: filters.client !== 'all' ? filters.client : undefined,
				status: filters.status !== 'all' ? filters.status : undefined,
				code: filters.code || undefined,
			})

			setProjects(res.data)
			setTotal(res.total)

			logger.infoTag(LogTag.Adapter, '[PROJECT] Fetch success', { count: res.data.length, total: res.total })
		} catch (e: unknown) {
			logger.errorTag(LogTag.Adapter, '[PROJECT] Fetch error', e)
			setError('Error al cargar proyectos')
		} finally {
			setLoading(false)
		}
	}, [page, perPage, filters.search, filters.client, filters.status, filters.code])

	const recalculateProjectHours = async (projectId: number): Promise<void> => {
		try {
			setLoading(true)
			setLoadingText('Recalculando horas del proyecto...')

			logger.infoTag(LogTag.Adapter, '[PROJECT] Recalculate start', { projectId })

			await proyectViewAdapter.recalculateHours(projectId)

			logger.infoTag(LogTag.Adapter, '[PROJECT] Recalculate success', { projectId })

			await fetchProjects()
		} catch (error: unknown) {
			logger.errorTag(LogTag.Adapter, '[PROJECT] Recalculate error', error)
			setError('Error al recalcular horas del proyecto')
		} finally {
			setLoading(false)
			setLoadingText('Cargando proyectos...')
		}
	}

	useEffect(() => {
		setPage(1)
	}, [filters.search, filters.client, filters.status, filters.code, setPage])

	const totalPages = Math.ceil(total / perPage)

	return {
		page,
		setPage,
		totalPages,
		filters,
		setFilters,
		recalculateProjectHours,
		fetchProjects,
	}
}
