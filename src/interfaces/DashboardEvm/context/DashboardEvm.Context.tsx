import { ReactNode, useMemo, useState } from 'react'

import { dashboardEvmContext } from '../hooks/useDashboardEvmContext.h'

import { IDashboardEvmContext } from '../models/IDashboardEvmContext.m'
import { DashboardEvmRowDto } from '../models/DashboardEvmDTO.m'
import { DashboardEvmFilters, DEFAULT_DASHBOARD_EVM_FILTERS } from '../models/DashboardEvmFilters.m'
import { ProjectTrackingDto } from '../models/ProjectTrackingDTO.m'

interface Props {
	children: ReactNode
}

export const DashboardEvmProvider = ({ children }: Props) => {
	const [rows, setRows] = useState<DashboardEvmRowDto[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const [filters, setFilters] = useState<DashboardEvmFilters>(DEFAULT_DASHBOARD_EVM_FILTERS)

	const [selectedRow, setSelectedRow] = useState<DashboardEvmRowDto | null>(null)
	const [tracking, setTracking] = useState<ProjectTrackingDto | null>(null)
	const [trackingLoading, setTrackingLoading] = useState<boolean>(false)
	const [trackingError, setTrackingError] = useState<string | null>(null)

	const [refetch, setRefetch] = useState<() => Promise<void>>(async () => {})

	const value = useMemo<IDashboardEvmContext>(
		() => ({
			rows,
			setRows,

			loading,
			setLoading,

			error,
			setError,

			filters,
			setFilters,

			selectedRow,
			setSelectedRow,

			tracking,
			setTracking,

			trackingLoading,
			setTrackingLoading,

			trackingError,
			setTrackingError,

			refetch,
			setRefetch,
		}),
		[rows, loading, error, filters, selectedRow, tracking, trackingLoading, trackingError, refetch]
	)

	return <dashboardEvmContext.Provider value={value}>{children}</dashboardEvmContext.Provider>
}
