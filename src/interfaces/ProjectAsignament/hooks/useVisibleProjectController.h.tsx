import { useEffect, useState } from 'react'

import { useProjectAssignment } from './useProjectAsignment.h'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

import { proyectViewAdapter } from '../../ViewProyect/services/ProyectViewAdapter.s'

export const useVisibleProjectsController = () => {
	const { assignedProjects } = useProjectAssignment()

	const [projects, setProjects] = useState<ProjectDto[]>([])

	useEffect(() => {
		const loadProjects = async () => {
			try {
				if (assignedProjects.length === 0) {
					setProjects([])

					return
				}

				const projectIds = assignedProjects.map((project) => Number(project.project_id))

				logger.infoTag(LogTag.View, `[VISIBLE_PROJECTS] loading ${projectIds.length} project details`)

				const detailedProjects = await Promise.all(projectIds.map((id) => proyectViewAdapter.getById(id)))

				setProjects(detailedProjects)

				logger.infoTag(LogTag.View, `[VISIBLE_PROJECTS] loaded ${detailedProjects.length} project details`)
			} catch (error: unknown) {
				logger.errorTag(LogTag.View, error instanceof Error ? error.message : String(error))

				setProjects([])
			}
		}

		void loadProjects()
	}, [assignedProjects])

	return {
		projects,
	}
}
