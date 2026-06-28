// model/IDashBoardContext.m.ts

import { Dispatch, SetStateAction } from 'react'

import {
	DashboardHoursFiltersDto,
	DashboardHoursResponseDto,
	DashboardFilterDto,
	DashboardHoursSourceType,
	CreateDashboardFilterDto,
	UpdateDashboardFilterDto,
} from './DashboardHoursDTO.m'

export interface IDashboardHoursContext {
	// =========================================================
	// 🔹 LOADING
	// =========================================================

	loading: boolean

	setLoading: Dispatch<SetStateAction<boolean>>

	// =========================================================
	// 🔹 DASHBOARD
	// =========================================================

	dashboard: DashboardHoursResponseDto | null

	setDashboard: Dispatch<SetStateAction<DashboardHoursResponseDto | null>>

	// =========================================================
	// 🔹 FILTERS
	// =========================================================

	filters: DashboardHoursFiltersDto

	setFilters: Dispatch<SetStateAction<DashboardHoursFiltersDto>>

	// =========================================================
	// 🔹 SAVED FILTERS
	// =========================================================

	savedFilters: DashboardFilterDto[]

	setSavedFilters: Dispatch<SetStateAction<DashboardFilterDto[]>>

	activeSavedFilterId: string

	setActiveSavedFilterId: Dispatch<SetStateAction<string>>

	// =========================================================
	// 🔹 FILTER SETTERS
	// =========================================================

	setLeaderId: (leaderId: string | null) => void

	setProjectId: (projectId: string | null) => void

	setMonthKeys: (monthKeys: string[]) => void

	setSourceType: (sourceType: DashboardHoursSourceType) => void

	// =========================================================
	// 🔹 FILTER ACTIONS
	// =========================================================

	clearFilters: () => void

	applySavedFilter: (filter: DashboardFilterDto) => void

	saveCurrentFilter: (data: CreateDashboardFilterDto) => Promise<void>

	updateSavedFilter: (id: number, data: UpdateDashboardFilterDto) => Promise<void>

	deleteSavedFilter: (id: number) => Promise<void>

	// =========================================================
	// 🔹 LOADERS
	// =========================================================

	loadDashboard: () => Promise<void>

	loadSavedFilters: () => Promise<void>

	refetch: () => Promise<void>
}
