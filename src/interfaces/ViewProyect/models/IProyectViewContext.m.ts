import { Dispatch, SetStateAction } from 'react'

import { ProjectDto } from './ProyectViewDTO.m'

import { ProjectTrackingDto } from './IProjectTracking.m'

import { ChangeRequestDto } from './IChange.m'

/* =========================================================
🔹 FILTERS
========================================================= */

export interface Filters {
	search: string

	client: string

	status: string

	code: string
}

/* =========================================================
🔹 CONTEXT
========================================================= */

export interface IProyectViewContext {
	/* =====================================================
	🔹 PROJECTS
	===================================================== */

	projects: ProjectDto[]

	setProjects: Dispatch<SetStateAction<ProjectDto[]>>

	loading: boolean

	setLoading: Dispatch<SetStateAction<boolean>>

	loadingText: string

	setLoadingText: Dispatch<SetStateAction<string>>

	error: string | null

	setError: Dispatch<SetStateAction<string | null>>

	page: number

	setPage: Dispatch<SetStateAction<number>>

	perPage: number

	setPerPage: Dispatch<SetStateAction<number>>

	total: number

	setTotal: Dispatch<SetStateAction<number>>

	filters: Filters

	setFilters: Dispatch<SetStateAction<Filters>>

	refetch?: () => Promise<void>

	setRefetch: Dispatch<SetStateAction<() => Promise<void>>>

	/* =====================================================
	🔹 TRACKING
	===================================================== */

	tracking: ProjectTrackingDto | null

	setTracking: Dispatch<SetStateAction<ProjectTrackingDto | null>>

	trackingLoading: boolean

	setTrackingLoading: Dispatch<SetStateAction<boolean>>

	trackingError: string | null

	setTrackingError: Dispatch<SetStateAction<string | null>>

	/* =====================================================
	🔹 CHANGE REQUESTS
	===================================================== */

	changeRequests: ChangeRequestDto[]

	setChangeRequests: Dispatch<SetStateAction<ChangeRequestDto[]>>

	changeRequestsLoading: boolean

	setChangeRequestsLoading: Dispatch<SetStateAction<boolean>>

	changeRequestsError: string | null

	setChangeRequestsError: Dispatch<SetStateAction<string | null>>
}
