import { Dispatch, SetStateAction } from 'react'
import { DashboardEvmRowDto } from './DashboardEvmDTO.m'
import { DashboardEvmFilters } from './DashboardEvmFilters.m'
import { ProjectTrackingDto } from './ProjectTrackingDTO.m'

export interface IDashboardEvmContext {
	rows: DashboardEvmRowDto[]
	setRows: Dispatch<SetStateAction<DashboardEvmRowDto[]>>

	loading: boolean
	setLoading: Dispatch<SetStateAction<boolean>>

	error: string | null
	setError: Dispatch<SetStateAction<string | null>>

	filters: DashboardEvmFilters
	setFilters: Dispatch<SetStateAction<DashboardEvmFilters>>

	tracking: ProjectTrackingDto | null
	setTracking: Dispatch<SetStateAction<ProjectTrackingDto | null>>

	trackingLoading: boolean
	setTrackingLoading: Dispatch<SetStateAction<boolean>>

	trackingError: string | null
	setTrackingError: Dispatch<SetStateAction<string | null>>

	refetch: () => Promise<void>
	setRefetch: Dispatch<SetStateAction<() => Promise<void>>>
}
