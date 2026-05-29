import { PropsWithChildren, useCallback, useMemo, useState } from 'react'

import { projectAssignmentContext } from '../hooks/useProjectAsignment.h'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'
import { ProjectUserHoursDto } from '../../ViewProyect/models/ProyectViewInterface.m'

import { ProjectAssignmentFilter } from '../models/IProjectAsignment.m'
import { VisibleProjectDto } from '../models/VisibleProject.m'

import { visibleProjectsAdapter } from '../services/ProjectAsignamentAdapter.s'

export const ProjectAssignmentProvider = ({ children }: PropsWithChildren) => {
	const [loading, setLoading] = useState(false)

	const [projects, setProjects] = useState<ProjectDto[]>([])

	const [assignedProjects, setAssignedProjects] = useState<VisibleProjectDto[]>([])

	const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null)

	const [users, setUsers] = useState<ProjectUserHoursDto[]>([])

	const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])

	const [search, setSearch] = useState('')

	const [client, setClient] = useState('')

	const [code, setCode] = useState('')

	const [status, setStatus] = useState('')

	const [selectedFilters, setSelectedFilters] = useState<ProjectAssignmentFilter[]>(['clients', 'projects', 'users'])

	const [isModalOpen, setIsModalOpen] = useState(false)

	const loadVisibleProjects = useCallback(async (): Promise<number[]> => {
		try {
			setLoading(true)

			logger.infoTag(LogTag.View, '[PROJECT_ASSIGNMENT] loading visible projects')

			const visibleProjects = await visibleProjectsAdapter.getAll()

			setAssignedProjects(visibleProjects)

			const visibleIds = visibleProjects.map((item) => Number(item.project_id))

			logger.infoTag(LogTag.View, `[PROJECT_ASSIGNMENT] found ${visibleIds.length} visible projects`)

			return visibleIds
		} catch (error: unknown) {
			logger.errorTag(LogTag.View, error instanceof Error ? error.message : String(error))

			return []
		} finally {
			setLoading(false)
		}
	}, [])

	const saveVisibleProjects = useCallback(async () => {
		try {
			setLoading(true)

			const projectIds = assignedProjects.map((project) => Number(project.project_id))

			logger.infoTag(LogTag.View, '[PROJECT_ASSIGNMENT] saving visible projects', projectIds)

			await visibleProjectsAdapter.update({
				projectIds,
			})

			logger.infoTag(LogTag.View, '[PROJECT_ASSIGNMENT] visible projects saved successfully')

			const refreshedVisibleProjects = await visibleProjectsAdapter.getAll()

			setAssignedProjects(refreshedVisibleProjects)
		} catch (error: unknown) {
			logger.errorTag(LogTag.View, error instanceof Error ? error.message : String(error))

			throw error
		} finally {
			setLoading(false)
		}
	}, [assignedProjects])

	const value = useMemo(
		() => ({
			loading,
			setLoading,

			projects,
			setProjects,

			assignedProjects,
			setAssignedProjects,

			selectedProject,
			setSelectedProject,

			users,
			setUsers,

			selectedUserIds,
			setSelectedUserIds,

			search,
			setSearch,

			client,
			setClient,

			code,
			setCode,

			status,
			setStatus,

			selectedFilters,
			setSelectedFilters,

			isModalOpen,
			setIsModalOpen,

			loadVisibleProjects,
			saveVisibleProjects,
		}),
		[
			loading,
			projects,
			assignedProjects,
			selectedProject,
			users,
			selectedUserIds,
			search,
			client,
			code,
			status,
			selectedFilters,
			isModalOpen,
			loadVisibleProjects,
			saveVisibleProjects,
		]
	)

	return (
		<projectAssignmentContext.Provider value={value}>
			{children}

			{loading && <SectionLoader text="Procesando proyectos..." />}
		</projectAssignmentContext.Provider>
	)
}
