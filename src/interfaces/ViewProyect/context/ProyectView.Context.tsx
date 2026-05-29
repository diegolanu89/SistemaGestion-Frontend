// providers/ProyectViewProvider.tsx

import { useMemo, ReactNode, useState } from 'react'

import { IProyectViewContext } from '../models/IProyectViewContext.m'

import { proyectViewContext } from '../hooks/useProyectViewContext.h'

import { ProjectDto } from '../models/ProyectViewDTO.m'

import { ProjectTrackingDto } from '../models/IProjectTracking.m'

import { ChangeRequestDto } from '../models/IChange.m'

interface IProviderProps {
	children: ReactNode
}

export const ProyectViewProvider = ({ children }: IProviderProps) => {
	/* =====================================================
	🔹 PROJECTS
	===================================================== */

	const [projects, setProjects] = useState<ProjectDto[]>([])

	const [loading, setLoading] = useState(false)

	const [loadingText, setLoadingText] = useState('Cargando proyectos...')

	const [error, setError] = useState<string | null>(null)

	const [page, setPage] = useState(1)

	const [perPage, setPerPage] = useState(15)

	const [total, setTotal] = useState(0)

	const [filters, setFilters] = useState({
		search: '',
		client: 'all',
		status: 'all',
		code: 'all',
	})

	const [refetchFn, setRefetchFn] = useState<() => Promise<void>>(async () => {})

	/* =====================================================
	🔹 TRACKING
	===================================================== */

	const [tracking, setTracking] = useState<ProjectTrackingDto | null>(null)

	const [trackingLoading, setTrackingLoading] = useState(false)

	const [trackingError, setTrackingError] = useState<string | null>(null)

	/* =====================================================
	🔹 CHANGE REQUESTS
	===================================================== */

	const [changeRequests, setChangeRequests] = useState<ChangeRequestDto[]>([])

	const [changeRequestsLoading, setChangeRequestsLoading] = useState(false)

	const [changeRequestsError, setChangeRequestsError] = useState<string | null>(null)

	/* =====================================================
	🔹 CONTEXT
	===================================================== */

	const contextValue = useMemo<IProyectViewContext>(
		() => ({
			/* =========================================
			🔹 PROJECTS
			========================================= */

			projects,
			setProjects,

			loading,
			setLoading,

			loadingText,
			setLoadingText,

			error,
			setError,

			page,
			setPage,

			perPage,
			setPerPage,

			total,
			setTotal,

			filters,
			setFilters,

			refetch: refetchFn,
			setRefetch: setRefetchFn,

			/* =========================================
			🔹 TRACKING
			========================================= */

			tracking,
			setTracking,

			trackingLoading,
			setTrackingLoading,

			trackingError,
			setTrackingError,

			/* =========================================
			🔹 CHANGE REQUESTS
			========================================= */

			changeRequests,
			setChangeRequests,

			changeRequestsLoading,
			setChangeRequestsLoading,

			changeRequestsError,
			setChangeRequestsError,
		}),
		[
			/* =========================================
			🔹 PROJECTS
			========================================= */

			projects,
			loading,
			loadingText,
			error,
			page,
			perPage,
			total,
			filters,
			refetchFn,

			/* =========================================
			🔹 TRACKING
			========================================= */

			tracking,
			trackingLoading,
			trackingError,

			/* =========================================
			🔹 CHANGE REQUESTS
			========================================= */

			changeRequests,
			changeRequestsLoading,
			changeRequestsError,
		]
	)

	return <proyectViewContext.Provider value={contextValue}>{children}</proyectViewContext.Provider>
}
