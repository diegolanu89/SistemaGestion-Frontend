// model/IProjectAssignmentContext.m.ts

import { Dispatch, SetStateAction } from 'react'

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

import { ProjectUserHoursDto } from '../../ViewProyect/models/ProyectViewInterface.m'
import { VisibleProjectDto } from './VisibleProject.m'

export type ProjectAssignmentFilter = 'clients' | 'projects' | 'users' | 'time_entries'

export interface IProjectAssignmentContext {
	loading: boolean

	setLoading: Dispatch<SetStateAction<boolean>>

	projects: ProjectDto[]

	setProjects: Dispatch<SetStateAction<ProjectDto[]>>

	assignedProjects: VisibleProjectDto[]

	setAssignedProjects: Dispatch<SetStateAction<VisibleProjectDto[]>>

	selectedProject: ProjectDto | null

	setSelectedProject: Dispatch<SetStateAction<ProjectDto | null>>

	users: ProjectUserHoursDto[]

	setUsers: Dispatch<SetStateAction<ProjectUserHoursDto[]>>

	selectedUserIds: number[]

	setSelectedUserIds: Dispatch<SetStateAction<number[]>>

	search: string

	setSearch: Dispatch<SetStateAction<string>>

	client: string

	setClient: Dispatch<SetStateAction<string>>

	code: string

	setCode: Dispatch<SetStateAction<string>>

	status: string

	setStatus: Dispatch<SetStateAction<string>>

	selectedFilters: ProjectAssignmentFilter[]

	setSelectedFilters: Dispatch<SetStateAction<ProjectAssignmentFilter[]>>

	isModalOpen: boolean

	setIsModalOpen: Dispatch<SetStateAction<boolean>>

	loadVisibleProjects: () => Promise<number[]>

	saveVisibleProjects: () => Promise<void>
}
