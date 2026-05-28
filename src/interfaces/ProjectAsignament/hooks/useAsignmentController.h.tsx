import { useEffect } from 'react'
import { useProjectAssignment } from './useProjectAsignment.h'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { proyectViewAdapter } from '../../ViewProyect/services/ProyectViewAdapter.s'

export const useProjectAssignmentController = () => {
	// =========================================================
	// 🔹 CONTEXT
	// =========================================================

	const {
		setLoading,

		projects,
		setProjects,

		assignedProjects,
		setAssignedProjects,

		search,
		client,
		code,
		status,

		isModalOpen,
		setIsModalOpen,
	} = useProjectAssignment()

	// =========================================================
	// 🔹 LOAD PROJECTS
	// =========================================================

	useEffect(() => {
		const loadProjects = async () => {
			try {
				setLoading(true)

				logger.infoTag(LogTag.View, '[PROJECT_ASSIGNMENT] loading projects')

				const response = await proyectViewAdapter.getAll({
					page: 1,

					per_page: 50,

					only_visible: true,

					search,
					client,
					code,
					status,
				})

				// =================================================
				// 🔹 AVAILABLE PROJECTS
				// =================================================

				setProjects(response.data)

				// =================================================
				// 🔹 TEMP ASSIGNED PROJECTS
				// =================================================

				// TODO:
				// Reemplazar por endpoint real de asignaciones

				setAssignedProjects(response.data.slice(0, 2))
			} catch (error) {
				logger.errorTag(LogTag.View, JSON.stringify(error))
			} finally {
				setLoading(false)
			}
		}

		void loadProjects()
	}, [search, client, code, status, setLoading, setProjects, setAssignedProjects])

	// =========================================================
	// 🔹 ACTIONS
	// =========================================================

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

	// =========================================================
	// 🔹 RETURN
	// =========================================================

	return {
		projects,

		assignedProjects,

		isModalOpen,

		openModal,
		closeModal,
	}
}
