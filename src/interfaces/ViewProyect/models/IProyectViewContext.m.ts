import { ProjectDto } from './ProyectViewDTO.m'

export interface Filters {
	search: string
	client: string
	status: string
	code: string
}

export interface IProyectViewContext {
	projects: ProjectDto[]
	setProjects: (projects: ProjectDto[]) => void

	loading: boolean
	setLoading: (value: boolean) => void

	loadingText: string
	setLoadingText: (value: string) => void

	error: string | null
	setError: (value: string | null) => void

	page: number
	setPage: (value: number) => void

	perPage: number
	setPerPage: (value: number) => void

	total: number
	setTotal: (value: number) => void

	filters: Filters
	setFilters: (filters: Filters) => void

	refetch?: () => Promise<void>
	setRefetch: React.Dispatch<React.SetStateAction<() => Promise<void>>>
}
