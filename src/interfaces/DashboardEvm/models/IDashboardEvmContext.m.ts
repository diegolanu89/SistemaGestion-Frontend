import { Dispatch, SetStateAction } from 'react'
import { DashboardEvmRowDto } from './DashboardEvmDTO.m'
import { DashboardEvmFilters } from './DashboardEvmFilters.m'
import { ChangeRequestDto } from './ChangeRequestDTO.m'
import { ProjectTrackingDto } from './ProjectTrackingDTO.m'

/**
 * Discrimina qué modal está abierto sobre el proyecto seleccionado.
 *  - 'changes':  modal "Control de cambios" (tabla de change requests)
 *  - 'tracking': modal "Seguimiento: planificación y fechas"
 *  - null:       ninguno
 */
export type DashboardEvmModalType = 'changes' | 'tracking' | null

export interface IDashboardEvmContext {
	rows: DashboardEvmRowDto[]
	setRows: Dispatch<SetStateAction<DashboardEvmRowDto[]>>

	loading: boolean
	setLoading: Dispatch<SetStateAction<boolean>>

	error: string | null
	setError: Dispatch<SetStateAction<string | null>>

	filters: DashboardEvmFilters
	setFilters: Dispatch<SetStateAction<DashboardEvmFilters>>

	selectedRow: DashboardEvmRowDto | null
	setSelectedRow: Dispatch<SetStateAction<DashboardEvmRowDto | null>>

	modalType: DashboardEvmModalType
	setModalType: Dispatch<SetStateAction<DashboardEvmModalType>>

	// ----- Change requests modal -----
	changeRequests: ChangeRequestDto[] | null
	setChangeRequests: Dispatch<SetStateAction<ChangeRequestDto[] | null>>

	changeRequestsLoading: boolean
	setChangeRequestsLoading: Dispatch<SetStateAction<boolean>>

	changeRequestsError: string | null
	setChangeRequestsError: Dispatch<SetStateAction<string | null>>

	// ----- Tracking modal -----
	tracking: ProjectTrackingDto | null
	setTracking: Dispatch<SetStateAction<ProjectTrackingDto | null>>

	trackingLoading: boolean
	setTrackingLoading: Dispatch<SetStateAction<boolean>>

	trackingError: string | null
	setTrackingError: Dispatch<SetStateAction<string | null>>

	refetch: () => Promise<void>
	setRefetch: Dispatch<SetStateAction<() => Promise<void>>>
}
