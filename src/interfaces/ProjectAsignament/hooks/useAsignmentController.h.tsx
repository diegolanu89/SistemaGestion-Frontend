import { useCallback, useEffect } from 'react'

import { useProjectAssignment } from './useProjectAsignment.h'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { proyectViewAdapter } from '../../ViewProyect/services/ProyectViewAdapter.s'
import { clockifyUsersBDT } from '../../Configurations/services/ClockifyUsersBDT'

export const useProjectAssignmentController = () => {
	const {
		setLoading,

		projects,
		setProjects,

		assignedProjects,

		search,
		client,
		code,
		status,

		isModalOpen,
		setIsModalOpen,

		loadVisibleProjects,
	} = useProjectAssignment()

	const loadProjects = useCallback(async () => {
		const startedAt = performance.now()

		try {
			setLoading(true)

			logger.infoTag(LogTag.View, '[PROJECT_ASSIGNMENT] loading projects')

			const response = await proyectViewAdapter.getAll({
				page: 1,
				per_page: 500,
				only_visible: false,
				search,
				client,
				code,
				status,
			})

			logger.infoTag(LogTag.View, `[PROJECT_ASSIGNMENT] loaded ${response.data.length} projects`)

			setProjects(response.data)
		} catch (error: unknown) {
			logger.errorTag(LogTag.View, error instanceof Error ? error.message : String(error))
		} finally {
			const elapsed = performance.now() - startedAt

			logger.infoTag(LogTag.Performance, `[PROJECT_ASSIGNMENT] load completed in ${elapsed.toFixed(2)}ms`)

			setLoading(false)
		}
	}, [search, client, code, status, setLoading, setProjects])

	const refetch = useCallback(async () => {
		logger.infoTag(LogTag.View, '[PROJECT_ASSIGNMENT] sync projects requested')

		try {
			await clockifyUsersBDT.syncProjects()
			logger.infoTag(LogTag.View, '[PROJECT_ASSIGNMENT] sync completed')
		} catch (error: unknown) {
			logger.errorTag(LogTag.View, '[PROJECT_ASSIGNMENT] sync failed', error)
		}

		await loadProjects()

		await loadVisibleProjects()
	}, [loadProjects, loadVisibleProjects])

	useEffect(() => {
		const loadInitialData = async () => {
			await loadProjects()

			await loadVisibleProjects()
		}

		void loadInitialData()
	}, [loadProjects, loadVisibleProjects])

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

	return {
		projects,

		assignedProjects,

		isModalOpen,

		openModal,
		closeModal,

		refetch,
	}
}
