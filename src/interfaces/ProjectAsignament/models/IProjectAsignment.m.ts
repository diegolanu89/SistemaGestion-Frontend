// model/IProjectAssignmentContext.m.ts

import { Dispatch, SetStateAction } from 'react'

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

import { ProjectUserHoursDto } from '../../ViewProyect/models/ProyectViewInterface.m'

export type ProjectAssignmentFilter = 'clients' | 'projects' | 'users' | 'time_entries'

export interface IProjectAssignmentContext {
	// =========================================================
	// 🔹 GLOBAL
	// =========================================================

	loading: boolean

	setLoading: Dispatch<SetStateAction<boolean>>

	// =========================================================
	// 🔹 AVAILABLE PROJECTS
	// =========================================================

	projects: ProjectDto[]

	setProjects: Dispatch<SetStateAction<ProjectDto[]>>

	// =========================================================
	// 🔹 ASSIGNED PROJECTS
	// =========================================================

	assignedProjects: ProjectDto[]

	setAssignedProjects: Dispatch<SetStateAction<ProjectDto[]>>

	// =========================================================
	// 🔹 SELECTED PROJECT
	// =========================================================

	selectedProject: ProjectDto | null

	setSelectedProject: Dispatch<SetStateAction<ProjectDto | null>>

	// =========================================================
	// 🔹 USERS
	// =========================================================

	users: ProjectUserHoursDto[]

	setUsers: Dispatch<SetStateAction<ProjectUserHoursDto[]>>

	selectedUserIds: number[]

	setSelectedUserIds: Dispatch<SetStateAction<number[]>>

	// =========================================================
	// 🔹 SEARCH
	// =========================================================

	search: string

	setSearch: Dispatch<SetStateAction<string>>

	// =========================================================
	// 🔹 FILTERS
	// =========================================================

	client: string

	setClient: Dispatch<SetStateAction<string>>

	code: string

	setCode: Dispatch<SetStateAction<string>>

	status: string

	setStatus: Dispatch<SetStateAction<string>>

	selectedFilters: ProjectAssignmentFilter[]

	setSelectedFilters: Dispatch<SetStateAction<ProjectAssignmentFilter[]>>

	// =========================================================
	// 🔹 UI
	// =========================================================

	isModalOpen: boolean

	setIsModalOpen: Dispatch<SetStateAction<boolean>>
}
