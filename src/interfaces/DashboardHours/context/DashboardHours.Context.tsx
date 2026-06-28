// providers/DashboardHoursProvider.tsx

import { ReactNode, useCallback, useMemo, useState } from 'react'

import { dashboardHoursContext } from '../hooks/useEstimatedProjectContext.h'

import { DashBoardHourAdapter } from '../services/DashBoardHourAdapter.s'

import { DashboardFiltersAdapter } from '../services/DashboardFiltersAdapter.s'

import { IDashboardHoursContext } from '../model/IDashBoardContext.m'

import {
	CreateDashboardFilterDto,
	DashboardFilterDto,
	DashboardHoursFiltersDto,
	DashboardHoursResponseDto,
	DashboardHoursSourceType,
	UpdateDashboardFilterDto,
} from '../model/DashboardHoursDTO.m'

interface Props {
	children: ReactNode
}

const buildDefaultMonthKeys = (): string[] => {
	const now = new Date()
	return Array.from({ length: 12 }, (_, i) => {
		const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
	})
}

export const DashboardHoursProvider = ({ children }: Props) => {
	// =========================================================
	// 🔹 STATE
	// =========================================================

	const [loading, setLoading] = useState<boolean>(false)

	const [dashboard, setDashboard] = useState<DashboardHoursResponseDto | null>(null)

	const [activeSavedFilterId, setActiveSavedFilterId] = useState<string>('')

	const [savedFilters, setSavedFilters] = useState<DashboardFilterDto[]>([])

	const [filters, setFilters] = useState<DashboardHoursFiltersDto>({
		leader_id: null,

		project_id: null,

		month_keys: buildDefaultMonthKeys(),

		source_type: 'ALL',
	})

	// =========================================================
	// 🔹 FILTER SETTERS
	// =========================================================

	const setLeaderId = useCallback((leaderId: string | null) => {
		setFilters((prev) => ({
			...prev,

			leader_id: leaderId,
		}))
	}, [])

	const setProjectId = useCallback((projectId: string | null) => {
		setFilters((prev) => ({
			...prev,

			project_id: projectId,
		}))
	}, [])

	const setMonthKeys = useCallback((monthKeys: string[]) => {
		setFilters((prev) => ({
			...prev,

			month_keys: monthKeys,
		}))
	}, [])

	const setSourceType = useCallback((sourceType: DashboardHoursSourceType) => {
		setFilters((prev) => ({
			...prev,

			source_type: sourceType,
		}))
	}, [])

	// =========================================================
	// 🔹 CLEAR FILTERS
	// =========================================================

	const clearFilters = useCallback(() => {
		setActiveSavedFilterId('')

		setFilters({
			leader_id: null,

			project_id: null,

			month_keys: buildDefaultMonthKeys(),

			source_type: 'ALL',
		})
	}, [])

	// =========================================================
	// 🔹 APPLY SAVED FILTER
	// =========================================================

	const applySavedFilter = useCallback((filter: DashboardFilterDto) => {
		setActiveSavedFilterId(String(filter.id))

		let parsedMonthKeys: string[] = []

		if (Array.isArray(filter.monthKeys)) {
			parsedMonthKeys = filter.monthKeys
		} else if (typeof filter.monthKeys === 'string') {
			try {
				const parsed = JSON.parse(filter.monthKeys)

				if (Array.isArray(parsed)) {
					parsedMonthKeys = parsed
				}
			} catch {
				parsedMonthKeys = []
			}
		}

		setFilters({
			leader_id: filter.leaderId ?? null,

			project_id: filter.projectId ?? null,

			month_keys: parsedMonthKeys,

			source_type: filter.sourceType ?? 'ALL',
		})
	}, [])

	// =========================================================
	// 🔹 LOAD DASHBOARD
	// =========================================================

	const loadDashboard = useCallback(async () => {
		setLoading(true)

		try {
			const response = await DashBoardHourAdapter.getDashboard(filters)

			setDashboard(response)
		} finally {
			setLoading(false)
		}
	}, [filters])

	// =========================================================
	// 🔹 LOAD SAVED FILTERS
	// =========================================================

	const loadSavedFilters = useCallback(async () => {
		const response = await DashboardFiltersAdapter.getAll()

		setSavedFilters(response)
	}, [])

	// =========================================================
	// 🔹 SAVE FILTER
	// =========================================================

	const saveCurrentFilter = useCallback(
		async (data: CreateDashboardFilterDto) => {
			await DashboardFiltersAdapter.create(data)

			await loadSavedFilters()
		},
		[loadSavedFilters]
	)

	// =========================================================
	// 🔹 UPDATE FILTER
	// =========================================================

	const updateSavedFilter = useCallback(
		async (id: number, data: UpdateDashboardFilterDto) => {
			await DashboardFiltersAdapter.update(id, data)

			await loadSavedFilters()
		},
		[loadSavedFilters]
	)

	// =========================================================
	// 🔹 DELETE FILTER
	// =========================================================

	const deleteSavedFilter = useCallback(async (id: number) => {
		await DashboardFiltersAdapter.delete(id)

		setSavedFilters((prev) => prev.filter((filter) => filter.id !== id))
	}, [])

	// =========================================================
	// 🔹 REFETCH
	// =========================================================

	const refetch = useCallback(async () => {
		await loadDashboard()
	}, [loadDashboard])

	// =========================================================
	// 🔹 CONTEXT VALUE
	// =========================================================

	const value: IDashboardHoursContext = useMemo(
		() => ({
			// ======================
			// 🔹 LOADING
			// ======================

			loading,

			setLoading,

			// ======================
			// 🔹 DASHBOARD
			// ======================

			dashboard,

			setDashboard,

			// ======================
			// 🔹 FILTERS
			// ======================

			filters,

			setFilters,

			// ======================
			// 🔹 SAVED FILTERS
			// ======================

			savedFilters,

			setSavedFilters,

			activeSavedFilterId,

			setActiveSavedFilterId,

			// ======================
			// 🔹 FILTER SETTERS
			// ======================

			setLeaderId,

			setProjectId,

			setMonthKeys,

			setSourceType,

			// ======================
			// 🔹 FILTER ACTIONS
			// ======================

			clearFilters,

			applySavedFilter,

			saveCurrentFilter,

			updateSavedFilter,

			deleteSavedFilter,

			// ======================
			// 🔹 LOADERS
			// ======================

			loadDashboard,

			loadSavedFilters,

			refetch,
		}),
		[
			loading,

			dashboard,

			filters,

			savedFilters,

			activeSavedFilterId,

			setLeaderId,

			setProjectId,

			setMonthKeys,

			setSourceType,

			clearFilters,

			applySavedFilter,

			saveCurrentFilter,

			updateSavedFilter,

			deleteSavedFilter,

			loadDashboard,

			loadSavedFilters,

			refetch,
		]
	)

	return <dashboardHoursContext.Provider value={value}>{children}</dashboardHoursContext.Provider>
}
