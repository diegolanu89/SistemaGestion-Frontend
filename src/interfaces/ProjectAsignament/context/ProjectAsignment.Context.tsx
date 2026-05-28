// context/ProjectAssignmentProvider.tsx

import { PropsWithChildren, useMemo, useState } from 'react'

import { projectAssignmentContext } from '../hooks/useProjectAsignment.h'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

import { ProjectUserHoursDto } from '../../ViewProyect/models/ProyectViewInterface.m'

import { ProjectAssignmentFilter } from '../models/IProjectAsignment.m'

export const ProjectAssignmentProvider = ({ children }: PropsWithChildren) => {
	// =========================================================
	// 🔹 GLOBAL
	// =========================================================

	const [loading, setLoading] = useState(false)

	// =========================================================
	// 🔹 AVAILABLE PROJECTS
	// =========================================================

	const [projects, setProjects] = useState<ProjectDto[]>([])

	// =========================================================
	// 🔹 ASSIGNED PROJECTS
	// =========================================================

	const [assignedProjects, setAssignedProjects] = useState<ProjectDto[]>([])

	// =========================================================
	// 🔹 SELECTED PROJECT
	// =========================================================

	const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null)

	// =========================================================
	// 🔹 USERS
	// =========================================================

	const [users, setUsers] = useState<ProjectUserHoursDto[]>([])

	const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])

	// =========================================================
	// 🔹 SEARCH
	// =========================================================

	const [search, setSearch] = useState('')

	// =========================================================
	// 🔹 FILTERS
	// =========================================================

	const [client, setClient] = useState('')

	const [code, setCode] = useState('')

	const [status, setStatus] = useState('')

	const [selectedFilters, setSelectedFilters] = useState<ProjectAssignmentFilter[]>(['clients', 'projects', 'users'])

	// =========================================================
	// 🔹 UI
	// =========================================================

	const [isModalOpen, setIsModalOpen] = useState(false)

	// =========================================================
	// 🔹 MEMO
	// =========================================================

	const value = useMemo(
		() => ({
			// GLOBAL
			loading,
			setLoading,

			// AVAILABLE PROJECTS
			projects,
			setProjects,

			// ASSIGNED PROJECTS
			assignedProjects,
			setAssignedProjects,

			// SELECTED PROJECT
			selectedProject,
			setSelectedProject,

			// USERS
			users,
			setUsers,

			selectedUserIds,
			setSelectedUserIds,

			// SEARCH
			search,
			setSearch,

			// FILTERS
			client,
			setClient,

			code,
			setCode,

			status,
			setStatus,

			selectedFilters,
			setSelectedFilters,

			// UI
			isModalOpen,
			setIsModalOpen,
		}),
		[loading, projects, assignedProjects, selectedProject, users, selectedUserIds, search, client, code, status, selectedFilters, isModalOpen]
	)

	return (
		<projectAssignmentContext.Provider value={value}>
			{children}

			{loading && <SectionLoader />}
		</projectAssignmentContext.Provider>
	)
}
